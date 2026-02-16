/**
 * Cloudflare Pages Function — Activity Dashboard Queries (Admin Only)
 * GET /api/telemetry/activity?type=overview|sessions|events|subscribers
 * 
 * Protected: requires admin session token in Authorization header.
 * Returns data for the Tele Logs dashboard.
 */

import { createDb } from '../../../src/db/index.js';
import { visitors, sessions, events, subscribers } from '../../../src/db/schema.js';
import { eq, desc, count, sql } from 'drizzle-orm';

export async function onRequestGet(context) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  try {
    // Verify admin auth
    const authHeader = context.request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: corsHeaders }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    try {
      const decoded = atob(token);
      const [username] = decoded.split(':');
      if (username !== context.env.ADMIN_USERNAME) {
        return new Response(
          JSON.stringify({ error: 'Invalid token' }),
          { status: 403, headers: corsHeaders }
        );
      }
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid token format' }),
        { status: 403, headers: corsHeaders }
      );
    }

    // Parse query params
    const url = new URL(context.request.url);
    const queryType = url.searchParams.get('type') || 'overview';
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 200);
    const offset = parseInt(url.searchParams.get('offset') || '0');

    const db = createDb(context.env.twfs_telemetry);
    // console.log(`[activity] Fetching activity data, type: ${queryType}`);
    let result;

    switch (queryType) {
      case 'overview':
        result = await getOverview(db);
        break;
      case 'sessions':
        result = await getSessions(db, limit, offset);
        break;
      case 'events':
        result = await getEvents(db, limit, offset);
        break;
      case 'subscribers':
        result = await getSubscribers(db, limit, offset);
        break;
      case 'visitors':
        result = await getVisitors(db, limit, offset);
        break;
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid query type. Use: overview, sessions, events, subscribers, visitors' }),
          { status: 400, headers: corsHeaders }
        );
    }

    return new Response(
      JSON.stringify({ success: true, type: queryType, ...result }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Telemetry activity error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch activity data' }),
      { status: 500, headers: corsHeaders }
    );
  }
}

/**
 * Get overview stats
 */
async function getOverview(db) {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const [visitorsCount, sessionsCount, eventsCount, subscribersCount, recentEvents] = await Promise.all([
    db.select({ count: count() }).from(visitors).get(),
    db.select({ count: count() }).from(sessions).get(),
    db.select({ count: count() }).from(events).get(),
    db.select({ count: count() }).from(subscribers).get(),
    db.select({
      event_type: events.eventType,
      count: count(),
    })
      .from(events)
      .where(sql`${events.createdAt} > ${twentyFourHoursAgo}`)
      .groupBy(events.eventType)
      .orderBy(desc(count()))
      .limit(10)
      .all(),
  ]);

  return {
    stats: {
      total_visitors: visitorsCount.count,
      total_sessions: sessionsCount.count,
      total_events: eventsCount.count,
      total_subscribers: subscribersCount.count,
    },
    recent_event_types: recentEvents,
  };
}

/**
 * Get sessions with visitor info
 */
async function getSessions(db, limit, offset) {
  const results = await db
    .select({
      session_id: sessions.sessionId,
      visitor_id: sessions.visitorId,
      email: visitors.email,
      started_at: sessions.startedAt,
      last_active_at: sessions.lastActiveAt,
      user_agent: sessions.userAgent,
      cf_country: sessions.cfCountry,
      cf_city: sessions.cfCity,
      event_count: sql`(SELECT COUNT(*) FROM ${events} WHERE ${events.sessionId} = ${sessions.sessionId})`.as('event_count'),
    })
    .from(sessions)
    .leftJoin(visitors, eq(sessions.visitorId, visitors.visitorId))
    .orderBy(desc(sessions.startedAt))
    .limit(limit)
    .offset(offset)
    .all();

  const countResult = await db.select({ total: count() }).from(sessions).get();

  return {
    sessions: results,
    total: countResult.total,
    limit,
    offset,
  };
}

/**
 * Get events with session and visitor info
 */
async function getEvents(db, limit, offset) {
  const results = await db
    .select({
      id: events.id,
      visitor_id: events.visitorId,
      email: visitors.email,
      session_id: events.sessionId,
      event_type: events.eventType,
      page: events.page,
      element: events.element,
      metadata: events.metadata,
      created_at: events.createdAt,
      cf_country: sessions.cfCountry,
      cf_city: sessions.cfCity,
    })
    .from(events)
    .leftJoin(visitors, eq(events.visitorId, visitors.visitorId))
    .leftJoin(sessions, eq(events.sessionId, sessions.sessionId))
    .orderBy(desc(events.createdAt))
    .limit(limit)
    .offset(offset)
    .all();

  const countResult = await db.select({ total: count() }).from(events).get();

  return {
    events: results,
    total: countResult.total,
    limit,
    offset,
  };
}

/**
 * Get subscribers with activity summary
 */
async function getSubscribers(db, limit, offset) {
  // Fetch subscribers with visitor info
  const results = await db
    .select({
      id: subscribers.id,
      email: subscribers.email,
      visitor_id: subscribers.visitorId,
      subscribed_at: subscribers.subscribedAt,
      first_seen_at: visitors.firstSeenAt,
      last_seen_at: visitors.lastSeenAt,
    })
    .from(subscribers)
    .leftJoin(visitors, eq(subscribers.visitorId, visitors.visitorId))
    .orderBy(desc(subscribers.subscribedAt))
    .limit(limit)
    .offset(offset)
    .all();

  // Fetch event and session counts for each subscriber
  const enrichedResults = await Promise.all(
    results.map(async (subscriber) => {
      if (!subscriber.visitor_id) {
        return { ...subscriber, total_events: 0, total_sessions: 0 };
      }

      const [eventCount, sessionCount] = await Promise.all([
        db.select({ count: count() })
          .from(events)
          .where(eq(events.visitorId, subscriber.visitor_id))
          .get(),
        db.select({ count: count() })
          .from(sessions)
          .where(eq(sessions.visitorId, subscriber.visitor_id))
          .get(),
      ]);

      return {
        ...subscriber,
        total_events: eventCount.count,
        total_sessions: sessionCount.count,
      };
    })
  );

  const countResult = await db.select({ total: count() }).from(subscribers).get();

  return {
    subscribers: enrichedResults,
    total: countResult.total,
    limit,
    offset,
  };
}

/**
 * Get visitors with activity summary
 */
async function getVisitors(db, limit, offset) {
  // Fetch visitors
  const results = await db
    .select({
      visitor_id: visitors.visitorId,
      email: visitors.email,
      first_seen_at: visitors.firstSeenAt,
      last_seen_at: visitors.lastSeenAt,
    })
    .from(visitors)
    .orderBy(desc(visitors.lastSeenAt))
    .limit(limit)
    .offset(offset)
    .all();

  // Fetch event and session counts for each visitor
  const enrichedResults = await Promise.all(
    results.map(async (visitor) => {
      const [eventCount, sessionCount] = await Promise.all([
        db.select({ count: count() })
          .from(events)
          .where(eq(events.visitorId, visitor.visitor_id))
          .get(),
        db.select({ count: count() })
          .from(sessions)
          .where(eq(sessions.visitorId, visitor.visitor_id))
          .get(),
      ]);

      return {
        ...visitor,
        total_events: eventCount.count,
        total_sessions: sessionCount.count,
      };
    })
  );

  const countResult = await db.select({ total: count() }).from(visitors).get();

  return {
    visitors: enrichedResults,
    total: countResult.total,
    limit,
    offset,
  };
}

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

/**
 * Cloudflare Pages Function — Activity Dashboard Queries (Admin Only)
 * GET /api/telemetry/activity?type=overview|sessions|events|subscribers
 * 
 * Protected: requires admin session token in Authorization header.
 * Returns data for the OTel Logs dashboard.
 */

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

    const db = context.env.twfs_telemetry;
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
  const [visitorsCount, sessionsCount, eventsCount, subscribersCount, recentEvents, topPages] = await Promise.all([
    db.prepare('SELECT COUNT(*) as count FROM visitors').first(),
    db.prepare('SELECT COUNT(*) as count FROM sessions').first(),
    db.prepare('SELECT COUNT(*) as count FROM events').first(),
    db.prepare('SELECT COUNT(*) as count FROM subscribers').first(),
    db.prepare(`
      SELECT event_type, COUNT(*) as count 
      FROM events 
      WHERE created_at > datetime('now', '-24 hours')
      GROUP BY event_type 
      ORDER BY count DESC 
      LIMIT 10
    `).all(),
    // db.prepare(`
    //   SELECT page, COUNT(*) as count 
    //   FROM events 
    //   WHERE event_type = 'page.view'
    //   GROUP BY page 
    //   ORDER BY count DESC 
    //   LIMIT 10
    // `).all(),
  ]);

  return {
    stats: {
      total_visitors: visitorsCount.count,
      total_sessions: sessionsCount.count,
      total_events: eventsCount.count,
      total_subscribers: subscribersCount.count,
    },
    recent_event_types: recentEvents.results,
    // top_pages: topPages.results,
  };
}

/**
 * Get sessions with visitor info
 */
async function getSessions(db, limit, offset) {
  const { results } = await db.prepare(`
    SELECT 
      s.session_id,
      s.visitor_id,
      v.email,
      s.started_at,
      s.last_active_at,
      s.user_agent,
      s.cf_country,
      s.cf_city,
      (SELECT COUNT(*) FROM events WHERE session_id = s.session_id) as event_count
    FROM sessions s
    LEFT JOIN visitors v ON s.visitor_id = v.visitor_id
    ORDER BY s.started_at DESC
    LIMIT ? OFFSET ?
  `).bind(limit, offset).all();

  const countResult = await db.prepare('SELECT COUNT(*) as total FROM sessions').first();

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
  const { results } = await db.prepare(`
    SELECT 
      e.id,
      e.visitor_id,
      v.email,
      e.session_id,
      e.event_type,
      e.page,
      e.element,
      e.metadata,
      e.created_at,
      s.cf_country,
      s.cf_city
    FROM events e
    LEFT JOIN visitors v ON e.visitor_id = v.visitor_id
    LEFT JOIN sessions s ON e.session_id = s.session_id
    ORDER BY e.created_at DESC
    LIMIT ? OFFSET ?
  `).bind(limit, offset).all();

  const countResult = await db.prepare('SELECT COUNT(*) as total FROM events').first();

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
  const { results } = await db.prepare(`
    SELECT 
      sub.id,
      sub.email,
      sub.visitor_id,
      sub.subscribed_at,
      v.first_seen_at,
      v.last_seen_at,
      (SELECT COUNT(*) FROM events WHERE visitor_id = sub.visitor_id) as total_events,
      (SELECT COUNT(*) FROM sessions WHERE visitor_id = sub.visitor_id) as total_sessions
    FROM subscribers sub
    LEFT JOIN visitors v ON sub.visitor_id = v.visitor_id
    ORDER BY sub.subscribed_at DESC
    LIMIT ? OFFSET ?
  `).bind(limit, offset).all();

  const countResult = await db.prepare('SELECT COUNT(*) as total FROM subscribers').first();

  return {
    subscribers: results,
    total: countResult.total,
    limit,
    offset,
  };
}

/**
 * Get visitors with activity summary
 */
async function getVisitors(db, limit, offset) {
  const { results } = await db.prepare(`
    SELECT 
      v.visitor_id,
      v.email,
      v.first_seen_at,
      v.last_seen_at,
      (SELECT COUNT(*) FROM events WHERE visitor_id = v.visitor_id) as total_events,
      (SELECT COUNT(*) FROM sessions WHERE visitor_id = v.visitor_id) as total_sessions
    FROM visitors v
    ORDER BY v.last_seen_at DESC
    LIMIT ? OFFSET ?
  `).bind(limit, offset).all();

  const countResult = await db.prepare('SELECT COUNT(*) as total FROM visitors').first();

  return {
    visitors: results,
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

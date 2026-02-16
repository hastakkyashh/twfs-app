/**
 * Cloudflare Pages Function — Event Tracking Ingestion
 * POST /api/telemetry/track
 * 
 * Receives batched events from the client tracker.
 * Upserts visitor and session, then inserts all events.
 */

import { createDb } from '../../../src/db/index.js';
import { visitors, sessions, events as eventsTable } from '../../../src/db/schema.js';

export async function onRequestPost(context) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  try {
    const body = await context.request.json();
    const { visitor_id, session_id, events } = body;

    // Validate required fields
    if (!visitor_id || !session_id || !Array.isArray(events)) {
      return new Response(
        JSON.stringify({ error: 'visitor_id, session_id, and events array are required' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Extract CF geo data
    const cf = context.request.cf || {};
    const cfCountry = cf.country || null;
    const cfCity = cf.city || null;
    const cfRegion = cf.region || null;
    const userAgent = context.request.headers.get('User-Agent') || null;

    const db = createDb(context.env.twfs_telemetry);

    // console.log(`[track] Tracking ${events.length} events for visitor: ${visitor_id}, session: ${session_id}`);

    // Upsert visitor
    await db.insert(visitors)
      .values({
        visitorId: visitor_id,
        firstSeenAt: new Date().toISOString(),
        lastSeenAt: new Date().toISOString(),
      })
      .onConflictDoUpdate({
        target: visitors.visitorId,
        set: {
          lastSeenAt: new Date().toISOString(),
        },
      })
      .run();

    // Upsert session
    await db.insert(sessions)
      .values({
        sessionId: session_id,
        visitorId: visitor_id,
        startedAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
        userAgent: userAgent,
        cfCountry: cfCountry,
        cfCity: cfCity,
        cfRegion: cfRegion,
      })
      .onConflictDoUpdate({
        target: sessions.sessionId,
        set: {
          lastActiveAt: new Date().toISOString(),
        },
      })
      .run();

    // Insert events in batch
    const eventValues = events.map((event) => ({
      visitorId: visitor_id,
      sessionId: session_id,
      eventType: event.event_type || 'unknown',
      page: event.page || null,
      element: event.element || null,
      metadata: event.metadata || null,
      createdAt: event.timestamp || new Date().toISOString(),
    }));

    // Execute batch insert
    await db.insert(eventsTable).values(eventValues).run();

    // console.log(`[track] Successfully tracked ${events.length} events`);

    return new Response(
      JSON.stringify({ success: true, events_received: events.length }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Telemetry track error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to store events' }),
      { status: 500, headers: corsHeaders }
    );
  }
}

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

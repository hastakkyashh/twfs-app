/**
 * Cloudflare Pages Function — Event Tracking Ingestion
 * POST /api/telemetry/track
 * 
 * Receives batched events from the client tracker.
 * Upserts visitor and session, then inserts all events.
 */

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

    const db = context.env.twfs_telemetry;

    // Upsert visitor
    await db.prepare(`
      INSERT INTO visitors (visitor_id, first_seen_at, last_seen_at)
      VALUES (?, datetime('now'), datetime('now'))
      ON CONFLICT(visitor_id) DO UPDATE SET last_seen_at = datetime('now')
    `).bind(visitor_id).run();

    // Upsert session
    await db.prepare(`
      INSERT INTO sessions (session_id, visitor_id, started_at, last_active_at, user_agent, cf_country, cf_city, cf_region)
      VALUES (?, ?, datetime('now'), datetime('now'), ?, ?, ?, ?)
      ON CONFLICT(session_id) DO UPDATE SET last_active_at = datetime('now')
    `).bind(session_id, visitor_id, userAgent, cfCountry, cfCity, cfRegion).run();

    // Insert events in batch
    const insertStmt = db.prepare(`
      INSERT INTO events (visitor_id, session_id, event_type, page, element, metadata, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const batch = events.map((event) => {
      return insertStmt.bind(
        visitor_id,
        session_id,
        event.event_type || 'unknown',
        event.page || null,
        event.element || null,
        event.metadata || null,
        event.timestamp || new Date().toISOString()
      );
    });

    // Execute batch
    await db.batch(batch);

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

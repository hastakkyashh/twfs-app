/**
 * Cloudflare Pages Function — User Identity Resolution
 * POST /api/telemetry/identify
 * 
 * Links an email to a visitor_id.
 * If the email already exists under a different visitor_id, merges the old data.
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
    const { visitor_id, email } = body;

    // Validate required fields
    if (!visitor_id || !email) {
      return new Response(
        JSON.stringify({ error: 'visitor_id and email are required' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const db = context.env.twfs_telemetry;

    // Check if this email already exists under a DIFFERENT visitor_id
    const existingVisitor = await db.prepare(`
      SELECT visitor_id FROM visitors WHERE email = ? AND visitor_id != ?
    `).bind(normalizedEmail, visitor_id).first();

    if (existingVisitor) {
      // Merge: transfer all data from old visitor_id to current visitor_id
      const oldVisitorId = existingVisitor.visitor_id;

      // Update events to point to new visitor_id
      await db.prepare(`
        UPDATE events SET visitor_id = ? WHERE visitor_id = ?
      `).bind(visitor_id, oldVisitorId).run();

      // Update sessions to point to new visitor_id
      await db.prepare(`
        UPDATE sessions SET visitor_id = ? WHERE visitor_id = ?
      `).bind(visitor_id, oldVisitorId).run();

      // Delete the old visitor record
      await db.prepare(`
        DELETE FROM visitors WHERE visitor_id = ?
      `).bind(oldVisitorId).run();

      // Update subscriber record to new visitor_id
      await db.prepare(`
        UPDATE subscribers SET visitor_id = ? WHERE visitor_id = ?
      `).bind(visitor_id, oldVisitorId).run();
    }

    // Upsert current visitor with email
    await db.prepare(`
      INSERT INTO visitors (visitor_id, email, first_seen_at, last_seen_at)
      VALUES (?, ?, datetime('now'), datetime('now'))
      ON CONFLICT(visitor_id) DO UPDATE SET email = ?, last_seen_at = datetime('now')
    `).bind(visitor_id, normalizedEmail, normalizedEmail).run();

    // Upsert into subscribers table
    await db.prepare(`
      INSERT INTO subscribers (email, visitor_id, subscribed_at)
      VALUES (?, ?, datetime('now'))
      ON CONFLICT(email) DO UPDATE SET visitor_id = ?
    `).bind(normalizedEmail, visitor_id, visitor_id).run();

    return new Response(
      JSON.stringify({ 
        success: true, 
        merged: !!existingVisitor,
        message: existingVisitor ? 'Identity merged from previous visitor' : 'Identity linked'
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Telemetry identify error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to identify user' }),
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

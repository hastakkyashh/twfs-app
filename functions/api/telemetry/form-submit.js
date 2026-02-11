/**
 * Cloudflare Pages Function — Form Submission Telemetry
 * POST /api/telemetry/form-submit
 * 
 * Stores contact form data in D1 before WhatsApp redirect.
 * Location is extracted from Cloudflare's request.cf (no user permission needed).
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
    const { name, dob, place, phone, email, service, browser_latitude, browser_longitude } = body;

    // Validate required fields
    if (!name || !phone) {
      return new Response(
        JSON.stringify({ error: 'Name and phone are required' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Extract location from Cloudflare's cf object (automatic, free, no permission)
    const cf = context.request.cf || {};
    const cfCountry = cf.country || null;
    const cfCity = cf.city || null;
    const cfRegion = cf.region || null;
    const cfLatitude = cf.latitude || null;
    const cfLongitude = cf.longitude || null;
    const cfTimezone = cf.timezone || null;

    // User agent
    const userAgent = context.request.headers.get('User-Agent') || null;

    const db = context.env.twfs_telemetry;

    const result = await db.prepare(`
      INSERT INTO form_submissions 
        (name, dob, place, phone, email, service, 
         cf_country, cf_city, cf_region, cf_latitude, cf_longitude, cf_timezone,
         browser_latitude, browser_longitude, user_agent, submitted_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).bind(
      name,
      dob || null,
      place || null,
      phone,
      email || null,
      service || null,
      cfCountry,
      cfCity,
      cfRegion,
      cfLatitude,
      cfLongitude,
      cfTimezone,
      browser_latitude || null,
      browser_longitude || null,
      userAgent
    ).run();

    return new Response(
      JSON.stringify({ success: true, id: result.meta.last_row_id }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Telemetry form-submit error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to store submission' }),
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

/**
 * Cloudflare Pages Function — Form Submission Telemetry
 * POST /api/telemetry/form-submit
 * 
 * Stores contact form data in D1 before WhatsApp redirect.
 * Location is extracted from Cloudflare's request.cf (no user permission needed).
 */

import { createDb } from '../../../src/db/index.js';
import { enquiryFormSubmissions } from '../../../src/db/schema.js';

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

    const db = createDb(context.env.twfs_telemetry);

    // // console.log(`[form-submit] Storing form submission for: ${name}, phone: ${phone}`);

    const result = await db.insert(enquiryFormSubmissions)
      .values({
        name: name,
        dob: dob || null,
        place: place || null,
        phone: phone,
        email: email || null,
        service: service || null,
        cfCountry: cfCountry,
        cfCity: cfCity,
        cfRegion: cfRegion,
        cfLatitude: cfLatitude,
        cfLongitude: cfLongitude,
        cfTimezone: cfTimezone,
        browserLatitude: browser_latitude || null,
        browserLongitude: browser_longitude || null,
        userAgent: userAgent,
        submittedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      })
      .run();

    // // console.log(`[form-submit] Form submission stored successfully with ID: ${result.meta.last_row_id}`);

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

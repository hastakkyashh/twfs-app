/**
 * Cloudflare Pages Function — Read Form Submissions (Admin Only)
 * GET /api/telemetry/submissions?limit=50&offset=0
 * 
 * Protected: requires admin session token in Authorization header.
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
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 200);
    const offset = parseInt(url.searchParams.get('offset') || '0');

    const db = context.env.twfs_telemetry;

    // Fetch submissions
    const { results } = await db.prepare(`
      SELECT * FROM form_submissions 
      ORDER BY submitted_at DESC 
      LIMIT ? OFFSET ?
    `).bind(limit, offset).all();

    // Get total count
    const countResult = await db.prepare(
      'SELECT COUNT(*) as total FROM form_submissions'
    ).first();

    return new Response(
      JSON.stringify({
        success: true,
        submissions: results,
        total: countResult.total,
        limit,
        offset,
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Telemetry submissions read error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch submissions' }),
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

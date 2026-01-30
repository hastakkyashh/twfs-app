/**
 * Cloudflare Pages Function for Token Verification
 * This runs server-side and keeps credentials secure
 */

export async function onRequestPost(context) {
  try {
    const authHeader = context.request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ valid: false }), 
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.split(' ')[1];
    
    // Simple token validation (decode and check if recent)
    try {
      const decoded = atob(token);
      const [username, timestamp] = decoded.split(':');
      
      // Token valid for 24 hours
      const tokenAge = Date.now() - parseInt(timestamp);
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      
      if (tokenAge < maxAge) {
        return new Response(
          JSON.stringify({ 
            valid: true, 
            user: { username, role: 'admin' } 
          }), 
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
    } catch (e) {
      // Invalid token format
    }

    return new Response(
      JSON.stringify({ valid: false }), 
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ valid: false }), 
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

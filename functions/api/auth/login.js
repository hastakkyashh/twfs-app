/**
 * Cloudflare Pages Function for Authentication
 * This runs server-side and keeps credentials secure
 */

export async function onRequestPost(context) {
  try {
    const { username, password } = await context.request.json();
    
    // Access environment variables securely (not exposed to client)
    const ADMIN_USERNAME = context.env.ADMIN_USERNAME;
    const ADMIN_PASSWORD = context.env.ADMIN_PASSWORD;

    if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }), 
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Create a simple session token (you could use JWT here)
      const sessionToken = btoa(`${username}:${Date.now()}`);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          token: sessionToken,
          message: 'Login successful' 
        }), 
        { 
          status: 200, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid credentials' }), 
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Invalid request' }), 
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

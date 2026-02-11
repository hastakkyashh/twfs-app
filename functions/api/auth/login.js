/**
 * Cloudflare Pages Function for Authentication
 * This runs server-side and keeps credentials secure
 */

/**
 * Hash a string using SHA-256 via Web Crypto API
 * @param {string} message
 * @returns {Promise<string>} hex-encoded hash
 */
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function onRequestPost(context) {
  try {
    const { username, password_hash } = await context.request.json();
    
    // Access environment variables securely (not exposed to client)
    const ADMIN_USERNAME = context.env.ADMIN_USERNAME;
    const ADMIN_PASSWORD = context.env.ADMIN_PASSWORD;

    if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }), 
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Hash the stored password server-side for comparison
    const serverPasswordHash = await sha256(ADMIN_PASSWORD);

    // Compare client hash vs server computed hash
    if (username === ADMIN_USERNAME && password_hash === serverPasswordHash) {
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

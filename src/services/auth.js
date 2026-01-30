/**
 * Frontend Authentication Service
 * Uses Cloudflare Pages Functions for secure server-side authentication
 */

// Session storage key
const SESSION_KEY = 'finsure_auth_session';

/**
 * Login with username and password
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const login = async (username, password) => {
  try {
    // Call Cloudflare Pages Function (server-side)
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      // Store token in localStorage
      localStorage.setItem(SESSION_KEY, JSON.stringify({
        token: data.token,
        username,
        role: 'admin',
        loginTime: new Date().toISOString()
      }));

      console.log('Login successful for user:', username);
      return { success: true };
    }

    console.log('Login failed:', data.error);
    return { 
      success: false, 
      error: data.error || 'Invalid credentials' 
    };
  } catch (error) {
    console.error('Login error:', error);
    return { 
      success: false, 
      error: 'Cannot connect to authentication server' 
    };
  }
};

/**
 * Check if user is authenticated
 * @returns {Promise<{valid: boolean, user?: object}>}
 */
export const verifyAuth = async () => {
  try {
    const sessionData = localStorage.getItem(SESSION_KEY);
    
    if (!sessionData) {
      return { valid: false };
    }

    const session = JSON.parse(sessionData);
    
    if (!session || !session.token) {
      return { valid: false };
    }

    // Verify token with server
    const response = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      if (data.valid) {
        return { 
          valid: true, 
          user: data.user
        };
      }
    }

    // Token invalid, clear session
    localStorage.removeItem(SESSION_KEY);
    return { valid: false };
  } catch (error) {
    console.error('Auth verification error:', error);
    return { valid: false };
  }
};

/**
 * Logout current user
 */
export const logout = () => {
  localStorage.removeItem(SESSION_KEY);
  console.log('User logged out');
};

/**
 * Get current session data
 * @returns {object|null}
 */
export const getCurrentSession = () => {
  try {
    const sessionData = localStorage.getItem(SESSION_KEY);
    return sessionData ? JSON.parse(sessionData) : null;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};

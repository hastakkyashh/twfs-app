/**
 * Frontend Authentication Service
 * Simple authentication without JWT or backend
 * Credentials stored in environment variables
 */

const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME;
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

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
    // Check if credentials are configured
    if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
      console.error('Admin credentials not configured in environment variables');
      return { 
        success: false, 
        error: 'Admin credentials not configured. Please check .env file.' 
      };
    }

    // Validate credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Create session object
      const session = {
        username,
        role: 'admin',
        loginTime: new Date().toISOString()
      };

      // Store session in localStorage
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));

      console.log('Login successful for user:', username);
      return { success: true };
    }

    console.log('Login failed: Invalid credentials');
    return { 
      success: false, 
      error: 'Invalid credentials' 
    };
  } catch (error) {
    console.error('Login error:', error);
    return { 
      success: false, 
      error: 'An error occurred during login' 
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
    
    // Basic validation - check if session exists and has required fields
    if (session && session.username && session.role) {
      return { 
        valid: true, 
        user: {
          username: session.username,
          role: session.role
        }
      };
    }

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

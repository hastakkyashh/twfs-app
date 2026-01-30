import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

app.use(express.json());

// Load environment variables from .env file
const loadEnv = async () => {
  try {
    const envContent = await fs.readFile(join(__dirname, '.env'), 'utf-8');
    const env = {};
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts.join('=').trim();
      }
    });
    return env;
  } catch (error) {
    console.warn('No .env file found, using default credentials');
    return {
      ADMIN_USERNAME: 'admin',
      ADMIN_PASSWORD: 'password123'
    };
  }
};

// Simulate Cloudflare Pages Functions context
const createContext = (req, env) => {
  return {
    request: req,
    env: env,
    waitUntil: (promise) => promise,
    passThroughOnException: () => {}
  };
};

// Start server
(async () => {
  const env = await loadEnv();
  
  console.log('\n🚀 Development Server for Cloudflare Pages Functions');
  console.log('================================================');
  console.log(`📍 Server running on: http://localhost:${PORT}`);
  console.log(`🔐 Admin Username: ${env.ADMIN_USERNAME || 'admin'}`);
  console.log(`🔐 Admin Password: ${env.ADMIN_PASSWORD || 'password123'}`);
  console.log('================================================\n');

  // Login endpoint - POST /api/auth/login
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      const ADMIN_USERNAME = env.ADMIN_USERNAME;
      const ADMIN_PASSWORD = env.ADMIN_PASSWORD;

      if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
        return res.status(500).json({ error: 'Server configuration error' });
      }

      // Verify credentials
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // Create a simple session token
        const sessionToken = Buffer.from(`${username}:${Date.now()}`).toString('base64');
        
        console.log(`✅ Login successful for user: ${username}`);
        
        return res.status(200).json({ 
          success: true, 
          token: sessionToken,
          message: 'Login successful' 
        });
      }

      console.log(`❌ Login failed for user: ${username}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    } catch (error) {
      console.error('❌ Login error:', error);
      return res.status(400).json({ error: 'Invalid request' });
    }
  });

  // Verify endpoint - POST /api/auth/verify
  app.post('/api/auth/verify', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('❌ Verification failed: No valid authorization header');
        return res.status(401).json({ valid: false });
      }

      const token = authHeader.split(' ')[1];
      
      // Simple token validation (decode and check if recent)
      try {
        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        const [username, timestamp] = decoded.split(':');
        
        // Token valid for 24 hours
        const tokenAge = Date.now() - parseInt(timestamp);
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        
        if (tokenAge < maxAge) {
          console.log(`✅ Token verified for user: ${username}`);
          return res.status(200).json({ 
            valid: true, 
            user: { username, role: 'admin' } 
          });
        } else {
          console.log(`❌ Token expired for user: ${username}`);
        }
      } catch (e) {
        console.log('❌ Invalid token format');
      }

      return res.status(401).json({ valid: false });
    } catch (error) {
      console.error('❌ Verification error:', error);
      return res.status(401).json({ valid: false });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Development server is running' });
  });

  // Catch-all for undefined routes
  app.use((req, res) => {
    console.log(`⚠️  Route not found: ${req.method} ${req.path}`);
    res.status(404).json({ error: 'Route not found' });
  });

  app.listen(PORT, () => {
    console.log(`\n✨ Available endpoints:`);
    console.log(`   POST http://localhost:${PORT}/api/auth/login`);
    console.log(`   POST http://localhost:${PORT}/api/auth/verify`);
    console.log(`   GET  http://localhost:${PORT}/api/health\n`);
  });
})();

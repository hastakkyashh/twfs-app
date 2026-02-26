# Cloudflare Functions Developer Guide

This guide explains how Cloudflare Pages Functions work in this project, including local development, deployment, database migrations, and secrets management.

## 📋 Table of Contents

1. [Overview](#overview)
2. [How Cloudflare Functions Work](#how-cloudflare-functions-work)
3. [Project Telemetry Setup](#project-telemetry-setup)
4. [Local Development](#local-development)
5. [Secrets & Environment Variables](#secrets--environment-variables)
6. [Database Migrations](#database-migrations)
7. [Wrangler Configuration](#wrangler-configuration)
8. [CI/CD Pipeline](#cicd-pipeline)
9. [Testing & Debugging](#testing--debugging)

---

## Overview

This project uses **Cloudflare Pages Functions** - a serverless platform that runs your backend code at the edge. Functions are automatically deployed alongside your static site when you push to the `main` branch.

### Key Benefits
- **Zero Configuration**: File-based routing in `functions/` directory
- **Edge Computing**: Functions run globally at Cloudflare's edge locations
- **Integrated D1 Database**: SQLite database with global replication
- **Automatic Deployments**: Push to `main` = instant deployment
- **Free Tier**: Generous limits for small to medium projects

---

## How Cloudflare Functions Work

### File-Based Routing

Cloudflare Pages Functions use **file-based routing**. The file structure in `functions/` maps directly to API endpoints:

```
functions/
└── api/
    ├── auth/
    │   ├── login.js          → /api/auth/login
    │   └── verify.js         → /api/auth/verify
    └── telemetry/
        ├── track.js          → /api/telemetry/track
        ├── form-submit.js    → /api/telemetry/form-submit
        ├── identify.js       → /api/telemetry/identify
        ├── activity.js       → /api/telemetry/activity
        └── submissions.js    → /api/telemetry/submissions
```

### Function Structure

Each function exports HTTP method handlers:

```javascript
// Example: functions/api/example.js

// Handle POST requests
export async function onRequestPost(context) {
  const { request, env, params } = context;
  
  // Access request body
  const body = await request.json();
  
  // Access environment variables & bindings
  const db = env.twfs_telemetry; // D1 database binding
  const secret = env.MY_SECRET;   // Environment variable
  
  // Return response
  return new Response(
    JSON.stringify({ success: true }),
    { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    }
  );
}

// Handle GET requests
export async function onRequestGet(context) {
  // ...
}

// Handle OPTIONS (CORS preflight)
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
```

### Context Object

The `context` object provides:
- `request` - The incoming Request object
- `env` - Environment variables and bindings (D1, KV, secrets)
- `params` - Dynamic route parameters
- `waitUntil()` - Run async tasks after response
- `passThroughOnException()` - Fallback behavior

---

## Project Telemetry Setup

This project implements a **custom analytics system** using Cloudflare D1 to track visitor behavior without third-party services.

### Telemetry Architecture

```
Client (Browser)
    ↓
    ↓ Batched Events
    ↓
POST /api/telemetry/track
    ↓
    ↓ Upsert visitor & session
    ↓ Insert events
    ↓
Cloudflare D1 Database
    ↓
    ↓ Query analytics
    ↓
GET /api/telemetry/activity
```

### Database Schema

**Tables:**
1. **visitors** - Unique browser visitors (cookie-based `visitor_id`)
2. **sessions** - Individual browsing sessions (tab/visit)
3. **events** - User interactions (clicks, page views, etc.)
4. **subscribers** - Email subscription list
5. **enquiry_form_submissions** - Contact form data with geo-location

### Telemetry Features

#### 1. Event Tracking (`/api/telemetry/track`)
- Batched event ingestion from client
- Automatic visitor & session management
- Cloudflare geo-data (country, city, region)
- User agent tracking

#### 2. Form Submissions (`/api/telemetry/form-submit`)
- Contact form data persistence
- Dual geo-location: Cloudflare edge + browser GPS
- WhatsApp integration support

#### 3. Visitor Identification (`/api/telemetry/identify`)
- Link email addresses to visitor IDs
- Track subscriber conversions

#### 4. Analytics Retrieval
- `/api/telemetry/activity` - Get visitor/session/event data
- `/api/telemetry/submissions` - Get form submissions

### Cloudflare Geo-Data

Cloudflare automatically provides geo-location data via `request.cf`:

```javascript
const cf = context.request.cf || {};
const country = cf.country;    // e.g., "US"
const city = cf.city;          // e.g., "San Francisco"
const region = cf.region;      // e.g., "California"
const latitude = cf.latitude;  // e.g., "37.7749"
const longitude = cf.longitude;// e.g., "-122.4194"
const timezone = cf.timezone;  // e.g., "America/Los_Angeles"
```

**No user permission required** - this data comes from Cloudflare's edge network, not the browser.

---

## Local Development

### Prerequisites

```bash
# Install Wrangler CLI globally
npm install -g wrangler

# Or use via npx (no global install)
npx wrangler --version
```

### Running Frontend + Functions Locally

To test the full stack (React frontend + Cloudflare Functions) locally:

#### Option 1: Separate Processes (Recommended for Development)

**Terminal 1 - Frontend (Vite):**
```bash
npm run dev
# Runs on http://localhost:5173
```

**Terminal 2 - Functions (Wrangler):**
```bash
npx wrangler pages dev ./dist --port 8788 --local
# Runs on http://localhost:8788
# Functions available at http://localhost:8788/api/*
```

**Note**: You'll need to build the frontend first or point Wrangler to a different directory.

#### Option 2: Integrated Development (Production-Like)

```bash
# Step 1: Build the frontend
npm run build

# Step 2: Run Wrangler with local D1
npx wrangler pages dev ./dist --local --port 8788

# Access the full app at http://localhost:8788
# Functions run at http://localhost:8788/api/*
```

#### Option 3: Proxy Setup (Best for Active Development)

For active frontend development with live reload:

1. Run Vite dev server: `npm run dev` (port 5173)
2. Configure Vite to proxy API calls to Wrangler
3. Run Wrangler: `npx wrangler pages dev ./dist --local --port 8788`

Add to `vite.config.js`:
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8788',
        changeOrigin: true,
      }
    }
  }
})
```

### Testing Functions Locally

```bash
# Test with curl
curl -X POST http://localhost:8788/api/telemetry/track \
  -H "Content-Type: application/json" \
  -d '{
    "visitor_id": "test-visitor",
    "session_id": "test-session",
    "events": [
      {
        "event_type": "page_view",
        "page": "/home",
        "timestamp": "2026-02-26T12:00:00Z"
      }
    ]
  }'
```

### Local D1 Database

Wrangler creates a local SQLite database at `.wrangler/state/v3/d1/miniflare-D1DatabaseObject/`.

```bash
# Run with local D1
npx wrangler pages dev ./dist --local

# Access local D1 via Wrangler
npx wrangler d1 execute twfs-telemetry --local --command "SELECT * FROM visitors"
```

---

## Secrets & Environment Variables

### Types of Secrets

1. **Environment Variables** - Public config (API URLs, feature flags)
2. **Secrets** - Sensitive data (API keys, passwords, tokens)
3. **Bindings** - Cloudflare resources (D1, KV, R2)

### Local Development (.env)

Create a `.env` file in the project root:

```env
# Drizzle ORM - for migrations
CLOUDFLARE_ACCOUNT_ID=your_account_id_here
CLOUDFLARE_DATABASE_ID=5a49fed9-9aa7-4b12-82b5-280e18987a29
CLOUDFLARE_D1_TOKEN=your_d1_api_token_here

# Admin credentials (for local testing)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
```

**⚠️ Never commit `.env` to git!** (Already in `.gitignore`)

### Production Secrets (Cloudflare Pages)

Set secrets in the Cloudflare Pages dashboard:

1. Go to **Cloudflare Dashboard** → **Pages** → **Your Project**
2. Navigate to **Settings** → **Environment Variables**
3. Add variables for **Production** and/or **Preview** environments

**Required Secrets:**
```
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_secure_password
```

### Accessing Secrets in Functions

```javascript
export async function onRequestPost(context) {
  // Access via context.env
  const username = context.env.ADMIN_USERNAME;
  const password = context.env.ADMIN_PASSWORD;
  const db = context.env.twfs_telemetry; // D1 binding
  
  // ...
}
```

### D1 Database Binding

The D1 database is configured in `wrangler.toml`:

```toml
[[d1_databases]]
binding = "twfs_telemetry"           # Access via env.twfs_telemetry
database_name = "twfs-telemetry"     # Database name in Cloudflare
database_id = "5a49fed9-9aa7-4b12-82b5-280e18987a29"  # Unique ID
```

**Important**: The `binding` name is how you access the database in your code (`context.env.twfs_telemetry`).

---

## Database Migrations

This project uses **Drizzle ORM** for type-safe database operations and migrations.

### Migration Workflow

```
1. Modify schema.js
2. Generate migration
3. Test locally
4. Apply to production
```

### Step-by-Step Guide

#### 1. Modify the Schema

Edit `src/db/schema.js` to add/modify tables:

```javascript
// Example: Add a new table
export const newTable = sqliteTable('new_table', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
});
```

#### 2. Generate Migration

```bash
npm run db:generate
# or
npx drizzle-kit generate
```

This creates a new SQL file in `drizzle/migrations/` with a timestamp:
```
drizzle/migrations/0001_migration_name.sql
```

**Review the generated SQL** to ensure it matches your intent!

#### 3. Test Migration Locally

```bash
# Apply to local D1 database
npm run db:migrate:local drizzle/migrations/0001_migration_name.sql

# or using wrangler directly
npx wrangler d1 execute twfs-telemetry --local --file=./drizzle/migrations/0001_migration_name.sql
```

**Verify the migration:**
```bash
# Query local database
npx wrangler d1 execute twfs-telemetry --local --command "SELECT name FROM sqlite_master WHERE type='table'"
```

#### 4. Test Your Application Locally

```bash
# Run the full app with local D1
npx wrangler pages dev ./dist --local

# Test your functions that use the new schema
curl -X POST http://localhost:8788/api/your-endpoint
```

#### 5. Apply to Production

**⚠️ IMPORTANT: Always test locally first!**

```bash
# Apply to remote D1 database
npm run db:migrate:remote drizzle/migrations/0001_migration_name.sql

# or using wrangler directly
npx wrangler d1 execute twfs-telemetry --remote --file=./drizzle/migrations/0001_migration_name.sql
```

**Verify production migration:**
```bash
npx wrangler d1 execute twfs-telemetry --remote --command "SELECT name FROM sqlite_master WHERE type='table'"
```

### Migration Best Practices

✅ **DO:**
- Always review generated SQL before applying
- Test migrations locally first
- Keep migrations small and focused
- Commit migration files to git
- Use descriptive migration names

❌ **DON'T:**
- Modify existing migration files (create new ones instead)
- Skip local testing
- Run migrations directly on production without testing
- Delete migration files (they're your schema history)

### Drizzle Studio (Database GUI)

View and edit your database with a web UI:

```bash
npm run db:studio
# Opens at http://localhost:4983
```

**Note**: Drizzle Studio connects to the **remote** database by default. For local, you'll need to modify `drizzle.config.js` temporarily.

### Direct Schema Push (Development Only)

For rapid prototyping, you can push schema changes directly without migrations:

```bash
npm run db:push
# or
npx drizzle-kit push
```

**⚠️ WARNING**: This bypasses migrations and can cause data loss. Only use in development!

---

## Wrangler Configuration

The `wrangler.toml` file configures your Cloudflare Pages deployment.

### Current Configuration

```toml
name = "twfs-app"
compatibility_date = "2026-01-30"
pages_build_output_dir = "./dist"

[[d1_databases]]
binding = "twfs_telemetry"
database_name = "twfs-telemetry"
database_id = "5a49fed9-9aa7-4b12-82b5-280e18987a29"
```

### Configuration Options

| Field | Description | When to Update |
|-------|-------------|----------------|
| `name` | Project name in Cloudflare | Rarely (affects URLs) |
| `compatibility_date` | Cloudflare runtime version | When new features needed |
| `pages_build_output_dir` | Build output directory | If changing build setup |
| `d1_databases.binding` | Variable name in code | If renaming DB access |
| `d1_databases.database_name` | Database name in CF | If creating new DB |
| `d1_databases.database_id` | Unique database ID | If switching databases |

### When to Update `wrangler.toml`

#### ✅ Update When:

1. **Adding a new D1 database:**
   ```toml
   [[d1_databases]]
   binding = "my_new_db"
   database_name = "my-new-database"
   database_id = "your-new-database-id"
   ```

2. **Adding KV namespace:**
   ```toml
   [[kv_namespaces]]
   binding = "MY_KV"
   id = "your-kv-namespace-id"
   ```

3. **Adding R2 bucket:**
   ```toml
   [[r2_buckets]]
   binding = "MY_BUCKET"
   bucket_name = "my-bucket"
   ```

4. **Updating compatibility date** (for new Cloudflare features):
   ```toml
   compatibility_date = "2026-03-01"
   ```

5. **Changing build output directory:**
   ```toml
   pages_build_output_dir = "./build"  # if using different bundler
   ```

#### ❌ Don't Update For:

- Environment variables (use Cloudflare dashboard)
- Secrets (use Cloudflare dashboard)
- Code changes (functions auto-deploy)
- Frontend changes (Vite handles builds)

### Multiple Environments

You can configure different settings for preview vs production:

```toml
[env.production]
name = "twfs-app-production"

[env.preview]
name = "twfs-app-preview"

[[env.preview.d1_databases]]
binding = "twfs_telemetry"
database_name = "twfs-telemetry-preview"
database_id = "preview-database-id"
```

---

## CI/CD Pipeline

### Automatic Deployment

**The `main` branch acts as the CI/CD pipeline.**

```
Push to main
    ↓
GitHub/GitLab triggers Cloudflare
    ↓
Cloudflare Pages builds project
    ↓
    ├─ Runs: npm run build
    ├─ Outputs to: ./dist
    └─ Deploys functions from: ./functions
    ↓
Live on production URL
```

### Deployment Process

1. **Commit & Push:**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin main
   ```

2. **Cloudflare Automatically:**
   - Detects the push
   - Clones the repository
   - Runs `npm install`
   - Runs `npm run build`
   - Deploys `./dist` + `./functions`
   - Updates DNS (if configured)

3. **Deployment Status:**
   - View in Cloudflare Pages dashboard
   - Receive email notifications (if enabled)
   - Check deployment logs for errors

### Preview Deployments

**Every branch/PR gets a preview URL:**

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and push
git push origin feature/new-feature
```

Cloudflare creates a preview deployment:
```
https://abc123.twfs-app.pages.dev
```

### Manual Deployment

```bash
# Build and deploy manually
npm run deploy

# or
npm run build
npx wrangler pages deploy ./dist
```

### Deployment Checklist

Before pushing to `main`:

- [ ] Test locally with `npm run dev`
- [ ] Test functions with `npx wrangler pages dev`
- [ ] Run migrations on production D1 (if schema changed)
- [ ] Update environment variables in Cloudflare (if needed)
- [ ] Review changes in preview deployment first
- [ ] Check build logs for errors

---

## Testing & Debugging

### Local Testing

```bash
# Test frontend
npm run dev

# Test functions locally
npx wrangler pages dev ./dist --local

# Test specific function
curl -X POST http://localhost:8788/api/telemetry/track \
  -H "Content-Type: application/json" \
  -d '{"visitor_id":"test","session_id":"test","events":[]}'
```

### Debugging Functions

#### Console Logs

```javascript
export async function onRequestPost(context) {
  console.log('Request received:', context.request.url);
  console.log('Body:', await context.request.json());
  // Logs appear in Wrangler terminal (local) or Cloudflare dashboard (production)
}
```

#### Error Handling

```javascript
export async function onRequestPost(context) {
  try {
    // Your code
  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack // Only in development!
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
```

### Production Logs

View real-time logs in Cloudflare dashboard:

1. Go to **Pages** → **Your Project**
2. Click **Functions** tab
3. View **Real-time Logs**

Or use Wrangler:
```bash
npx wrangler pages deployment tail
```

### Common Issues

#### Issue: Functions not found (404)

**Cause**: File path doesn't match URL
**Solution**: Check `functions/api/` structure matches your endpoint

#### Issue: Database binding undefined

**Cause**: `wrangler.toml` not configured or binding name mismatch
**Solution**: Verify `binding` in `wrangler.toml` matches `context.env.binding_name`

#### Issue: CORS errors

**Cause**: Missing CORS headers
**Solution**: Add `onRequestOptions` handler and CORS headers to responses

#### Issue: Migration fails

**Cause**: SQL syntax error or constraint violation
**Solution**: Review generated SQL, test locally first, check for data conflicts

---

## Quick Reference

### Essential Commands

```bash
# Development
npm run dev                          # Start frontend dev server
npx wrangler pages dev ./dist --local  # Run functions locally

# Database
npm run db:generate                  # Generate migration
npm run db:migrate:local <file>      # Apply migration locally
npm run db:migrate:remote <file>     # Apply migration to production
npm run db:studio                    # Open database GUI

# Deployment
git push origin main                 # Auto-deploy to production
npm run deploy                       # Manual deployment

# Debugging
npx wrangler pages deployment tail   # View production logs
npx wrangler d1 execute twfs-telemetry --local --command "SELECT * FROM visitors"
```

### File Locations

- **Functions**: `functions/api/`
- **Database Schema**: `src/db/schema.js`
- **Migrations**: `drizzle/migrations/`
- **Config**: `wrangler.toml`, `drizzle.config.js`
- **Environment**: `.env` (local only, gitignored)

### Useful Links

- **Cloudflare Pages Docs**: https://developers.cloudflare.com/pages
- **Cloudflare Functions**: https://developers.cloudflare.com/pages/functions
- **D1 Database**: https://developers.cloudflare.com/d1
- **Drizzle ORM**: https://orm.drizzle.team
- **Wrangler CLI**: https://developers.cloudflare.com/workers/wrangler

---

## Support

For issues or questions:
1. Check Cloudflare Pages deployment logs
2. Review function code in `functions/api/`
3. Test locally with Wrangler
4. Check Cloudflare status page
5. Consult team documentation

**Happy coding! 🚀**

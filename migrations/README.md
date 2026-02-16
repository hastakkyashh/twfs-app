# ⚠️ DEPRECATED - DO NOT USE

This folder contains **legacy SQL migrations** that were used before Drizzle ORM.

## Current Schema Management

**Schema is now managed by Drizzle ORM.**

- **Schema location:** `src/db/schema.js`
- **Migration generation:** `npx drizzle-kit generate`
- **Migrations folder:** `drizzle/migrations/`

## Migration Status

The following migrations have already been applied to both local and remote databases:

- ✅ `0001_create_form_submissions.sql` - Applied
- ✅ `0002_create_tracking_tables.sql` - Applied

**These files are kept for historical reference only.**

## How to Make Schema Changes

### Step 1: Edit Schema
Edit `src/db/schema.js` to add/modify tables or columns.

### Step 2: Generate Migration
```bash
npx drizzle-kit generate
```

This creates a new migration file in `drizzle/migrations/`

### Step 3: Review Migration
Check the generated SQL in `drizzle/migrations/XXXX_<name>.sql`

### Step 4: Apply to Local
```bash
npx wrangler d1 execute twfs-telemetry --local --file=./drizzle/migrations/XXXX_<name>.sql
```

### Step 5: Apply to Remote
```bash
npx wrangler d1 execute twfs-telemetry --remote --file=./drizzle/migrations/XXXX_<name>.sql
```

### Step 6: Deploy Code
```bash
npm run build
npm run deploy
```

## DO NOT

- ❌ Create new `.sql` files in this folder
- ❌ Manually edit database schema with SQL
- ❌ Use these old migration files for new changes

## Schema Source of Truth

**Single source of truth:** `src/db/schema.js`

All future schema changes must be made there and managed through Drizzle Kit.

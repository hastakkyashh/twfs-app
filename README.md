# TWFS App - Finsure Website

A modern, high-performance single-page application (SPA) built with React and deployed on Cloudflare Pages. This project combines a responsive frontend with serverless backend functions for telemetry, authentication, and data management.

## 🚀 Tech Stack

### Frontend
- **Framework**: React 19.2.3 with Vite 7.2.4
- **Styling**: TailwindCSS 4.1.18 with PostCSS
- **Icons**: Lucide React, React Icons
- **Analytics**: React GA4 (Google Analytics 4)
- **Charts**: Recharts
- **PDF Generation**: @react-pdf/renderer, jsPDF, html2canvas

### Backend & Infrastructure
- **Platform**: Cloudflare Pages (Serverless)
- **Functions**: Cloudflare Pages Functions (file-based routing)
- **Database**: Cloudflare D1 (SQLite-based)
- **ORM**: Drizzle ORM 0.45.1
- **CI/CD**: Automatic deployment from `main` branch

## 📁 Project Structure

```
finsure-wp-spa/
├── src/                          # Frontend source code
│   ├── components/               # React components (30 items)
│   ├── pages/                    # Page components (31 items)
│   ├── services/                 # API service layers
│   ├── contexts/                 # React contexts
│   ├── constants/                # App constants
│   ├── db/                       # Database schema & utilities
│   │   ├── schema.js            # Drizzle ORM schema definitions
│   │   └── index.js             # DB connection utilities
│   ├── lib/                      # Utility libraries
│   ├── utils/                    # Helper functions
│   ├── App.jsx                   # Main app component
│   └── main.jsx                  # App entry point
│
├── functions/                    # Cloudflare Pages Functions (Serverless)
│   └── api/
│       ├── auth/                 # Authentication endpoints
│       │   ├── login.js         # POST /api/auth/login
│       │   └── verify.js        # POST /api/auth/verify
│       └── telemetry/            # Analytics & tracking endpoints
│           ├── track.js         # POST /api/telemetry/track
│           ├── form-submit.js   # POST /api/telemetry/form-submit
│           ├── identify.js      # POST /api/telemetry/identify
│           ├── activity.js      # GET /api/telemetry/activity
│           └── submissions.js   # GET /api/telemetry/submissions
│
├── drizzle/                      # Database migrations
│   └── migrations/               # Auto-generated SQL migrations
│
├── public/                       # Static assets
├── dist/                         # Production build output
│
├── wrangler.toml                 # Cloudflare configuration
├── drizzle.config.js            # Drizzle ORM configuration
├── vite.config.js               # Vite bundler configuration
├── package.json                  # Dependencies & scripts
└── .env                          # Environment variables (local only)
```

## 🏗️ Architecture Overview

### Frontend Architecture
- **SPA Pattern**: Single-page application with client-side routing
- **Component-Based**: Modular React components for reusability
- **Context API**: Global state management for auth, theme, etc.
- **Service Layer**: Abstracted API calls in `src/services/`
- **Responsive Design**: Mobile-first approach with TailwindCSS

### Backend Architecture
- **Serverless Functions**: File-based routing in `functions/api/`
- **Database**: Cloudflare D1 (SQLite) with Drizzle ORM
- **Telemetry System**: Custom analytics tracking visitors, sessions, and events
- **Authentication**: Server-side credential validation with session tokens
- **Geo-Location**: Automatic location data from Cloudflare's edge network

### Database Schema
The application uses 5 main tables:
1. **visitors** - Unique browser visitors (cookie-based)
2. **sessions** - Individual browsing sessions
3. **events** - User interaction tracking (clicks, page views, etc.)
4. **subscribers** - Email subscription list
5. **enquiry_form_submissions** - Contact form submissions with geo-data

## 🔧 Development Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn
- Cloudflare account (for deployment)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd finsure-wp-spa

# Install dependencies
npm install

# Set up environment variables
# Copy .env.example to .env and fill in values
```

### Running Locally

```bash
# Start the development server (frontend only)
npm run dev

# Access the app at http://localhost:5173
```

**Note**: For running with Cloudflare Functions locally, see `CLOUDFLARE_FUNCTIONS.md`.

### Build for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

## 📦 Available Scripts

```bash
npm run dev              # Start Vite dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
npm run deploy           # Build and deploy to Cloudflare Pages

# Database scripts
npm run db:generate      # Generate new migration from schema changes
npm run db:migrate:local # Apply migration to local D1 database
npm run db:migrate:remote# Apply migration to remote D1 database
npm run db:studio        # Open Drizzle Studio (DB GUI)
npm run db:push          # Push schema changes directly (dev only)
```

## 🚢 Deployment

### Automatic Deployment (CI/CD)
- **Main Branch**: Pushing to `main` automatically triggers deployment to production
- **Platform**: Cloudflare Pages
- **Build Command**: `npm run build`
- **Output Directory**: `./dist`

### Manual Deployment

```bash
# Deploy to Cloudflare Pages
npm run deploy
```

## 🔐 Environment Variables

### Local Development (.env)
```env
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_DATABASE_ID=5a49fed9-9aa7-4b12-82b5-280e18987a29
CLOUDFLARE_D1_TOKEN=your_d1_token
```

### Cloudflare Pages (Production)
Set these in Cloudflare Pages dashboard under Settings > Environment Variables:
- `ADMIN_USERNAME` - Admin panel username
- `ADMIN_PASSWORD` - Admin panel password
- D1 database binding: `twfs_telemetry` (configured in wrangler.toml)

## 📊 Features

### Telemetry & Analytics
- Custom visitor tracking (cookie-based)
- Session management
- Event tracking (page views, clicks, interactions)
- Form submission tracking with geo-location
- Cloudflare edge geo-data (country, city, region)

### Authentication
- Server-side credential validation
- SHA-256 password hashing
- Session token management
- Admin panel access control

### Form Handling
- Contact form with WhatsApp integration
- Automatic geo-location capture (CF edge + browser)
- Form submission persistence in D1 database

## 🌐 API Endpoints

All endpoints are serverless functions deployed on Cloudflare Pages:

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/verify` - Verify session token

### Telemetry
- `POST /api/telemetry/track` - Track user events (batched)
- `POST /api/telemetry/form-submit` - Store form submissions
- `POST /api/telemetry/identify` - Identify visitor by email
- `GET /api/telemetry/activity` - Retrieve activity data
- `GET /api/telemetry/submissions` - Retrieve form submissions

## 🛠️ Database Management

See `CLOUDFLARE_FUNCTIONS.md` for detailed instructions on:
- Creating and applying migrations
- Testing migrations locally
- Pushing changes to production
- Using Drizzle Studio

## 📝 Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Test locally with `npm run dev`
4. Commit with clear messages
5. Push and create a pull request
6. Merge to `main` triggers automatic deployment

## 📚 Additional Documentation

- **Cloudflare Functions Guide**: See `CLOUDFLARE_FUNCTIONS.md`
- **Database Schema**: See `src/db/schema.js`
- **API Documentation**: See individual function files in `functions/api/`

## 🔗 Links

- **Production URL**: [Your Cloudflare Pages URL]
- **Cloudflare Dashboard**: https://dash.cloudflare.com
- **Drizzle ORM Docs**: https://orm.drizzle.team

## 📄 License

[Your License Here]

## 👥 Team

[Your Team Information]

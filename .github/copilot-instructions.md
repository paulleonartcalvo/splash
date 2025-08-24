# Splash Pool Reservation System

Splash is a modern, real-time pool reservation system built as a monorepo with React frontend and Fastify backend. The system uses Supabase for authentication and database, with Bun as the preferred package manager.

**CRITICAL: Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Prerequisites Installation
- Bun runtime is required (this project uses Bun, not Node.js)
- Install Bun:
  ```bash
  curl -fsSL https://bun.sh/install | bash
  source ~/.bashrc
  bun --version  # Should show 1.2.20+
  ```
- PostgreSQL database (Supabase hosted)
- Supabase account with valid credentials

### Bootstrap and Build Process
Execute these commands in exact order:

1. **Install Dependencies** (NEVER CANCEL - Set timeout to 60+ minutes):
   ```bash
   cd /path/to/splash
   bun install  # Takes ~25 seconds, uses bun.lock (no package-lock.json)
   ```

2. **Frontend Development Server**:
   ```bash
   cd apps/splash
   bun run dev  # Starts on http://localhost:5173 in ~1.1 seconds
   ```

3. **Frontend Build** (NEVER CANCEL - Set timeout to 30+ minutes):
   ```bash
   cd apps/splash
   # Note: TypeScript build fails due to unused variables
   bun run build  # FAILS due to strict TypeScript settings
   # Workaround: Use Vite directly
   npx vite build  # Takes ~7.5 seconds, WORKS CORRECTLY
   ```

4. **Frontend Preview** (after build):
   ```bash
   cd apps/splash
   bun run preview  # Serves built app on http://localhost:4173
   ```

### Backend Setup (Requires Environment Variables)
The backend REQUIRES valid Supabase credentials to start. It will fail with connection errors otherwise.

1. **Required Environment Variables**:
   Create `.env` file in `apps/booking/`:
   ```bash
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_KEY=your_supabase_anon_key
   SUPABASE_PG_PASSWORD=your_db_password
   SUPABASE_PG_USER=your_db_user
   SUPABASE_PG_HOST=your_db_host
   SUPABASE_PG_PORT=5432
   SUPABASE_PG_DB=your_db_name
   FRONTEND_URL=http://localhost:5173
   ```

2. **Backend Development Server**:
   ```bash
   cd apps/booking
   bun run start  # Starts on port 3000, requires valid Supabase connection
   ```

### Environment Configuration
Frontend requires these environment variables in `apps/splash/.env`:
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key  
VITE_BOOKING_API_URL=http://localhost:3000
```

## Development Workflow

### Linting and Code Quality
```bash
cd apps/splash
bun run lint  # Takes ~2 seconds, currently has 48 errors/1 warning
# Note: Many errors are unused variables and TypeScript strict mode issues
```

**Current Known Issues:**
- TypeScript strict mode prevents builds due to unused imports/variables
- ESLint reports 48 errors (mostly unused variables, type issues)
- Sonner ToasterProps import issue in components/ui/sonner.tsx
- These do NOT prevent Vite builds, only TypeScript compilation

### Database Operations
```bash
cd apps/booking
bun run drizzle:pull  # Requires valid database connection
```

## Validation Scenarios

### Frontend Validation
1. **Development Server Test**:
   ```bash
   cd apps/splash && bun run dev
   ```
   - Should start on http://localhost:5173
   - Will show blank page without Supabase env vars (expected)
   - Console will show "supabaseUrl is required" error (expected)

2. **Production Build Test**:
   ```bash
   cd apps/splash && npx vite build
   ```
   - Should complete in ~7.5 seconds
   - Produces dist/ folder with optimized assets
   - May show chunk size warnings (normal for large React apps)

3. **Manual UI Testing**:
   - With valid Supabase credentials, test the login flow
   - Create an organization and location
   - Test pool session booking features
   - Verify real-time updates work

### Backend Validation  
1. **API Server Test**:
   ```bash
   cd apps/booking && bun run start
   ```
   - Requires ALL Supabase environment variables
   - Should show "Supabase connection succeeded" if properly configured
   - Starts Fastify server on port 3000
   - Access Swagger docs at http://localhost:3000/documentation

## Common Issues and Solutions

### Build Failures
- **TypeScript errors**: Use `npx vite build` instead of `bun run build`
- **Import errors**: Check for correct file extensions and paths
- **Unused variables**: Expected in current codebase, doesn't prevent Vite builds

### Runtime Errors
- **Blank frontend**: Missing VITE_SUPABASE_* environment variables
- **Backend connection fails**: Invalid Supabase credentials
- **404 API errors**: Backend not running or wrong VITE_BOOKING_API_URL

### Performance Notes
- Bun install takes ~25 seconds with bun.lock file management
- Vite builds are consistently fast (~7.5s)
- Frontend dev server starts quickly (~1.1s)
- Backend requires real database connection testing

## Project Structure Reference

```
apps/
├── splash/              # React frontend (port 5173)
│   ├── src/
│   │   ├── components/  # UI components with Radix UI
│   │   ├── contexts/    # React contexts (Auth, etc.)
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Utilities (API client, Supabase)
│   │   ├── routes/      # TanStack Router pages
│   │   └── services/    # API services and TanStack Query
│   └── vite.config.ts   # Vite configuration
├── booking/             # Fastify backend (port 3000)
│   ├── src/
│   │   ├── routes/      # API endpoints (/auth, /organizations, etc.)
│   │   ├── plugins/     # Fastify plugins (auth, drizzle)
│   │   ├── schemas/     # TypeBox API schemas
│   │   └── drizzle/     # Database schema and migrations
│   └── index.ts         # Main server entry point
```

## Key Technologies
- **Frontend**: React 19, TypeScript, Vite, TanStack Router/Query, Tailwind CSS, Radix UI
- **Backend**: Fastify, TypeScript, TypeBox, Drizzle ORM, Supabase Auth
- **Database**: PostgreSQL via Supabase
- **Package Management**: Bun (exclusive runtime, uses bun.lock)
- **Build Tools**: Vite (frontend), TypeScript (both)

## Critical Timing Warnings
- **NEVER CANCEL** dependency installation - may take up to 60 minutes
- **NEVER CANCEL** build processes - Vite builds take ~7.5 seconds
- Always set appropriate timeouts (60+ minutes for installs, 30+ minutes for builds)
- Development servers start quickly (<5 seconds)
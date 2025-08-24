# Splash 🏊‍♂️

A modern, real-time pool reservation system built to solve the chaos of broken gym booking systems.


<img width="1512" height="859" alt="Screenshot 2025-08-23 at 8 38 10 PM" src="https://github.com/user-attachments/assets/1c52ad26-e46f-4b6f-91a3-e0aefcd79452" />


## The Problem

Traditional pool booking systems are frustrating:
- People reserve spots and never show up
- No visual seat selection (it's like airline booking from 1995)
- Others overstay while everyone waits around
- No group coordination features
- Lost revenue from empty "reserved" spots

## The Solution

Splash is a complete rebuild focused on:

✨ **Real-time seat selection** - Visual seat picking with live updates  
🎯 **Smart enforcement** - Actual consequences for no-shows  
👥 **Group coordination** - Plan with friends seamlessly  
⚡ **Real-time sync** - Y.js CRDTs handling 100+ concurrent users  
🏢 **Multi-tenant ready** - Enterprise-grade architecture  

## Tech Stack

- **Frontend**: React + TypeScript + TanStack Router + TanStack Query
- **Backend**: Node.js + Fastify + TypeBox
- **Database**: PostgreSQL + Supabase
- **Real-time**: Y.js CRDTs + GCP Pub/Sub
- **Styling**: Tailwind CSS + Radix UI
- **Auth**: Supabase Auth with magic links

## Project Structure

```
apps/
├── splash/          # React frontend application
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── contexts/    # React contexts (Auth, etc.)
│   │   ├── hooks/       # Custom hooks
│   │   ├── lib/         # Utilities (API client, Supabase)
│   │   ├── routes/      # TanStack Router pages
│   │   └── services/    # API services and mutations
│   └── package.json
├── booking/         # Fastify backend API
│   ├── routes/      # API endpoints
│   ├── plugins/     # Fastify plugins
│   ├── schemas/     # TypeBox schemas
│   └── package.json
└── package.json     # Monorepo root
```

## Getting Started

### Prerequisites

- Node.js 18+
- Bun (recommended) or npm
- PostgreSQL database
- Supabase account

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd splash
```

2. Install dependencies
```bash
bun install
```

3. Set up environment variables
```bash
# In apps/splash/
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_BOOKING_API_URL=http://localhost:3000

# In apps/booking/
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
FRONTEND_URL=http://localhost:5173
```

4. Start the development servers

```bash
# Terminal 1 - Backend API
cd apps/booking
bun run dev

# Terminal 2 - Frontend
cd apps/splash  
bun run dev
```

## Features

### 🔐 Authentication
- Magic link authentication via Supabase
- Secure session management
- User context throughout the app

### 🎨 Modern UI
- Dark/light theme support
- Responsive design with Tailwind CSS
- Accessible components with Radix UI
- Form validation with React Hook Form + Zod

### 📡 Real-time Architecture  
- TanStack Query for server state management
- Optimistic updates for smooth UX
- Generic API client for consistent data fetching

### 🏗️ Developer Experience
- TypeScript throughout the stack
- Type-safe API contracts with TypeBox
- Monorepo structure with workspace support
- Hot reload in development

## API Endpoints

### Authentication
- `POST /auth/login` - Send magic link to email

*More endpoints coming as the booking system is built out*

## Contributing

This is a personal project solving a real problem at my gym, but contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Roadmap

- [ ] Seat selection interface
- [ ] Real-time booking updates
- [ ] No-show enforcement system
- [ ] Group booking coordination
- [ ] Admin dashboard
- [ ] Mobile app
- [ ] Integration with gym management systems

## About This Project

This project was born from a real frustration with existing pool booking systems. It focuses on solving genuine user experience problems while exploring modern real-time web technologies.

The goal is to create a booking system that actually works for both users and facility managers.

---

*Live demo coming soon!*

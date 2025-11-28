# Asset Manager

A full-stack asset management application with Next.js frontend and Express.js backend.

## Project Structure

```
asset-manager/
├── app/              # Next.js app directory (frontend)
├── components/      # React components
├── backend/          # Express.js backend API
│   ├── config/      # Configuration files
│   ├── controllers/ # Request handlers
│   ├── models/      # Database models
│   ├── routes/      # API routes
│   ├── middleware/  # Express middleware
│   ├── migrations/  # Database migrations
│   └── utils/       # Utility functions
└── lib/             # Frontend utilities
```

## Tech Stack

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Radix UI

### Backend
- Express.js
- PostgreSQL
- Passport.js (Google OAuth)
- JWT Authentication

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL (local or cloud)
- pnpm

### Local Development

1. **Install dependencies:**
```bash
pnpm install
```

2. **Set up database:**
```bash
createdb asset_manager
psql -d asset_manager -f backend/migrations/init.sql
```

3. **Configure environment variables:**
   - Create `.env` in root directory
   - See `backend/README.md` for required variables

4. **Start development servers:**
```bash
# Terminal 1: Frontend
pnpm dev

# Terminal 2: Backend
pnpm dev:server
```

## Deployment

### Backend → Render
See [backend/DEPLOY.md](./backend/DEPLOY.md) for detailed instructions.

### Frontend → Vercel
1. Connect GitHub repository to Vercel
2. Set `NEXT_PUBLIC_API_URL` environment variable
3. Deploy!

For complete deployment guide, see [backend/DEPLOY.md](./backend/DEPLOY.md).

## Features

- ✅ Google OAuth authentication
- ✅ Role-based access control (Admin/User)
- ✅ Organization management
- ✅ Asset tracking
- ✅ Category and department management
- ✅ User approval workflow

## API Documentation

See [backend/README.md](./backend/README.md) for API endpoint documentation.

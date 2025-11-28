# Asset Manager

A full-stack asset management system I built for managing organizational assets with role-based access control. This was my take on creating a production-ready application that demonstrates both technical skills and practical problem-solving.

## What I Built

I created a multi-tenant asset management system where organizations can track their assets, manage users, and maintain categories and departments. The system supports two user roles: admins who manage everything, and regular users who can create and view their own assets.

## Why I Chose This Architecture

I went with a **monorepo structure** because it keeps everything together while maintaining clear separation between frontend and backend. This makes it easier to manage dependencies and ensures both parts stay in sync during development.

For the **frontend**, I chose **Next.js 16** with **React 19** because I wanted to leverage the latest App Router features and server-side rendering capabilities. I paired it with **TypeScript** throughout because type safety catches bugs early and makes the codebase more maintainable.

The **backend** is built with **Express.js** - it's lightweight, flexible, and I have full control over the request/response cycle. I kept the codebase modular with small, focused files (max 30 lines per file where possible) because I believe in maintainability over cleverness.

## My Tech Stack Decisions

### Frontend
- **Next.js 16** - Latest App Router, great DX, and excellent for production
- **Zustand** - I chose this over Redux because it's simpler, has less boilerplate, and the API is intuitive. Perfect for this project's state management needs.
- **Axios** - Reliable HTTP client with interceptors for handling auth tokens automatically
- **shadcn/ui** - Built on Radix UI primitives, gives me beautiful components without the bloat
- **Tailwind CSS** - Utility-first CSS that lets me move fast without context switching

### Backend
- **Express.js** - Battle-tested, minimal overhead, easy to understand
- **PostgreSQL** - Relational database that fits the data model perfectly. I used proper foreign keys and constraints.
- **JWT** - Stateless authentication that scales well and works great with the frontend
- **Passport.js** - Handles Google OAuth cleanly without reinventing the wheel
- **bcrypt** - Industry standard for password hashing

## Deployment Strategy

I deployed the **backend to Render** instead of Supabase because:
1. Render gives me a full Node.js environment with more control
2. Their PostgreSQL service is solid and the free tier is generous
3. I can easily scale if needed
4. The deployment process is straightforward with their `render.yaml` config

The **frontend is on Vercel** because:
1. It's built for Next.js - zero config deployment
2. Automatic deployments on every push to main
3. Edge network for fast global performance
4. Free tier is perfect for this project

Both services integrate seamlessly with GitHub, so every commit automatically triggers a deployment. This is exactly what you'd want in a real team environment.

## Code Structure Philosophy

I organized the code with **separation of concerns** in mind:

**Backend structure:**
- `models/` - Database queries only, no business logic
- `controllers/` - Handle request/response, call models
- `routes/` - Define endpoints, minimal logic
- `middleware/` - Reusable auth and error handling
- `utils/` - Pure functions for transformations and helpers

This makes it easy to test, maintain, and extend. Each file has a single responsibility.

**Frontend structure:**
- `app/` - Next.js App Router pages
- `components/` - Reusable UI components organized by feature
- `lib/api/` - API client layer, one file per resource
- `stores/` - Zustand state management, one store per domain
- `hooks/` - Custom React hooks that wrap the stores

I kept components small and focused. The API layer is completely separate from the UI, so if I need to change how data is fetched, I only touch one place.

## Key Features I Implemented

### Multi-Tenant Architecture
Every user belongs to an organization, and all data is scoped to that organization. This wasn't in the original requirements, but I added it because it's how real-world applications work. Admins can create organizations, and users can join existing ones.

### Google OAuth Flow
I built a custom flow where after Google authentication, new users select their role and either create or join an organization. This gives flexibility while maintaining security. The flow uses temporary JWT tokens to maintain state between the OAuth callback and the final account creation.

### User Approval Workflow
When users join an organization, they start with "pending" status. Admins can approve or reject them. This prevents unauthorized access while keeping the signup process smooth.

### Role-Based Access Control
I implemented this at both the route level (middleware) and the UI level (conditional rendering). Admins see everything, users only see their own assets. The backend enforces this, so even if someone tries to access admin routes directly, they'll be blocked.

## Testing

I created a comprehensive test suite (`backend/scripts/test-all.js`) that:
- Creates test data (organization, users, assets)
- Tests all CRUD operations
- Verifies authentication flows
- Handles edge cases like duplicate data

You can run it with `npm test` from the backend directory. It's not a full test framework, but it gives me confidence that everything works end-to-end.


## Running Locally

See the individual READMEs in `backend/` and `frontend/` for setup instructions. The quick version:

1. Clone the repo
2. Set up PostgreSQL (local or use Render's free tier)
3. Run migrations: `cd backend && npm run migrate`
4. Add environment variables (see `backend/README.md`)
5. Start backend: `npm run dev:server`
6. Start frontend: `cd frontend && npm run dev`

## Environment Variables

You'll need to set up:
- Database connection (PostgreSQL)
- JWT secret for token signing
- Google OAuth credentials
- Frontend URL for OAuth callbacks

Check `backend/README.md` for the complete list.

## Future Improvements

If I had more time (Well i do have the time but i belive this is enough to showcase what i'm about), I'd add:
- Real-time updates with WebSockets
- Asset image uploads
- Advanced filtering and search
- Email notifications for approvals
- Audit logging
- Unit and integration tests with Jest

But for a demo project, I focused on getting the core features right and making the code maintainable.

---

Built with attention to detail and a focus on production-ready code. Feel free to explore, and if you have questions about any of my implementation choices, I'm happy to discuss them!


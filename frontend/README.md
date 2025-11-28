# Frontend - Asset Manager

This is the Next.js frontend I built for the Asset Manager application. I focused on creating a modern, maintainable React application with a clean architecture.

## Why Next.js 16

I chose **Next.js 16** with the App Router because:
- Server-side rendering out of the box
- Great developer experience
- Built-in optimizations (image, font, script loading)
- File-based routing that's intuitive
- Latest React 19 features
- Specified in instructions 

The App Router gives me nested layouts, loading states, and error boundaries without extra configuration. It's what I'd use in a production application.

## State Management: Why Zustand

I chose **Zustand** over Redux or Context API because:
- **Less boilerplate** - No actions, reducers, or providers needed
- **Simple API** - Just create a store and use it
- **Built-in persistence** - One line of code to persist to localStorage
- **TypeScript friendly** - Excellent type inference
- **Small bundle size** - Much lighter than Redux

I created separate stores for each domain (auth, assets, users, categories, departments). This keeps state isolated and makes it easy to understand what data lives where.

Each store is small and focused:
- `auth-store.ts` - User authentication state
- `assets-store.ts` - Asset list and operations
- `users-store.ts` - User management (admin)
- `categories-store.ts` - Category list
- `departments-store.ts` - Department list

## API Layer Architecture

I separated the API calls into a dedicated layer (`lib/api/`):
- `client.ts` - Axios instance with interceptors
- `auth.ts` - Authentication endpoints
- `assets.ts` - Asset CRUD operations
- `users.ts` - User management
- `categories.ts` - Category operations
- `departments.ts` - Department operations
- `organizations.ts` - Organization operations

This separation means:
- If I need to change how API calls work, I only touch one place
- Easy to mock for testing
- Clear what endpoints are available
- Type-safe with TypeScript

The Axios client automatically:
- Adds JWT token to requests
- Handles 401 errors (logs out user)
- Transforms request/response data
- Provides consistent error handling

## Component Organization

I organized components by feature:
- `auth/` - Login, signup, OAuth flows
- `admin/` - Admin dashboard components
- `user/` - User dashboard components
- `forms/` - Reusable form components
- `shared/` - Common UI components (modals, tables, etc.)
- `layout/` - Layout components (header, sidebar)

Each component is small and focused. I avoided "god components" that do too much. This makes it easy to:
- Find components quickly
- Understand what each does
- Reuse components across pages
- Test components in isolation

## Custom Hooks

I created custom hooks (`hooks/`) that wrap the Zustand stores:
- `use-auth.ts` - Authentication state and actions
- `use-assets.ts` - Asset operations
- `use-users.ts` - User management
- `use-categories.ts` - Category operations
- `use-departments.ts` - Department operations

These hooks provide a clean API for components. Instead of importing the store directly, components use the hooks. This gives me flexibility to change the implementation later without touching every component.

## Type Safety

I used **TypeScript** throughout because:
- Catches errors at compile time
- Provides excellent IDE autocomplete
- Makes refactoring safer
- Documents the code (types are documentation)

I defined types in `types/`:
- `index.ts` - Core domain types (User, Asset, Organization, etc.)
- `auth.ts` - Authentication-related types
- `forms.ts` - Form data types

This ensures consistency across the application and prevents bugs from mismatched data shapes.

## UI Components

I used **shadcn/ui** (built on Radix UI) because:
- Accessible by default (Radix handles ARIA)
- Customizable with Tailwind
- No runtime dependencies (copied into project)
- Beautiful default styling
- TypeScript support

I customized the components to match the design system. The components live in `components/ui/` and I can modify them directly since they're part of the codebase.

## Styling with Tailwind

I chose **Tailwind CSS** because:
- Utility-first approach is fast
- No context switching between files
- Consistent spacing/colors via config
- Purges unused styles automatically
- Great developer experience

I created custom utilities in `globals.css` for gradients and animations. The design is clean and modern without being flashy.

## Authentication Flow

I implemented a complete authentication system:

1. **Login** - Email/password with JWT token storage
2. **Google OAuth** - Custom flow with role/organization selection
3. **Protected Routes** - Layout components check auth status
4. **Persistent Sessions** - Zustand persists to localStorage
5. **Auto-logout** - On 401 errors from API

The auth context (`contexts/auth-context.tsx`) wraps the Zustand store and provides a React-friendly API. Components use `useAuthContext()` to access auth state.

## Google OAuth Implementation

I built a custom OAuth flow:
1. User clicks "Continue with Google"
2. Redirects to backend OAuth endpoint
3. Backend handles Google callback
4. If new user: redirects to selection page (`/auth/google/select`)
5. User selects role (admin/user) and organization
6. Backend creates account and returns token
7. Frontend completes login

If user already exists, they're automatically logged in and redirected to their dashboard.

The selection page uses Suspense boundaries (required by Next.js) to handle the dynamic search params.

## Role-Based UI

I implemented role-based rendering:
- Admin sees admin dashboard with all features
- Users see user dashboard with limited features
- Components check `user.role` to show/hide features
- Backend enforces permissions (UI is just UX)

The layouts (`app/admin/layout.tsx` and `app/dashboard/layout.tsx`) protect routes and redirect unauthenticated users.

## Form Handling

I used **React Hook Form** with **Zod** validation because:
- Minimal re-renders (uncontrolled components)
- Built-in validation
- Type-safe with Zod schemas
- Easy error handling
- Great developer experience

Forms are in `components/forms/` and are reusable across the application.

## Error Handling

I implemented consistent error handling:
- API errors are caught and displayed to users
- Loading states prevent double submissions
- Form validation provides immediate feedback
- Network errors show user-friendly messages

The error handling is centralized in the API client, so components don't need to handle every error case.

## Local Development

1. **Install dependencies:**
```bash
pnpm install
```

2. **Set up environment variables:**
Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

3. **Start development server:**
```bash
pnpm dev
```

The app will run on `http://localhost:3000`.

## Production Deployment

I deployed to **Vercel** because:
- Built for Next.js (zero config)
- Automatic deployments from GitHub
- Edge network for fast performance
- Free tier is generous
- Easy environment variable management

Just connect the GitHub repo and Vercel handles the rest. Every push to main triggers a deployment.

Set the `NEXT_PUBLIC_API_URL` environment variable to your backend URL.

## Project Structure

```
frontend/
├── app/              # Next.js App Router pages
│   ├── admin/       # Admin dashboard pages
│   ├── dashboard/   # User dashboard pages
│   └── auth/        # Authentication pages
├── components/       # React components
│   ├── admin/       # Admin-specific components
│   ├── auth/        # Auth components
│   ├── forms/       # Form components
│   ├── shared/      # Shared UI components
│   └── ui/          # shadcn/ui components
├── hooks/           # Custom React hooks
├── lib/             # Utilities
│   └── api/         # API client layer
├── stores/          # Zustand state stores
└── types/           # TypeScript type definitions
```

## Code Quality Principles

I followed these principles:
- **Small files** - Each file has a single responsibility
- **Type safety** - TypeScript everywhere
- **Reusability** - Components and hooks are reusable
- **Separation of concerns** - UI, state, and API are separate
- **Consistency** - Similar patterns throughout

This makes the codebase:
- Easy to understand
- Easy to maintain
- Easy to extend
- Easy to test

## What I'd Improve

If I had more time:
- Add unit tests with React Testing Library
- Implement error boundaries for better error handling
- Add loading skeletons instead of spinners
- Implement optimistic updates for better UX
- Add data caching with React Query
- Implement real-time updates with WebSockets

But the current implementation is production-ready and maintainable.

---

The frontend is built with modern best practices and attention to user experience. Every decision was made with maintainability and scalability in mind.

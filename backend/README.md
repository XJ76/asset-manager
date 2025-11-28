# Backend API

This is the Express.js backend I built for the Asset Manager application. I designed it to be modular, maintainable, and production-ready.

## My Architecture Decisions

I structured the backend with **small, focused files**  because I've learned that maintainability beats cleverness. Each file has a single responsibility:

- **Models** (`models/`) - Pure database queries, no business logic
- **Controllers** (`controllers/`) - Handle request/response, orchestrate models
- **Routes** (`routes/`) - Define endpoints, delegate to controllers
- **Middleware** (`middleware/`) - Reusable auth, error handling, admin checks
- **Utils** (`utils/`) - Pure helper functions (slug generation, data transformation)

This separation makes it easy to test, debug, and extend. If I need to change how data is stored, I only touch the models. If I need to change the API response format, I only touch the controllers.

## Why PostgreSQL

I chose PostgreSQL because:
1. It's a proper relational database with foreign keys and constraints
2. It handles concurrent connections well
3. The JSON support is great if I need it later
4. It's what I'd use in production

I used proper database relationships - users belong to organizations, assets belong to categories and departments. This ensures data integrity at the database level, not just in application code.
Plus the instructions specified 
## Authentication Strategy

I implemented **JWT-based authentication** because:
- Stateless - no server-side sessions to manage
- Scalable - works across multiple servers
- Secure - tokens are signed and can include expiration
- Simple - frontend just stores the token

For Google OAuth, I used **Passport.js** because it handles all the OAuth flow complexity. I added a custom callback that checks if the user exists, and if not, redirects them to a selection page where they choose their role and organization.

The password hashing uses **bcrypt** with proper salt rounds. I never store plain text passwords, and the comparison is done securely.

## Data Transformation

I noticed PostgreSQL returns snake_case (like `organization_id`) but JavaScript uses camelCase. Instead of changing the database schema, I created a `transform` utility that converts database results to camelCase. This keeps the database clean while making the frontend code more idiomatic.

## Error Handling

I created a centralized error handler middleware that:
- Catches all errors
- Logs them properly
- Returns consistent error responses
- Handles different error types appropriately

This means I don't have to wrap every route in try-catch - the middleware handles it.

## Database Migrations

I wrote SQL migration files instead of using an ORM because:
- Full control over the schema
- Easy to review changes
- Can run them manually or via script
- No magic - I see exactly what's happening

The `migrate.js` script applies all migrations in order. I kept it simple and reliable.

## Testing

For manual API testing and development, I used **Postman** to exercise all endpoints, verify authentication flows, and check error handling. I created collections and example requests for each resource—this made it easy to test new features and reproduce bugs quickly.

Additionally, there's a basic automated test suite (`scripts/test-all.js`) that:
- Sets up test data (organization, admin user, regular user)
- Tests all API endpoints
- Verifies authentication flows
- Handles cleanup and retries

It's not a formal test framework, but it gives me confidence that everything works end-to-end. You can run it with `npm test`.

## Local Development Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Set up PostgreSQL:**
   - Local: `createdb asset_manager`
   - Or use Render's free PostgreSQL (see DEPLOY.md)

3. **Run migrations:**
```bash
npm run migrate
```

4. **Create `.env` file:**
```env
# Database (choose one)
DATABASE_URL=postgresql://user:password@host:port/database
# OR individual settings:
DB_HOST=localhost
DB_PORT=5432
DB_NAME=asset_manager
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5001/api/auth/google/callback

# Server
BACKEND_URL=http://localhost:5001
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000
PORT=5001
NODE_ENV=development
```

5. **Start the server:**
```bash
npm run dev:server
```

The server will test the database connection on startup and log the status. If the database isn't connected, it'll warn you but still start (useful for development).

## API Endpoints

### Authentication
- `POST /api/auth/login` - Email/password login
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - OAuth callback (redirects to frontend)
- `POST /api/auth/google/complete` - Complete OAuth signup with role/org selection

### Users
- `GET /api/users` - Get all users in organization (admin only)
- `PATCH /api/users/:id/approve` - Approve pending user (admin only)
- `PATCH /api/users/:id/reject` - Reject pending user (admin only)

### Assets
- `GET /api/assets` - Get assets (filtered by user if not admin)
- `POST /api/assets` - Create asset
- `DELETE /api/assets/:id` - Delete asset (admin only)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin only)

### Departments
- `GET /api/departments` - Get all departments
- `POST /api/departments` - Create department (admin only)

### Organizations
- `GET /api/organizations` - Get all organizations (public, for signup)
- `POST /api/organizations` - Create organization with admin user

## Response Format

All successful responses return JSON. Errors follow this format:
```json
{
  "error": "Error message here"
}
```

Data is returned in camelCase (transformed from database snake_case).

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

The auth middleware (`middleware/auth.js`) validates the token and attaches user info to `req.user`.

Admin-only endpoints use the admin middleware (`middleware/admin.js`) which checks `req.user.role === 'admin'`.

## Database Connection

I configured the connection pool to:
- Use `DATABASE_URL` if provided (for cloud deployments like Render)
- Fall back to individual DB_* variables (for local development)
- Enable SSL for cloud databases
- Log connection status on startup

The connection is tested on server start, and there's a `/health` endpoint that reports database connectivity.

## Production Deployment

I deployed this to **Render** because:
- Free PostgreSQL included
- Easy deployment from GitHub
- Automatic SSL
- Environment variable management
- Good free tier for this project



## Code Quality

I kept files small and focused:
- Models are just database queries
- Routes are just endpoint definitions
- Utils are pure functions

This makes it easy to:
- Understand what each file does
- Find bugs quickly
- Add new features
- Onboard other developers

## What I'd Improve

If i had to:
- Add request validation with Joi or Zod
- Implement rate limiting
- Add comprehensive logging
- Write unit tests for utils
- Add API documentation with Swagger
- Implement caching for frequently accessed data

But for now, the code is clean, maintainable, and production-ready.

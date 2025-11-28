# Backend API

Express.js backend with PostgreSQL and Google OAuth.

## Local Development Setup

1. Install dependencies:
```bash
pnpm install
```

2. Create PostgreSQL database (local or cloud):
```bash
createdb asset_manager
```

3. Run migrations:
```bash
psql -d asset_manager -f backend/migrations/init.sql
```

4. Create `.env` file in the root directory:
```env
# For local development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=asset_manager
DB_USER=postgres
DB_PASSWORD=your_password

# OR use DATABASE_URL for cloud databases
# DATABASE_URL=postgresql://user:password@host:port/database

JWT_SECRET=your-super-secret-jwt-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
BACKEND_URL=http://localhost:5000
ALLOWED_ORIGINS=http://localhost:3000
PORT=5000
NODE_ENV=development
```

5. Start the server:
```bash
pnpm run dev:server
```

## Production Deployment

See [DEPLOY.md](./DEPLOY.md) for detailed deployment instructions to Render.

## API Endpoints

- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - OAuth callback
- `GET /api/users` - Get users (admin only)
- `PATCH /api/users/:id/approve` - Approve user (admin only)
- `PATCH /api/users/:id/reject` - Reject user (admin only)
- `GET /api/assets` - Get assets
- `POST /api/assets` - Create asset
- `DELETE /api/assets/:id` - Delete asset
- `GET /api/categories` - Get categories
- `POST /api/categories` - Create category (admin only)
- `GET /api/departments` - Get departments
- `POST /api/departments` - Create department (admin only)
- `POST /api/organizations` - Create organization


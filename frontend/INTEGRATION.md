# Frontend-Backend Integration

This document describes the frontend integration with the backend API using Zustand and Axios.

## Architecture

### API Layer (`lib/api/`)
- **client.ts** - Axios instance with interceptors for auth tokens
- **auth.ts** - Authentication API calls
- **assets.ts** - Assets API calls
- **users.ts** - Users API calls
- **categories.ts** - Categories API calls
- **departments.ts** - Departments API calls
- **organizations.ts** - Organizations API calls

### State Management (`stores/`)
- **auth-store.ts** - Authentication state (with persistence)
- **assets-store.ts** - Assets state
- **users-store.ts** - Users state
- **categories-store.ts** - Categories state
- **departments-store.ts** - Departments state

### Hooks (`hooks/`)
All hooks now use Zustand stores instead of local state:
- `useAuth()` - Uses `useAuthStore`
- `useAssets()` - Uses `useAssetsStore`
- `useUsers()` - Uses `useUsersStore`
- `useCategories()` - Uses `useCategoriesStore`
- `useDepartments()` - Uses `useDepartmentsStore`

## Features

### Authentication
- JWT token stored in localStorage
- Automatic token injection in API requests
- Auto-redirect on 401 errors
- Persistent auth state with Zustand persist

### API Client
- Base URL from `NEXT_PUBLIC_API_URL` env variable
- Automatic Authorization header injection
- Error handling and token refresh ready

## Usage

### In Components
```tsx
import { useAuthStore } from '@/stores/auth-store'
import { useAssetsStore } from '@/stores/assets-store'

function MyComponent() {
  const { user, login, logout } = useAuthStore()
  const { assets, fetchAssets, createAsset } = useAssetsStore()
  
  // Use the stores...
}
```

### Or Use Hooks
```tsx
import { useAssets } from '@/hooks/use-assets'

function MyComponent() {
  const { assets, isLoading, fetchAssets } = useAssets()
  // Hook automatically fetches on mount
}
```

## Environment Variables

Set `NEXT_PUBLIC_API_URL` in your `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

For production (Vercel), set it in the Vercel dashboard.


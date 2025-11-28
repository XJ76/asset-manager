# Deployment Guide

## Deploy Backend to Render

### 1. Create PostgreSQL Database on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "PostgreSQL"
3. Name it `asset-manager-db`
4. Select "Free" plan (or paid for production)
5. Note the **Internal Database URL** (you'll need this)

### 2. Deploy Backend Service

1. In Render Dashboard, click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `asset-manager-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`

### 3. Set Environment Variables

In Render dashboard, add these environment variables:

```
NODE_ENV=production
PORT=10000
DATABASE_URL=<auto-filled from PostgreSQL service>
JWT_SECRET=<generate a strong random string>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
GOOGLE_CALLBACK_URL=https://your-backend.onrender.com/api/auth/google/callback
BACKEND_URL=https://your-backend.onrender.com
ALLOWED_ORIGINS=https://your-frontend.vercel.app,http://localhost:3000
```

**Important**: 
- Replace `your-backend.onrender.com` with your actual Render service URL
- Replace `your-frontend.vercel.app` with your actual Vercel deployment URL
- Generate a strong `JWT_SECRET` (you can use: `openssl rand -base64 32`)

### 4. Run Database Migration

After deployment, run the migration using Render's Shell:

1. Go to your web service in Render
2. Click "Shell" tab
3. Run:
```bash
cd backend
npm run migrate
```

Or manually:
```bash
cd backend
psql $DATABASE_URL -f migrations/init.sql
```

**Note**: Make sure your PostgreSQL database is created and `DATABASE_URL` is set before running migrations.

## Deploy Frontend to Vercel

### 1. Update Frontend API URL

The frontend uses `NEXT_PUBLIC_API_URL` environment variable. You'll set this in Vercel.

### 2. Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com)
2. Import your GitHub repository
3. Vercel will auto-detect Next.js
4. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = `https://your-backend.onrender.com/api`
5. Deploy!

**Note**: After deployment, update your frontend URL in Render's `ALLOWED_ORIGINS` environment variable.

### 3. Update Google OAuth Settings

In [Google Cloud Console](https://console.cloud.google.com):

1. Go to your OAuth 2.0 Client
2. Add authorized redirect URI:
   - `https://your-backend.onrender.com/api/auth/google/callback`
3. Add authorized JavaScript origins:
   - `https://your-frontend.vercel.app`
   - `http://localhost:3000` (for local development)

## Environment Variables Summary

### Backend (Render)
- `DATABASE_URL` - Auto-provided by Render PostgreSQL (Internal Database URL)
- `JWT_SECRET` - Random secret for JWT tokens (generate with `openssl rand -base64 32`)
- `GOOGLE_CLIENT_ID` - From Google Cloud Console
- `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
- `GOOGLE_CALLBACK_URL` - Your Render backend URL + `/api/auth/google/callback`
- `BACKEND_URL` - Your Render backend URL
- `ALLOWED_ORIGINS` - Comma-separated frontend URLs (Vercel URL + localhost)

### Frontend (Vercel)
- `NEXT_PUBLIC_API_URL` - Your Render backend URL + `/api`

## Quick Checklist

- [ ] PostgreSQL database created on Render
- [ ] Backend service deployed on Render
- [ ] All environment variables set in Render
- [ ] Database migration run successfully
- [ ] Frontend deployed on Vercel
- [ ] `NEXT_PUBLIC_API_URL` set in Vercel
- [ ] Google OAuth redirect URI updated
- [ ] Google OAuth JavaScript origins updated
- [ ] Test authentication flow
- [ ] Test API endpoints

# Deployment Guide for Pakistan Idol Dashboard

## 🚀 Vercel Deployment

### 1. Prerequisites
- GitHub repository with your code
- Vercel account (free tier available)

### 2. Database Setup Options

#### Option A: Vercel Postgres (Recommended)
1. Go to Vercel Dashboard
2. Create a new project
3. Add Vercel Postgres database
4. Copy the connection string

#### Option B: Supabase (Alternative)
1. Create account at supabase.com
2. Create new project
3. Get connection string from Settings > Database

### 3. Environment Variables
Set these in Vercel Dashboard > Project Settings > Environment Variables:

```
DATABASE_URL=postgresql://username:password@host:port/database
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://your-domain.vercel.app
NODE_ENV=production
```

### 4. Authentication Setup
The app supports two user roles:
- **Viewer**: Read-only access
- **Editor**: Full edit access

### 5. Deployment Steps
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy!

### 6. Post-Deployment
1. Run database migrations
2. Seed initial data
3. Test all functionality

## 🔧 Local Development
- Uses SQLite database
- No additional setup required
- Run `npm run dev` to start

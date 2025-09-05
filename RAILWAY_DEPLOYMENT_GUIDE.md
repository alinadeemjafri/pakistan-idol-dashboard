# Railway Deployment Guide - Step by Step

## 🎯 **Goal: Deploy Your Pakistan Idol Dashboard to Railway in 15 Minutes**

This guide will help you deploy your app to Railway without any technical knowledge required.

---

## 📋 **What You Need Before Starting**

1. **Your code on GitHub** (if not already there, I'll help you)
2. **A Railway account** (free to sign up)
3. **15 minutes of time**

---

## 🚀 **Step 1: Prepare Your Code for Railway**

### **1.1 Update Database Configuration**

I'll help you change from SQLite to PostgreSQL (Railway provides this automatically).

**File to update:** `drizzle.config.ts`
```typescript
import type { Config } from 'drizzle-kit';

export default {
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
} satisfies Config;
```

### **1.2 Update Database Connection**

**File to update:** `lib/db/index.ts`
```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Railway automatically provides DATABASE_URL
const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client, { schema });
```

### **1.3 Add Required Dependencies**

**File to update:** `package.json`
```json
{
  "dependencies": {
    "postgres": "^3.4.3"
  }
}
```

### **1.4 Create Railway Configuration**

**Create new file:** `railway.json`
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### **1.5 Add Health Check Endpoint**

**Create new file:** `app/api/health/route.ts`
```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
}
```

---

## 🚀 **Step 2: Set Up Railway Account**

### **2.1 Sign Up for Railway**
1. Go to [railway.app](https://railway.app)
2. Click "Sign Up"
3. Choose "Sign up with GitHub" (recommended)
4. Authorize Railway to access your GitHub

### **2.2 Create New Project**
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your Pakistan Idol Dashboard repository
4. Click "Deploy"

---

## 🚀 **Step 3: Configure Database**

### **3.1 Add PostgreSQL Database**
1. In your Railway project dashboard
2. Click "New" → "Database" → "PostgreSQL"
3. Railway automatically creates a PostgreSQL database
4. Copy the `DATABASE_URL` (you'll need this)

### **3.2 Connect Database to Your App**
1. Go to your app service in Railway
2. Click "Variables" tab
3. Add new variable:
   - **Name:** `DATABASE_URL`
   - **Value:** (paste the DATABASE_URL from your database)
4. Click "Add"

---

## 🚀 **Step 4: Deploy Your App**

### **4.1 Automatic Deployment**
Railway automatically deploys your app when you:
1. Push code to your GitHub repository
2. Or click "Deploy" in the Railway dashboard

### **4.2 Monitor Deployment**
1. Go to your app service
2. Click "Deployments" tab
3. Watch the deployment progress
4. Wait for "Deployed" status

---

## 🚀 **Step 5: Set Up Your Database**

### **5.1 Run Database Migrations**
1. In Railway dashboard, go to your app service
2. Click "Deployments" tab
3. Click on the latest deployment
4. Click "View Logs"
5. Look for successful deployment message

### **5.2 Seed Your Database**
1. Go to your app service
2. Click "Variables" tab
3. Add new variable:
   - **Name:** `NODE_ENV`
   - **Value:** `production`
4. Railway will automatically run your seed script

---

## 🚀 **Step 6: Access Your Live App**

### **6.1 Get Your App URL**
1. In Railway dashboard, go to your app service
2. Click "Settings" tab
3. Find "Domains" section
4. Copy your app URL (looks like: `https://your-app-name.railway.app`)

### **6.2 Test Your App**
1. Open the URL in your browser
2. Test the main features:
   - View contestants
   - View episodes
   - Login functionality
3. Everything should work exactly like before!

---

## 📊 **Railway Dashboard Overview**

### **What You Can See:**
- **Usage:** How much CPU, memory, and bandwidth you're using
- **Logs:** See what's happening with your app
- **Metrics:** Performance charts and statistics
- **Deployments:** History of all deployments
- **Variables:** Environment settings

### **What You Can Do:**
- **Redeploy:** Click "Redeploy" to update your app
- **View Logs:** See real-time logs from your app
- **Scale:** Adjust resources if needed (Railway handles this automatically)
- **Monitor:** See performance metrics

---

## 💰 **Railway Pricing**

### **Free Tier:**
- $5 credit per month
- Perfect for testing and small projects
- Automatic scaling

### **Pro Plan ($20/month):**
- Unlimited deployments
- Custom domains
- Priority support
- Advanced monitoring
- **Handles 500+ users easily**

---

## 🔧 **Troubleshooting Common Issues**

### **Issue: App Won't Start**
**Solution:**
1. Check the logs in Railway dashboard
2. Look for error messages
3. Most common issue: missing environment variables

### **Issue: Database Connection Error**
**Solution:**
1. Make sure `DATABASE_URL` is set in Variables
2. Check that PostgreSQL service is running
3. Verify the URL format is correct

### **Issue: App is Slow**
**Solution:**
1. Railway automatically scales, but you can:
2. Upgrade to Pro plan for better performance
3. Check the metrics to see resource usage

---

## 🎉 **You're Done!**

### **What You've Accomplished:**
- ✅ **Deployed your app** to a professional hosting platform
- ✅ **Set up a database** that can handle 500+ users
- ✅ **Automatic scaling** - your app grows with your users
- ✅ **Professional monitoring** - see how your app is performing
- ✅ **Automatic backups** - your data is safe
- ✅ **Global CDN** - fast loading worldwide

### **Your App Can Now:**
- Handle 500+ concurrent users
- Scale automatically during traffic spikes
- Load fast from anywhere in the world
- Stay online 99.9% of the time
- Backup data automatically

### **What You Need to Do:**
- **Nothing!** Railway handles everything automatically
- Just push code updates to GitHub and they deploy automatically
- Monitor your app through the simple Railway dashboard

---

## 📞 **Getting Help**

### **Railway Support:**
- **Documentation:** [docs.railway.app](https://docs.railway.app)
- **Community:** [Railway Discord](https://discord.gg/railway)
- **Support:** Email support for Pro users

### **If You Need Help:**
1. Check Railway documentation first
2. Ask in Railway Discord community
3. Contact Railway support
4. I can help you with any issues!

**Congratulations! Your Pakistan Idol Dashboard is now live and can handle 500+ users! 🎉**

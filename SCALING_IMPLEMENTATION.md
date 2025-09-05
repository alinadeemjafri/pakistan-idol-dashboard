# Scaling Implementation Guide

## Immediate Changes Required

### 1. Database Migration from SQLite to PostgreSQL

#### Update Drizzle Configuration
```typescript
// drizzle.config.ts
import type { Config } from 'drizzle-kit';

export default {
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'pakistan_idol',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  },
} satisfies Config;
```

#### Update Database Connection
```typescript
// lib/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/pakistan_idol';

// Create connection with pooling
const client = postgres(connectionString, {
  max: 20, // Maximum connections
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });
```

#### Update Package.json Dependencies
```json
{
  "dependencies": {
    "postgres": "^3.4.3",
    "drizzle-orm": "^0.29.0"
  },
  "devDependencies": {
    "@types/pg": "^8.10.9"
  }
}
```

### 2. Add Redis Caching Layer

#### Install Redis Dependencies
```bash
npm install redis @types/redis
```

#### Create Redis Client
```typescript
// lib/redis.ts
import { createClient } from 'redis';

const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    connectTimeout: 10000,
    lazyConnect: true,
  },
});

redis.on('error', (err) => console.error('Redis Client Error', err));
redis.on('connect', () => console.log('Redis Client Connected'));

export default redis;
```

#### Implement Caching Functions
```typescript
// lib/cache.ts
import redis from './redis';

export class CacheService {
  private static instance: CacheService;
  
  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key: string, value: any, ttl: number = 300): Promise<void> {
    try {
      await redis.setEx(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(keys);
      }
    } catch (error) {
      console.error('Cache invalidate error:', error);
    }
  }
}

export const cache = CacheService.getInstance();
```

### 3. Optimize Database Queries

#### Update Contestant Operations with Caching
```typescript
// lib/db/contestant-operations.ts
import { cache } from '@/lib/cache';

export async function getContestantWithScores(id: string) {
  const cacheKey = `contestant:${id}:scores`;
  
  // Try cache first
  const cached = await cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  // Fetch from database
  const contestant = await db
    .select({
      id: contestants.id,
      name: contestants.name,
      age: contestants.age,
      city: contestants.city,
      phone: contestants.phone,
      email: contestants.email,
      bio: contestants.bio,
      audition_date: contestants.audition_date,
      audition_city: contestants.audition_city,
      status: contestants.status,
      total_score: contestants.total_score,
      average_score: contestants.average_score,
      episodes_participated: contestants.episodes_participated,
      golden_mics_received: contestants.golden_mics_received,
    })
    .from(contestants)
    .where(eq(contestants.id, id))
    .limit(1);

  if (contestant.length === 0) {
    return null;
  }

  // Get scores with optimized query
  const scores = await db
    .select({
      id: contestant_scores.id,
      episode_id: contestant_scores.episode_id,
      judge_name: contestant_scores.judge_name,
      score: contestant_scores.score,
      remarks: contestant_scores.remarks,
    })
    .from(contestant_scores)
    .where(eq(contestant_scores.contestant_id, id));

  // Get episodes with optimized query
  const episodes = await db
    .select({
      id: contestant_episodes.id,
      episode_id: contestant_episodes.episode_id,
      performance_order: contestant_episodes.performance_order,
      song_title: contestant_episodes.song_title,
      performance_notes: contestant_episodes.performance_notes,
    })
    .from(contestant_episodes)
    .where(eq(contestant_episodes.contestant_id, id));

  const result = {
    ...contestant[0],
    scores,
    episodes,
  };

  // Cache for 5 minutes
  await cache.set(cacheKey, result, 300);
  
  return result;
}

export async function getAllContestants() {
  const cacheKey = 'contestants:all';
  
  const cached = await cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const contestants = await db
    .select()
    .from(contestants)
    .orderBy(asc(contestants.name));

  // Cache for 10 minutes
  await cache.set(cacheKey, contestants, 600);
  
  return contestants;
}
```

### 4. Add Database Indexes

#### Create Migration File
```sql
-- drizzle/migrations/0001_add_indexes.sql
CREATE INDEX IF NOT EXISTS idx_contestant_scores_contestant_id ON contestant_scores(contestant_id);
CREATE INDEX IF NOT EXISTS idx_contestant_scores_episode_id ON contestant_scores(episode_id);
CREATE INDEX IF NOT EXISTS idx_contestant_episodes_contestant_id ON contestant_episodes(contestant_id);
CREATE INDEX IF NOT EXISTS idx_contestant_episodes_episode_id ON contestant_episodes(episode_id);
CREATE INDEX IF NOT EXISTS idx_episodes_phase_city ON episodes(phase, city);
CREATE INDEX IF NOT EXISTS idx_episodes_episode_no ON episodes(episode_no);
CREATE INDEX IF NOT EXISTS idx_contestants_status ON contestants(status);
CREATE INDEX IF NOT EXISTS idx_contestants_city ON contestants(city);
```

### 5. Add Health Check Endpoint

#### Create Health Check API
```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import redis from '@/lib/redis';

export async function GET() {
  try {
    // Check database connection
    await db.execute(sql`SELECT 1`);
    
    // Check Redis connection
    await redis.ping();
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        redis: 'connected',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
```

### 6. Add Rate Limiting

#### Install Rate Limiting Package
```bash
npm install @upstash/ratelimit @upstash/redis
```

#### Create Rate Limiter
```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
  analytics: true,
});
```

#### Add Rate Limiting Middleware
```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ratelimit } from '@/lib/rate-limit';

export async function middleware(request: NextRequest) {
  // Get IP address
  const ip = request.ip ?? '127.0.0.1';
  
  // Check rate limit
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return new NextResponse('Too Many Requests', { status: 429 });
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
```

### 7. Environment Variables

#### Update .env.example
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/pakistan_idol
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=pakistan_idol

# Redis
REDIS_URL=redis://localhost:6379
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token

# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Security
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=https://your-domain.com
```

### 8. Docker Configuration

#### Create Dockerfile
```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### Create Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/pakistan_idol
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    restart: unless-stopped

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=pakistan_idol
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    restart: unless-stopped

volumes:
  postgres_data:
```

### 9. Performance Monitoring

#### Add Performance Monitoring
```typescript
// lib/monitoring.ts
export function trackPerformance(name: string, fn: () => Promise<any>) {
  return async (...args: any[]) => {
    const start = Date.now();
    try {
      const result = await fn(...args);
      const duration = Date.now() - start;
      
      // Log slow queries
      if (duration > 1000) {
        console.warn(`Slow operation: ${name} took ${duration}ms`);
      }
      
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      console.error(`Error in ${name} after ${duration}ms:`, error);
      throw error;
    }
  };
}
```

### 10. Deployment Scripts

#### Create Deployment Script
```bash
#!/bin/bash
# deploy.sh

echo "Starting deployment..."

# Build the application
npm run build

# Run database migrations
npm run db:push

# Start the application
pm2 start ecosystem.config.js --env production

echo "Deployment completed!"
```

#### Create PM2 Configuration
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'pakistan-idol-dashboard',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

## Testing the Scaling

### Load Testing Script
```javascript
// test/load-test.js
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 200 }, // Ramp up to 200 users
    { duration: '5m', target: 200 }, // Stay at 200 users
    { duration: '2m', target: 500 }, // Ramp up to 500 users
    { duration: '5m', target: 500 }, // Stay at 500 users
    { duration: '2m', target: 0 },   // Ramp down to 0 users
  ],
};

export default function() {
  let response = http.get('http://localhost:3000/api/contestants');
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
  });
}
```

This implementation guide provides all the necessary code changes to scale your Pakistan Idol Dashboard to handle 500+ concurrent users efficiently.

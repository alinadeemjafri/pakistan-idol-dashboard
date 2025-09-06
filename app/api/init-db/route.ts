import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export async function POST() {
  try {
    console.log('Initializing database schema...');
    
    // Create tables using raw SQL
    await db.execute(sql`
      -- Create episodes table with correct schema
      CREATE TABLE IF NOT EXISTS episodes (
        episode_id TEXT PRIMARY KEY,
        episode_no INTEGER NOT NULL,
        phase TEXT NOT NULL,
        city TEXT NOT NULL,
        week TEXT,
        
        -- Recording
        record_start TEXT NOT NULL,
        record_end TEXT NOT NULL,
        record_venue TEXT NOT NULL,
        
        -- Airing
        air_start TEXT NOT NULL,
        air_end TEXT NOT NULL,
        channel TEXT NOT NULL,
        
        -- Format
        performances_planned INTEGER NOT NULL DEFAULT 0,
        performances_locked INTEGER NOT NULL DEFAULT 0,
        golden_mics_available INTEGER NOT NULL DEFAULT 0,
        golden_mics_used INTEGER NOT NULL DEFAULT 0,
        voting_enabled BOOLEAN NOT NULL DEFAULT false,
        
        format_summary TEXT NOT NULL DEFAULT '',
        notes TEXT NOT NULL DEFAULT '',
        
        updated_by TEXT,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.execute(sql`
      -- Create users table
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'Viewer' CHECK (role IN ('Editor', 'Viewer')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.execute(sql`
      -- Create contestants table
      CREATE TABLE IF NOT EXISTS contestants (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        age INTEGER NOT NULL,
        city TEXT NOT NULL,
        phone TEXT,
        email TEXT,
        status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'eliminated', 'winner')),
        golden_mics_received INTEGER NOT NULL DEFAULT 0,
        average_score DECIMAL(3,1),
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.execute(sql`
      -- Create contestant_scores table
      CREATE TABLE IF NOT EXISTS contestant_scores (
        id TEXT PRIMARY KEY,
        contestant_id TEXT NOT NULL,
        episode_id TEXT NOT NULL,
        score INTEGER NOT NULL,
        judge_name TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.execute(sql`
      -- Create contestant_episodes table
      CREATE TABLE IF NOT EXISTS contestant_episodes (
        id TEXT PRIMARY KEY,
        contestant_id TEXT NOT NULL,
        episode_id TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.execute(sql`
      -- Insert admin user
      INSERT INTO users (id, email, name, role) 
      VALUES ('admin-001', 'admin@pakistanidol.com', 'Admin User', 'Editor')
      ON CONFLICT (email) DO NOTHING
    `);

    return NextResponse.json({
      success: true,
      message: 'Database schema initialized successfully'
    });
  } catch (error) {
    console.error('Database initialization error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

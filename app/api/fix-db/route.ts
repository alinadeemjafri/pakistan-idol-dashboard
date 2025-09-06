import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export async function POST() {
  try {
    console.log('Fixing database schema...');
    
    // Drop existing tables if they exist (to start fresh)
    await db.execute(sql`DROP TABLE IF EXISTS contestant_episodes`);
    await db.execute(sql`DROP TABLE IF EXISTS contestant_scores`);
    await db.execute(sql`DROP TABLE IF EXISTS contestants`);
    await db.execute(sql`DROP TABLE IF EXISTS episodes`);
    await db.execute(sql`DROP TABLE IF EXISTS users`);

    // Create episodes table with correct schema
    await db.execute(sql`
      CREATE TABLE episodes (
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

    // Create users table
    await db.execute(sql`
      CREATE TABLE users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'Viewer' CHECK (role IN ('Editor', 'Viewer')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create contestants table
    await db.execute(sql`
      CREATE TABLE contestants (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        age INTEGER NOT NULL,
        city TEXT NOT NULL,
        phone TEXT,
        email TEXT,
        profile_image TEXT,
        bio TEXT,
        audition_date TEXT,
        audition_city TEXT NOT NULL,
        audition_venue TEXT,
        status TEXT NOT NULL DEFAULT 'Competing' CHECK (status IN ('Competing', 'Eliminated', 'Winner', 'Runner-up')),
        total_score REAL DEFAULT 0,
        average_score REAL DEFAULT 0,
        golden_mics_received INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create contestant_scores table
    await db.execute(sql`
      CREATE TABLE contestant_scores (
        id TEXT PRIMARY KEY,
        contestant_id TEXT NOT NULL,
        episode_id TEXT NOT NULL,
        score INTEGER NOT NULL,
        judge_name TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create contestant_episodes table
    await db.execute(sql`
      CREATE TABLE contestant_episodes (
        id TEXT PRIMARY KEY,
        contestant_id TEXT NOT NULL,
        episode_id TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert admin user
    await db.execute(sql`
      INSERT INTO users (id, email, name, role) 
      VALUES ('admin-001', 'admin@pakistanidol.com', 'Admin User', 'Editor')
    `);

    // Insert some sample episodes
    await db.execute(sql`
      INSERT INTO episodes (episode_id, episode_no, phase, city, week, record_start, record_end, record_venue, air_start, air_end, channel, format_summary) 
      VALUES 
      ('ep-001', 1, 'Auditions', 'Karachi', 'Week 1', '2025-01-15 10:00', '2025-01-15 18:00', 'Karachi Studio', '2025-01-20 20:00', '2025-01-20 22:00', 'Geo TV', 'Audition rounds in Karachi'),
      ('ep-002', 2, 'Auditions', 'Lahore', 'Week 2', '2025-01-22 10:00', '2025-01-22 18:00', 'Lahore Studio', '2025-01-27 20:00', '2025-01-27 22:00', 'Geo TV', 'Audition rounds in Lahore')
    `);

    // Insert some sample contestants
    await db.execute(sql`
      INSERT INTO contestants (id, name, age, city, audition_city, status, golden_mics_received, average_score) 
      VALUES 
      ('cont-001', 'Ali Ahmed', 25, 'Karachi', 'Karachi', 'Competing', 0, 8.5),
      ('cont-002', 'Sara Khan', 22, 'Lahore', 'Lahore', 'Competing', 1, 9.2),
      ('cont-003', 'Hassan Ali', 28, 'Islamabad', 'Islamabad', 'Eliminated', 0, 7.8)
    `);

    return NextResponse.json({
      success: true,
      message: 'Database schema fixed successfully with sample data'
    });
  } catch (error) {
    console.error('Database fix error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

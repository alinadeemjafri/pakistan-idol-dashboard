// Database migration script for Railway PostgreSQL
// Run this with: node migrate-database.js

const postgres = require('postgres');

async function migrateDatabase() {
  const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:password@host:port/database';
  
  console.log('Starting database migration...');
  
  try {
    const sql = postgres(DATABASE_URL);
    
    // Create episodes table
    await sql`
      CREATE TABLE IF NOT EXISTS episodes (
        episode_id TEXT PRIMARY KEY,
        episode_no INTEGER NOT NULL,
        phase TEXT NOT NULL,
        city TEXT NOT NULL,
        week TEXT,
        record_start TEXT NOT NULL,
        record_end TEXT NOT NULL,
        record_venue TEXT NOT NULL,
        air_start TEXT NOT NULL,
        air_end TEXT NOT NULL,
        channel TEXT NOT NULL,
        performances_planned INTEGER NOT NULL DEFAULT 0,
        performances_locked INTEGER NOT NULL DEFAULT 0,
        golden_mics_available INTEGER NOT NULL DEFAULT 0,
        golden_mics_used INTEGER NOT NULL DEFAULT 0,
        voting_enabled INTEGER NOT NULL DEFAULT 0,
        format_summary TEXT NOT NULL DEFAULT '',
        notes TEXT NOT NULL DEFAULT '',
        updated_by TEXT NOT NULL,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Episodes table created');
    
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'Viewer',
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Users table created');
    
    // Create contestants table
    await sql`
      CREATE TABLE IF NOT EXISTS contestants (
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
        status TEXT NOT NULL DEFAULT 'Competing',
        total_score REAL DEFAULT 0,
        average_score REAL DEFAULT 0,
        episodes_participated INTEGER DEFAULT 0,
        golden_mics_received INTEGER DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Contestants table created');
    
    // Create contestant_scores table
    await sql`
      CREATE TABLE IF NOT EXISTS contestant_scores (
        id TEXT PRIMARY KEY,
        contestant_id TEXT NOT NULL,
        episode_id TEXT NOT NULL,
        judge_name TEXT NOT NULL,
        score REAL NOT NULL,
        remarks TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Contestant scores table created');
    
    // Create contestant_episodes table
    await sql`
      CREATE TABLE IF NOT EXISTS contestant_episodes (
        id TEXT PRIMARY KEY,
        contestant_id TEXT NOT NULL,
        episode_id TEXT NOT NULL,
        performance_order INTEGER,
        song_title TEXT,
        performance_notes TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Contestant episodes table created');
    
    // Create indexes for better performance
    await sql`CREATE INDEX IF NOT EXISTS idx_contestant_scores_contestant_id ON contestant_scores(contestant_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_contestant_scores_episode_id ON contestant_scores(episode_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_contestant_episodes_contestant_id ON contestant_episodes(contestant_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_contestant_episodes_episode_id ON contestant_episodes(episode_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_episodes_phase_city ON episodes(phase, city)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_episodes_episode_no ON episodes(episode_no)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_contestants_status ON contestants(status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_contestants_city ON contestants(city)`;
    console.log('✅ Database indexes created');
    
    await sql.end();
    console.log('🎉 Database migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:');
    console.error(error.message);
    process.exit(1);
  }
}

migrateDatabase();

const Database = require('better-sqlite3');
const fs = require('fs');

console.log('🗄️  Initializing database...');

// Create database
const db = new Database('./sqlite.db');

// Create tables
db.exec(`
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
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Viewer',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

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
  );

  CREATE TABLE IF NOT EXISTS contestant_scores (
    id TEXT PRIMARY KEY,
    contestant_id TEXT NOT NULL,
    episode_id TEXT NOT NULL,
    judge_name TEXT NOT NULL,
    score REAL NOT NULL,
    remarks TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contestant_id) REFERENCES contestants (id),
    FOREIGN KEY (episode_id) REFERENCES episodes (episode_id)
  );

  CREATE TABLE IF NOT EXISTS contestant_episodes (
    id TEXT PRIMARY KEY,
    contestant_id TEXT NOT NULL,
    episode_id TEXT NOT NULL,
    performance_order INTEGER,
    song_title TEXT,
    performance_notes TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contestant_id) REFERENCES contestants (id),
    FOREIGN KEY (episode_id) REFERENCES episodes (episode_id)
  );
`);

console.log('✅ Database initialized successfully!');
db.close();

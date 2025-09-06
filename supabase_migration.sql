-- Migration to fix database schema for Pakistan Idol Dashboard
-- This will recreate all tables with the correct structure

-- Drop existing tables (be careful - this will delete data!)
DROP TABLE IF EXISTS contestant_scores CASCADE;
DROP TABLE IF EXISTS contestant_episodes CASCADE;
DROP TABLE IF EXISTS contestants CASCADE;
DROP TABLE IF EXISTS episodes CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Recreate with correct structure
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'Viewer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE episodes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  episode_number INTEGER NOT NULL,
  air_date DATE,
  recording_date DATE,
  status TEXT NOT NULL DEFAULT 'planned',
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by TEXT
);

CREATE TABLE contestants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER,
  city TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  golden_mics_received INTEGER DEFAULT 0,
  average_score DECIMAL(3,1),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE contestant_scores (
  id TEXT PRIMARY KEY,
  contestant_id TEXT NOT NULL,
  episode_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  judge_name TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (contestant_id) REFERENCES contestants(id),
  FOREIGN KEY (episode_id) REFERENCES episodes(id)
);

CREATE TABLE contestant_episodes (
  id TEXT PRIMARY KEY,
  contestant_id TEXT NOT NULL,
  episode_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (contestant_id) REFERENCES contestants(id),
  FOREIGN KEY (episode_id) REFERENCES episodes(id)
);

-- Insert default admin user
INSERT INTO users (id, name, email, role) VALUES 
('admin-001', 'Admin User', 'admin@pakistanidol.com', 'Editor');

-- Insert sample episodes
INSERT INTO episodes (id, title, episode_number, air_date, recording_date, status, description) VALUES 
('ep-001', 'Audition Round 1', 1, '2025-01-15', '2025-01-10', 'completed', 'First round of auditions'),
('ep-002', 'Audition Round 2', 2, '2025-01-22', '2025-01-17', 'completed', 'Second round of auditions'),
('ep-003', 'Battle Round 1', 3, '2025-01-29', '2025-01-24', 'planned', 'First battle round');

-- Insert sample contestants
INSERT INTO contestants (id, name, age, city, status, golden_mics_received, average_score) VALUES 
('cont-001', 'Ahmed Ali', 25, 'Karachi', 'active', 1, 8.5),
('cont-002', 'Fatima Khan', 22, 'Lahore', 'active', 0, 7.8),
('cont-003', 'Hassan Sheikh', 28, 'Islamabad', 'active', 2, 9.2),
('cont-004', 'Ayesha Malik', 24, 'Karachi', 'active', 1, 8.9),
('cont-005', 'Omar Farooq', 26, 'Lahore', 'active', 0, 7.5);

-- Insert sample contestant-episode relationships
INSERT INTO contestant_episodes (id, contestant_id, episode_id) VALUES 
('ce-001', 'cont-001', 'ep-001'),
('ce-002', 'cont-002', 'ep-001'),
('ce-003', 'cont-003', 'ep-001'),
('ce-004', 'cont-004', 'ep-001'),
('ce-005', 'cont-005', 'ep-001'),
('ce-006', 'cont-001', 'ep-002'),
('ce-007', 'cont-002', 'ep-002'),
('ce-008', 'cont-003', 'ep-002'),
('ce-009', 'cont-004', 'ep-002'),
('ce-010', 'cont-005', 'ep-002');

-- Insert sample scores
INSERT INTO contestant_scores (id, contestant_id, episode_id, score, judge_name) VALUES 
('score-001', 'cont-001', 'ep-001', 8, 'Judge 1'),
('score-002', 'cont-001', 'ep-001', 9, 'Judge 2'),
('score-003', 'cont-001', 'ep-001', 8, 'Judge 3'),
('score-004', 'cont-002', 'ep-001', 7, 'Judge 1'),
('score-005', 'cont-002', 'ep-001', 8, 'Judge 2'),
('score-006', 'cont-002', 'ep-001', 8, 'Judge 3'),
('score-007', 'cont-003', 'ep-001', 9, 'Judge 1'),
('score-008', 'cont-003', 'ep-001', 9, 'Judge 2'),
('score-009', 'cont-003', 'ep-001', 10, 'Judge 3');

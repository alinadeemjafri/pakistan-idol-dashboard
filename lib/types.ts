export type EpisodeStatus = 'Planned' | 'Recording' | 'Recorded' | 'Airing' | 'Aired';

export type UserRole = 'Editor' | 'Viewer';

export interface Episode {
  episode_id: string;
  episode_no: number;
  phase: string;
  city: string;
  week: string | null;
  
  // Recording
  record_start: string; // ISO string
  record_end: string; // ISO string
  record_venue: string;
  
  // Airing
  air_start: string; // ISO string
  air_end: string; // ISO string
  channel: string;
  
  // Format
  performances_planned: number;
  performances_locked: number;
  golden_mics_available: number;
  golden_mics_used: number;
  voting_enabled: boolean;
  
  format_summary: string;
  notes: string;
  
  updated_by: string;
  updated_at: string; // ISO string
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  created_at: string;
}

export interface EpisodeFormData {
  episode_no: number;
  phase: string;
  city: string;
  week?: string;
  record_start: string;
  record_end: string;
  record_venue: string;
  air_start: string;
  air_end: string;
  channel: string;
  performances_planned: number;
  performances_locked: number;
  golden_mics_available: number;
  golden_mics_used: number;
  voting_enabled: boolean;
  format_summary: string;
  notes: string;
}

export interface ExcelMapping {
  episode_no: string;
  phase: string;
  city: string;
  week: string;
  record_start: string;
  record_end: string;
  record_venue: string;
  air_start: string;
  air_end: string;
  channel: string;
  performances_planned: string;
  performances_locked: string;
  golden_mics_available: string;
  golden_mics_used: string;
  voting_enabled: string;
  format_summary: string;
  notes: string;
}

export type ContestantStatus = 'Competing' | 'Eliminated';

export interface Contestant {
  id: string;
  serial_number: number;
  name: string;
  contact: string;
  city: string;
  status: ContestantStatus;
  created_at: string;
  updated_at: string;
}

export interface ContestantScore {
  id: string;
  contestant_id: string;
  episode_id: string;
  judge_name: string;
  score: number;
  remarks: string | null;
  created_at: string;
}

export interface ContestantEpisode {
  id: string;
  contestant_id: string;
  episode_id: string;
  performance_order: number | null;
  song_title: string | null;
  performance_notes: string | null;
  created_at: string;
}

export interface ContestantFormData {
  serial_number: number;
  name: string;
  contact: string;
  city: string;
  status: ContestantStatus;
}

export interface ContestantWithScores extends Contestant {
  scores: ContestantScore[];
  episodes: ContestantEpisode[];
}

export interface JudgeScore {
  judge_name: string;
  score: number;
  remarks?: string;
}

// Re-export types from schema for compatibility
export type { Episode as NewEpisode, User as NewUser } from '@/lib/db/schema';

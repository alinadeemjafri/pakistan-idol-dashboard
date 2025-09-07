import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const episodes = sqliteTable('episodes', {
  episode_id: text('episode_id').primaryKey(),
  episode_no: integer('episode_no').notNull(),
  phase: text('phase').notNull(),
  city: text('city').notNull(),
  week: text('week'),
  
  // Recording
  record_start: text('record_start').notNull(),
  record_end: text('record_end').notNull(),
  record_venue: text('record_venue').notNull(),
  
  // Airing
  air_start: text('air_start').notNull(),
  air_end: text('air_end').notNull(),
  channel: text('channel').notNull(),
  
  // Format
  performances_planned: integer('performances_planned').notNull().default(0),
  performances_locked: integer('performances_locked').notNull().default(0),
  golden_mics_available: integer('golden_mics_available').notNull().default(0),
  golden_mics_used: integer('golden_mics_used').notNull().default(0),
  voting_enabled: integer('voting_enabled', { mode: 'boolean' }).notNull().default(false),
  
  format_summary: text('format_summary').notNull().default(''),
  notes: text('notes').notNull().default(''),
  
  updated_by: text('updated_by').notNull(),
  updated_at: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: text('role', { enum: ['Editor', 'Viewer'] }).notNull().default('Viewer'),
  created_at: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const contestants = sqliteTable('contestants', {
  id: text('id').primaryKey(),
  serial_number: integer('serial_number').notNull(),
  name: text('name').notNull(),
  contact: text('contact').notNull(),
  city: text('city').notNull(),
  status: text('status', { enum: ['Competing', 'Eliminated'] }).notNull().default('Competing'),
  created_at: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const contestant_scores = sqliteTable('contestant_scores', {
  id: text('id').primaryKey(),
  contestant_id: text('contestant_id').notNull().references(() => contestants.id),
  episode_id: text('episode_id').notNull().references(() => episodes.episode_id),
  judge_name: text('judge_name').notNull(),
  score: real('score').notNull(),
  remarks: text('remarks'),
  created_at: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const contestant_episodes = sqliteTable('contestant_episodes', {
  id: text('id').primaryKey(),
  contestant_id: text('contestant_id').notNull().references(() => contestants.id),
  episode_id: text('episode_id').notNull().references(() => episodes.episode_id),
  performance_order: integer('performance_order'),
  song_title: text('song_title'),
  performance_notes: text('performance_notes'),
  created_at: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export type Episode = typeof episodes.$inferSelect;
export type NewEpisode = typeof episodes.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Contestant = typeof contestants.$inferSelect;
export type NewContestant = typeof contestants.$inferInsert;
export type ContestantScore = typeof contestant_scores.$inferSelect;
export type NewContestantScore = typeof contestant_scores.$inferInsert;
export type ContestantEpisode = typeof contestant_episodes.$inferSelect;
export type NewContestantEpisode = typeof contestant_episodes.$inferInsert;

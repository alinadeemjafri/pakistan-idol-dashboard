import { pgTable, text, integer, real, boolean, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const episodes = pgTable('episodes', {
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
  voting_enabled: boolean('voting_enabled').notNull().default(false),
  
  format_summary: text('format_summary').notNull().default(''),
  notes: text('notes').notNull().default(''),
  
  updated_by: text('updated_by').notNull(),
  updated_at: timestamp('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: text('role', { enum: ['Editor', 'Viewer'] }).notNull().default('Viewer'),
  created_at: timestamp('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const contestants = pgTable('contestants', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  city: text('city').notNull(),
  phone: text('phone'),
  email: text('email'),
  profile_image: text('profile_image'),
  bio: text('bio'),
  audition_date: text('audition_date'),
  audition_city: text('audition_city').notNull(),
  audition_venue: text('audition_venue'),
  status: text('status', { enum: ['Competing', 'Eliminated', 'Winner', 'Runner-up'] }).notNull().default('Competing'),
  total_score: real('total_score').default(0),
  average_score: real('average_score').default(0),
  episodes_participated: integer('episodes_participated').default(0),
  golden_mics_received: integer('golden_mics_received').default(0),
  created_at: timestamp('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: timestamp('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const contestant_scores = pgTable('contestant_scores', {
  id: text('id').primaryKey(),
  contestant_id: text('contestant_id').notNull().references(() => contestants.id),
  episode_id: text('episode_id').notNull().references(() => episodes.episode_id),
  judge_name: text('judge_name').notNull(),
  score: real('score').notNull(),
  remarks: text('remarks'),
  created_at: timestamp('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const contestant_episodes = pgTable('contestant_episodes', {
  id: text('id').primaryKey(),
  contestant_id: text('contestant_id').notNull().references(() => contestants.id),
  episode_id: text('episode_id').notNull().references(() => episodes.episode_id),
  performance_order: integer('performance_order'),
  song_title: text('song_title'),
  performance_notes: text('performance_notes'),
  created_at: timestamp('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
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

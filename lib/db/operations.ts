import { db } from '@/lib/db';
import { currentEpisodes, currentUsers } from '@/lib/db/schema';
import { currentEpisodes as pgEpisodes, currentUsers as pgUsers } from '@/lib/db/schema-postgres';

// Use the correct schema based on environment
const isProduction = process.env.NODE_ENV === 'production' && (process.env.DATABASE_URL || process.env.DB_POSTGRES_URL);
const currentEpisodes = isProduction ? pgEpisodes : currentEpisodes;
const currentUsers = isProduction ? pgUsers : currentUsers;
import { eq, desc, asc, and, gte, lte, like, or } from 'drizzle-orm';
import { Episode, NewEpisode, User, NewUser, EpisodeFormData } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

// Episode operations
export async function getAllEpisodes(): Promise<Episode[]> {
  return await db.select().from(currentEpisodes).orderBy(asc(currentEpisodes.episode_no));
}

export async function getEpisodeById(id: string): Promise<Episode | null> {
  const result = await db.select().from(currentEpisodes).where(eq(currentEpisodes.episode_id, id)).limit(1);
  return result[0] || null;
}

export async function createEpisode(data: EpisodeFormData, updatedBy: string): Promise<Episode> {
  const episodeId = uuidv4();
  const now = new Date().toISOString();
  
  const newEpisode: NewEpisode = {
    episode_id: episodeId,
    episode_no: data.episode_no,
    phase: data.phase,
    city: data.city,
    week: data.week || null,
    record_start: data.record_start,
    record_end: data.record_end,
    record_venue: data.record_venue,
    air_start: data.air_start,
    air_end: data.air_end,
    channel: data.channel,
    performances_planned: data.performances_planned,
    performances_locked: data.performances_locked,
    golden_mics_available: data.golden_mics_available,
    golden_mics_used: data.golden_mics_used,
    voting_enabled: data.voting_enabled,
    format_summary: data.format_summary,
    notes: data.notes,
    updated_by: updatedBy,
    updated_at: now,
  };

  await db.insert(currentEpisodes).values(newEpisode);
  return await getEpisodeById(episodeId) as Episode;
}

export async function updateEpisode(id: string, data: Partial<EpisodeFormData>, updatedBy: string): Promise<Episode> {
  const now = new Date().toISOString();
  
  await db.update(currentEpisodes)
    .set({
      ...data,
      updated_by: updatedBy,
      updated_at: now,
    })
    .where(eq(currentEpisodes.episode_id, id));

  return await getEpisodeById(id) as Episode;
}

export async function deleteEpisode(id: string): Promise<void> {
  await db.delete(currentEpisodes).where(eq(currentEpisodes.episode_id, id));
}

// Search and filter operations
export async function searchEpisodes(query: string): Promise<Episode[]> {
  const searchTerm = `%${query}%`;
  return await db.select()
    .from(currentEpisodes)
    .where(
      or(
        like(currentEpisodes.phase, searchTerm),
        like(currentEpisodes.city, searchTerm),
        like(currentEpisodes.format_summary, searchTerm),
        like(currentEpisodes.notes, searchTerm)
      )
    )
    .orderBy(asc(currentEpisodes.episode_no));
}

export async function getEpisodesByCity(city: string): Promise<Episode[]> {
  return await db.select()
    .from(currentEpisodes)
    .where(eq(currentEpisodes.city, city))
    .orderBy(asc(currentEpisodes.episode_no));
}

export async function getEpisodesByPhase(phase: string): Promise<Episode[]> {
  return await db.select()
    .from(currentEpisodes)
    .where(eq(currentEpisodes.phase, phase))
    .orderBy(asc(currentEpisodes.episode_no));
}

export async function getEpisodesByDateRange(startDate: string, endDate: string): Promise<Episode[]> {
  return await db.select()
    .from(currentEpisodes)
    .where(
      and(
        gte(currentEpisodes.record_start, startDate),
        lte(currentEpisodes.record_start, endDate)
      )
    )
    .orderBy(asc(currentEpisodes.record_start));
}

export async function getTodayEpisodes(): Promise<Episode[]> {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();
  
  return await db.select()
    .from(currentEpisodes)
    .where(
      or(
        and(
          gte(currentEpisodes.record_start, startOfDay),
          lte(currentEpisodes.record_start, endOfDay)
        ),
        and(
          gte(currentEpisodes.air_start, startOfDay),
          lte(currentEpisodes.air_start, endOfDay)
        )
      )
    )
    .orderBy(asc(currentEpisodes.record_start));
}

export async function getNextRecording(): Promise<Episode | null> {
  const now = new Date().toISOString();
  
  const result = await db.select()
    .from(currentEpisodes)
    .where(gte(currentEpisodes.record_start, now))
    .orderBy(asc(currentEpisodes.record_start))
    .limit(1);
    
  return result[0] || null;
}

export async function getNextAiring(): Promise<Episode | null> {
  const now = new Date().toISOString();
  
  const result = await db.select()
    .from(currentEpisodes)
    .where(gte(currentEpisodes.air_start, now))
    .orderBy(asc(currentEpisodes.air_start))
    .limit(1);
    
  return result[0] || null;
}

export async function getCurrentlyRecording(): Promise<Episode[]> {
  const now = new Date().toISOString();
  
  return await db.select()
    .from(currentEpisodes)
    .where(
      and(
        lte(currentEpisodes.record_start, now),
        gte(currentEpisodes.record_end, now)
      )
    )
    .orderBy(asc(currentEpisodes.record_start));
}

export async function getCurrentlyAiring(): Promise<Episode[]> {
  const now = new Date().toISOString();
  
  return await db.select()
    .from(currentEpisodes)
    .where(
      and(
        lte(currentEpisodes.air_start, now),
        gte(currentEpisodes.air_end, now)
      )
    )
    .orderBy(asc(currentEpisodes.air_start));
}

// User operations
export async function getAllUsers(): Promise<User[]> {
  return await db.select().from(currentUsers).orderBy(asc(currentUsers.name));
}

export async function getUserById(id: string): Promise<User | null> {
  const result = await db.select().from(currentUsers).where(eq(currentUsers.id, id)).limit(1);
  return result[0] || null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await db.select().from(currentUsers).where(eq(currentUsers.email, email)).limit(1);
  return result[0] || null;
}

export async function createUser(data: { email: string; name: string; role: 'Editor' | 'Viewer' }): Promise<User> {
  const userId = uuidv4();
  const now = new Date().toISOString();
  
  const newUser: NewUser = {
    id: userId,
    email: data.email,
    name: data.name,
    role: data.role,
    created_at: now,
  };

  await db.insert(currentUsers).values(newUser);
  return await getUserById(userId) as User;
}

export async function updateUserRole(id: string, role: 'Editor' | 'Viewer'): Promise<User> {
  await db.update(currentUsers)
    .set({ role })
    .where(eq(currentUsers.id, id));

  return await getUserById(id) as User;
}

export async function deleteUser(id: string): Promise<void> {
  await db.delete(currentUsers).where(eq(currentUsers.id, id));
}

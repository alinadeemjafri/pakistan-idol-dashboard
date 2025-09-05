import { db, contestants, contestant_scores, contestant_episodes, episodes } from '@/lib/db';
import { eq, desc, asc, and, like, or, sql, gte } from 'drizzle-orm';
import { Contestant, ContestantScore, ContestantEpisode, ContestantFormData, ContestantWithScores } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

// Contestant operations
export async function getAllContestants(): Promise<Contestant[]> {
  return await db.select().from(contestants).orderBy(asc(contestants.name));
}

export async function getContestantById(id: string): Promise<Contestant | null> {
  const result = await db.select().from(contestants).where(eq(contestants.id, id)).limit(1);
  return result[0] || null;
}

export async function getContestantWithScores(id: string): Promise<ContestantWithScores | null> {
  const contestant = await getContestantById(id);
  if (!contestant) return null;

  const scores = await db.select().from(contestant_scores).where(eq(contestant_scores.contestant_id, id));
  const contestantEpisodes = await db.select().from(contestant_episodes).where(eq(contestant_episodes.contestant_id, id));

  return {
    ...contestant,
    scores,
    episodes: contestantEpisodes,
  };
}

export async function createContestant(data: ContestantFormData): Promise<Contestant> {
  const contestantId = uuidv4();
  const now = new Date().toISOString();
  
  const newContestant = {
    id: contestantId,
    name: data.name,
    age: data.age,
    city: data.city,
    phone: data.phone || null,
    email: data.email || null,
    profile_image: data.profile_image || null,
    bio: data.bio || null,
    audition_date: data.audition_date || null,
    audition_city: data.audition_city,
    audition_venue: data.audition_venue || null,
    status: data.status,
    total_score: 0,
    average_score: 0,
    episodes_participated: 0,
    golden_mics_received: 0,
    created_at: now,
    updated_at: now,
  };

  await db.insert(contestants).values(newContestant);
  return await getContestantById(contestantId) as Contestant;
}

export async function updateContestant(id: string, data: Partial<ContestantFormData>): Promise<Contestant> {
  const now = new Date().toISOString();
  
  await db.update(contestants)
    .set({
      ...data,
      updated_at: now,
    })
    .where(eq(contestants.id, id));

  return await getContestantById(id) as Contestant;
}

export async function deleteContestant(id: string): Promise<void> {
  // Delete related scores and episodes first
  await db.delete(contestant_scores).where(eq(contestant_scores.contestant_id, id));
  await db.delete(contestant_episodes).where(eq(contestant_episodes.contestant_id, id));
  await db.delete(contestants).where(eq(contestants.id, id));
}

// Search and filter operations
export async function searchContestants(query: string): Promise<Contestant[]> {
  const searchTerm = `%${query}%`;
  return await db.select()
    .from(contestants)
    .where(
      or(
        like(contestants.name, searchTerm),
        like(contestants.city, searchTerm),
        like(contestants.audition_city, searchTerm),
        like(contestants.bio, searchTerm)
      )
    )
    .orderBy(asc(contestants.name));
}

export async function getContestantsByCity(city: string): Promise<Contestant[]> {
  return await db.select()
    .from(contestants)
    .where(eq(contestants.city, city))
    .orderBy(asc(contestants.name));
}

export async function getContestantsByStatus(status: string): Promise<Contestant[]> {
  return await db.select()
    .from(contestants)
    .where(eq(contestants.status, status))
    .orderBy(asc(contestants.name));
}

export async function getContestantsByAuditionCity(auditionCity: string): Promise<Contestant[]> {
  return await db.select()
    .from(contestants)
    .where(eq(contestants.audition_city, auditionCity))
    .orderBy(asc(contestants.name));
}

// Score operations
export async function addContestantScore(
  contestantId: string,
  episodeId: string,
  judgeName: string,
  score: number,
  remarks?: string
): Promise<ContestantScore> {
  const scoreId = uuidv4();
  const now = new Date().toISOString();
  
  const newScore = {
    id: scoreId,
    contestant_id: contestantId,
    episode_id: episodeId,
    judge_name: judgeName,
    score,
    remarks: remarks || null,
    created_at: now,
  };

  await db.insert(contestant_scores).values(newScore);
  
  // Update contestant's total and average scores
  await updateContestantScores(contestantId);
  
  return newScore;
}

export async function getContestantScores(contestantId: string): Promise<ContestantScore[]> {
  return await db.select()
    .from(contestant_scores)
    .where(eq(contestant_scores.contestant_id, contestantId))
    .orderBy(desc(contestant_scores.created_at));
}

export async function getContestantScoresByEpisode(contestantId: string, episodeId: string): Promise<ContestantScore[]> {
  return await db.select()
    .from(contestant_scores)
    .where(
      and(
        eq(contestant_scores.contestant_id, contestantId),
        eq(contestant_scores.episode_id, episodeId)
      )
    )
    .orderBy(asc(contestant_scores.judge_name));
}

async function updateContestantScores(contestantId: string): Promise<void> {
  const scores = await getContestantScores(contestantId);
  const totalScore = scores.reduce((sum, score) => sum + score.score, 0);
  const averageScore = scores.length > 0 ? totalScore / scores.length : 0;
  
  await db.update(contestants)
    .set({
      total_score: totalScore,
      average_score: averageScore,
      episodes_participated: scores.length,
      updated_at: new Date().toISOString(),
    })
    .where(eq(contestants.id, contestantId));
}

// Episode participation operations
export async function addContestantToEpisode(
  contestantId: string,
  episodeId: string,
  performanceOrder?: number,
  songTitle?: string,
  performanceNotes?: string
): Promise<ContestantEpisode> {
  const id = uuidv4();
  const now = new Date().toISOString();
  
  const newContestantEpisode = {
    id,
    contestant_id: contestantId,
    episode_id: episodeId,
    performance_order: performanceOrder || null,
    song_title: songTitle || null,
    performance_notes: performanceNotes || null,
    created_at: now,
  };

  await db.insert(contestant_episodes).values(newContestantEpisode);
  return newContestantEpisode;
}

export async function getContestantEpisodes(contestantId: string): Promise<ContestantEpisode[]> {
  return await db.select()
    .from(contestant_episodes)
    .where(eq(contestant_episodes.contestant_id, contestantId))
    .orderBy(asc(contestant_episodes.performance_order));
}

export async function getEpisodeContestants(episodeId: string): Promise<ContestantEpisode[]> {
  return await db.select()
    .from(contestant_episodes)
    .where(eq(contestant_episodes.episode_id, episodeId))
    .orderBy(asc(contestant_episodes.performance_order));
}

// Statistics operations
export async function getContestantStats(): Promise<{
  total: number;
  competing: number;
  eliminated: number;
  winners: number;
  byCity: Record<string, number>;
  byAuditionCity: Record<string, number>;
}> {
  const allContestants = await getAllContestants();
  
  const stats = {
    total: allContestants.length,
    competing: allContestants.filter(c => c.status === 'Competing').length,
    eliminated: allContestants.filter(c => c.status === 'Eliminated').length,
    winners: allContestants.filter(c => c.status === 'Winner' || c.status === 'Runner-up').length,
    byCity: {} as Record<string, number>,
    byAuditionCity: {} as Record<string, number>,
  };

  // Count by city
  allContestants.forEach(contestant => {
    stats.byCity[contestant.city] = (stats.byCity[contestant.city] || 0) + 1;
    stats.byAuditionCity[contestant.audition_city] = (stats.byAuditionCity[contestant.audition_city] || 0) + 1;
  });

  return stats;
}

export async function getRecentlyEliminated(): Promise<Contestant[]> {
  // Get contestants eliminated in the last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  return await db.select()
    .from(contestants)
    .where(
      and(
        eq(contestants.status, 'Eliminated'),
        gte(contestants.updated_at, sevenDaysAgo.toISOString())
      )
    )
    .orderBy(desc(contestants.updated_at))
    .limit(5);
}

export async function getTopPerformers(): Promise<Contestant[]> {
  return await db.select()
    .from(contestants)
    .where(eq(contestants.status, 'Competing'))
    .orderBy(desc(contestants.average_score))
    .limit(5);
}

export async function getContestantProgress(): Promise<{
  totalCompeting: number;
  totalEliminated: number;
  eliminationRate: number;
  averageScore: number;
  topCity: string;
}> {
  const allContestants = await getAllContestants();
  const competing = allContestants.filter(c => c.status === 'Competing');
  const eliminated = allContestants.filter(c => c.status === 'Eliminated');
  
  const totalCompeting = competing.length;
  const totalEliminated = eliminated.length;
  const eliminationRate = totalCompeting > 0 ? (totalEliminated / (totalCompeting + totalEliminated)) * 100 : 0;
  
  const averageScore = competing.length > 0 
    ? competing.reduce((sum, c) => sum + (c.average_score || 0), 0) / competing.length 
    : 0;
  
  // Find top city by number of competing contestants
  const cityCounts = competing.reduce((acc, c) => {
    acc[c.city] = (acc[c.city] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topCity = Object.entries(cityCounts).reduce((max, [city, count]) => 
    count > (cityCounts[max] || 0) ? city : max, 'N/A'
  );
  
  return {
    totalCompeting,
    totalEliminated,
    eliminationRate,
    averageScore,
    topCity
  };
}

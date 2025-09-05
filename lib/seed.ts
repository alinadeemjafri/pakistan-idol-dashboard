import { db, episodes, users, contestants, contestant_scores, contestant_episodes } from '@/lib/db';
import { sampleEpisodes, sampleUsers, sampleContestants, sampleContestantScores, sampleContestantEpisodes } from '@/lib/sample-data';
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';

export async function seedDatabase() {
  try {
    console.log('Starting database seed...');

    // Clear existing data
    await db.delete(contestant_scores);
    await db.delete(contestant_episodes);
    await db.delete(contestants);
    await db.delete(episodes);
    await db.delete(users);

    // Seed users
    console.log('Seeding users...');
    for (const userData of sampleUsers) {
      const userId = uuidv4();
      const now = new Date().toISOString();
      
      await db.insert(users).values({
        id: userId,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        created_at: now,
      });
    }

    // Seed episodes
    console.log('Seeding episodes...');
    for (const episodeData of sampleEpisodes) {
      const episodeId = uuidv4();
      const now = new Date().toISOString();
      
      await db.insert(episodes).values({
        episode_id: episodeId,
        episode_no: episodeData.episode_no,
        phase: episodeData.phase,
        city: episodeData.city,
        week: episodeData.week || null,
        record_start: episodeData.record_start,
        record_end: episodeData.record_end,
        record_venue: episodeData.record_venue,
        air_start: episodeData.air_start,
        air_end: episodeData.air_end,
        channel: episodeData.channel,
        performances_planned: episodeData.performances_planned,
        performances_locked: episodeData.performances_locked,
        golden_mics_available: episodeData.golden_mics_available,
        golden_mics_used: episodeData.golden_mics_used,
        voting_enabled: episodeData.voting_enabled,
        format_summary: episodeData.format_summary,
        notes: episodeData.notes,
        updated_by: 'System',
        updated_at: now,
      });
    }

    // Seed contestants
    console.log('Seeding contestants...');
    const contestantMap = new Map();
    
    for (const contestantData of sampleContestants) {
      const contestantId = uuidv4();
      const now = new Date().toISOString();
      
      await db.insert(contestants).values({
        id: contestantId,
        name: contestantData.name,
        age: contestantData.age,
        city: contestantData.city,
        phone: contestantData.phone || null,
        email: contestantData.email || null,
        profile_image: null,
        bio: contestantData.bio || null,
        audition_date: contestantData.audition_date || null,
        audition_city: contestantData.audition_city,
        audition_venue: contestantData.audition_venue || null,
        status: contestantData.status,
        total_score: 0,
        average_score: 0,
        episodes_participated: 0,
        golden_mics_received: 0,
        created_at: now,
        updated_at: now,
      });
      
      contestantMap.set(contestantData.name, contestantId);
    }

    // Seed contestant episodes
    console.log('Seeding contestant episodes...');
    for (const episodeData of sampleContestantEpisodes) {
      const contestantId = contestantMap.get(episodeData.contestant_name);
      if (contestantId) {
        const episodeId = uuidv4();
        const now = new Date().toISOString();
        
        // Find episode by episode number
        const episode = await db.select().from(episodes).where(eq(episodes.episode_no, episodeData.episode_no)).limit(1);
        if (episode.length > 0) {
          await db.insert(contestant_episodes).values({
            id: episodeId,
            contestant_id: contestantId,
            episode_id: episode[0].episode_id,
            performance_order: episodeData.performance_order || null,
            song_title: episodeData.song_title || null,
            performance_notes: episodeData.performance_notes || null,
            created_at: now,
          });
        }
      }
    }

    // Seed contestant scores
    console.log('Seeding contestant scores...');
    for (const scoreData of sampleContestantScores) {
      const contestantId = contestantMap.get(scoreData.contestant_name);
      if (contestantId) {
        const scoreId = uuidv4();
        const now = new Date().toISOString();
        
        // Find episode by episode number
        const episode = await db.select().from(episodes).where(eq(episodes.episode_no, scoreData.episode_no)).limit(1);
        if (episode.length > 0) {
          await db.insert(contestant_scores).values({
            id: scoreId,
            contestant_id: contestantId,
            episode_id: episode[0].episode_id,
            judge_name: scoreData.judge_name,
            score: scoreData.score,
            remarks: scoreData.remarks || null,
            created_at: now,
          });
        }
      }
    }

    // Update contestant statistics
    console.log('Updating contestant statistics...');
    for (const [contestantName, contestantId] of contestantMap) {
      const scores = await db.select().from(contestant_scores).where(eq(contestant_scores.contestant_id, contestantId));
      const episodes = await db.select().from(contestant_episodes).where(eq(contestant_episodes.contestant_id, contestantId));
      
      const totalScore = scores.reduce((sum, score) => sum + score.score, 0);
      const averageScore = scores.length > 0 ? totalScore / scores.length : 0;
      const episodesParticipated = episodes.length;
      
      await db.update(contestants)
        .set({
          total_score: totalScore,
          average_score: averageScore,
          episodes_participated: episodesParticipated,
          updated_at: new Date().toISOString(),
        })
        .where(eq(contestants.id, contestantId));
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seed completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seed failed:', error);
      process.exit(1);
    });
}

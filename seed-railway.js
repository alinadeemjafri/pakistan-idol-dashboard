// Seed script for Railway PostgreSQL database
// Run this with: node seed-railway.js

const postgres = require('postgres');
const { v4: uuidv4 } = require('uuid');

async function seedDatabase() {
  const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:password@host:port/database';
  
  console.log('Starting database seeding...');
  
  try {
    const sql = postgres(DATABASE_URL);
    
    // Clear existing data
    await sql`DELETE FROM contestant_scores`;
    await sql`DELETE FROM contestant_episodes`;
    await sql`DELETE FROM contestants`;
    await sql`DELETE FROM episodes`;
    await sql`DELETE FROM users`;
    console.log('✅ Cleared existing data');
    
    // Seed users
    const users = [
      { id: uuidv4(), email: 'admin@pakistanidol.com', name: 'Admin User', role: 'Editor' },
      { id: uuidv4(), email: 'viewer@pakistanidol.com', name: 'Viewer User', role: 'Viewer' }
    ];
    
    for (const user of users) {
      await sql`
        INSERT INTO users (id, email, name, role, created_at)
        VALUES (${user.id}, ${user.email}, ${user.name}, ${user.role}, ${new Date().toISOString()})
      `;
    }
    console.log('✅ Users seeded');
    
    // Seed episodes
    const episodes = [
      {
        episode_id: uuidv4(),
        episode_no: 1,
        phase: 'Judges',
        city: 'Karachi',
        week: '1',
        record_start: '2025-09-15T10:00:00+05:00',
        record_end: '2025-09-15T18:00:00+05:00',
        record_venue: 'Karachi Arts Council',
        air_start: '2025-09-20T20:00:00+05:00',
        air_end: '2025-09-20T22:00:00+05:00',
        channel: 'ARY Digital',
        performances_planned: 20,
        performances_locked: 15,
        golden_mics_available: 3,
        golden_mics_used: 1,
        voting_enabled: 1,
        format_summary: 'Initial auditions with celebrity judges',
        notes: 'First episode of the season. High expectations from audience.',
        updated_by: 'System'
      },
      {
        episode_id: uuidv4(),
        episode_no: 2,
        phase: 'Judges',
        city: 'Lahore',
        week: '1',
        record_start: '2025-09-16T10:00:00+05:00',
        record_end: '2025-09-16T18:00:00+05:00',
        record_venue: 'Alhamra Arts Council',
        air_start: '2025-09-21T20:00:00+05:00',
        air_end: '2025-09-21T22:00:00+05:00',
        channel: 'ARY Digital',
        performances_planned: 18,
        performances_locked: 18,
        golden_mics_available: 3,
        golden_mics_used: 2,
        voting_enabled: 1,
        format_summary: 'Lahore auditions with special guest judge',
        notes: 'All performances locked. Ready for airing.',
        updated_by: 'System'
      }
    ];
    
    for (const episode of episodes) {
      await sql`
        INSERT INTO episodes (
          episode_id, episode_no, phase, city, week, record_start, record_end,
          record_venue, air_start, air_end, channel, performances_planned,
          performances_locked, golden_mics_available, golden_mics_used,
          voting_enabled, format_summary, notes, updated_by, updated_at
        ) VALUES (
          ${episode.episode_id}, ${episode.episode_no}, ${episode.phase}, ${episode.city},
          ${episode.week}, ${episode.record_start}, ${episode.record_end}, ${episode.record_venue},
          ${episode.air_start}, ${episode.air_end}, ${episode.channel}, ${episode.performances_planned},
          ${episode.performances_locked}, ${episode.golden_mics_available}, ${episode.golden_mics_used},
          ${episode.voting_enabled}, ${episode.format_summary}, ${episode.notes}, ${episode.updated_by},
          ${new Date().toISOString()}
        )
      `;
    }
    console.log('✅ Episodes seeded');
    
    // Seed contestants
    const contestants = [
      {
        id: uuidv4(),
        name: 'Ayesha Khan',
        age: 22,
        city: 'Karachi',
        phone: '+92-300-1234567',
        email: 'ayesha.khan@email.com',
        bio: 'Classical singer with 5 years of training. Specializes in ghazals and classical music.',
        audition_date: '2024-12-10T10:00:00+05:00',
        audition_city: 'Karachi',
        audition_venue: 'Karachi Arts Council',
        status: 'Competing'
      },
      {
        id: uuidv4(),
        name: 'Hassan Ali',
        age: 25,
        city: 'Lahore',
        phone: '+92-300-2345678',
        email: 'hassan.ali@email.com',
        bio: 'Pop singer and guitarist. Performs contemporary Pakistani and international songs.',
        audition_date: '2024-12-11T14:00:00+05:00',
        audition_city: 'Lahore',
        audition_venue: 'Alhamra Arts Council',
        status: 'Competing'
      }
    ];
    
    for (const contestant of contestants) {
      await sql`
        INSERT INTO contestants (
          id, name, age, city, phone, email, bio, audition_date,
          audition_city, audition_venue, status, created_at, updated_at
        ) VALUES (
          ${contestant.id}, ${contestant.name}, ${contestant.age}, ${contestant.city},
          ${contestant.phone}, ${contestant.email}, ${contestant.bio}, ${contestant.audition_date},
          ${contestant.audition_city}, ${contestant.audition_venue}, ${contestant.status},
          ${new Date().toISOString()}, ${new Date().toISOString()}
        )
      `;
    }
    console.log('✅ Contestants seeded');
    
    await sql.end();
    console.log('🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Seeding failed:');
    console.error(error.message);
    process.exit(1);
  }
}

seedDatabase();

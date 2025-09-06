import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    console.log('Testing database connection and schema...');
    
    // Test 1: Check if tables exist
    const tablesResult = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    // Test 2: Check episodes table structure
    let episodesStructure = null;
    try {
      episodesStructure = await db.execute(sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'episodes'
      `);
    } catch (error) {
      episodesStructure = { error: error.message };
    }
    
    // Test 3: Check users table
    let usersResult = null;
    try {
      usersResult = await db.execute(sql`SELECT * FROM users LIMIT 5`);
    } catch (error) {
      usersResult = { error: error.message };
    }
    
    // Test 4: Check episodes table
    let episodesResult = null;
    try {
      episodesResult = await db.execute(sql`SELECT * FROM episodes LIMIT 5`);
    } catch (error) {
      episodesResult = { error: error.message };
    }
    
    return NextResponse.json({
      success: true,
      tables: tablesResult,
      episodesStructure: episodesStructure,
      users: usersResult,
      episodes: episodesResult
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

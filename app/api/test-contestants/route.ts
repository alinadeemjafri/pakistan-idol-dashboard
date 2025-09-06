import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    console.log('Testing contestants table...');
    
    // Test 1: Check if contestants table exists and its structure
    const tableInfo = await db.execute(sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'contestants'
      ORDER BY ordinal_position
    `);
    
    // Test 2: Try to select from contestants table
    let contestants = null;
    try {
      contestants = await db.execute(sql`SELECT * FROM contestants LIMIT 5`);
    } catch (error) {
      contestants = { error: error instanceof Error ? error.message : 'Unknown error' };
    }
    
    // Test 3: Check if we can select specific columns
    let specificColumns = null;
    try {
      specificColumns = await db.execute(sql`
        SELECT id, name, city, audition_city, status, profile_image 
        FROM contestants 
        LIMIT 3
      `);
    } catch (error) {
      specificColumns = { error: error instanceof Error ? error.message : 'Unknown error' };
    }
    
    return NextResponse.json({
      success: true,
      tableInfo: tableInfo,
      contestants: contestants,
      specificColumns: specificColumns
    });
  } catch (error) {
    console.error('Contestants test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

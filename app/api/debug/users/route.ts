import { NextResponse } from 'next/server';
import { db, users } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    console.log('Checking users in database...');
    
    // Get all users
    const allUsers = await db.select().from(users);
    console.log('All users found:', allUsers);
    
    // Check specifically for admin user
    const adminUser = await db.select().from(users).where(eq(users.email, 'admin@pakistanidol.com'));
    console.log('Admin user found:', adminUser);
    
    return NextResponse.json({
      success: true,
      totalUsers: allUsers.length,
      allUsers: allUsers,
      adminUser: adminUser[0] || null
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { db, users } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export async function POST() {
  try {
    // Check if admin user exists
    const existingUser = await db.select().from(users).where(eq(users.email, 'admin@pakistanidol.com')).limit(1);
    
    if (existingUser.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'Admin user already exists',
        user: existingUser[0]
      });
    }

    // Create admin user
    const adminUser = {
      id: uuidv4(),
      email: 'admin@pakistanidol.com',
      name: 'Admin User',
      role: 'Editor' as const,
      created_at: new Date().toISOString()
    };

    await db.insert(users).values(adminUser);

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      user: adminUser
    });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

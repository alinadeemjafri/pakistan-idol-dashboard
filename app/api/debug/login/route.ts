import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/db/operations';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    console.log('Testing login for email:', email);
    
    if (!email) {
      return NextResponse.json({
        success: false,
        error: 'Email is required'
      }, { status: 400 });
    }

    console.log('Calling getUserByEmail...');
    const user = await getUserByEmail(email);
    console.log('getUserByEmail result:', user);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found',
        email: email
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }
    });
  } catch (error) {
    console.error('Debug login error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}

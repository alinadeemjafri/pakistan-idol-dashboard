import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/db/operations';

export async function POST(request: NextRequest) {
  try {
    const { name, email, role } = await request.json();
    
    if (!name || !email || !role) {
      return NextResponse.json(
        { error: 'Name, email, and role are required' },
        { status: 400 }
      );
    }

    if (!['Editor', 'Viewer'].includes(role)) {
      return NextResponse.json(
        { error: 'Role must be either Editor or Viewer' },
        { status: 400 }
      );
    }

    const user = await createUser({ name, email, role });
    
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
    console.error('Create user error:', error);
    
    if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

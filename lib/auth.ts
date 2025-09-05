import { cookies } from 'next/headers';
import { db, users } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { UserRole } from '@/lib/types';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = cookies();
  const userId = cookieStore.get('user_id')?.value;
  
  if (!userId) {
    return null;
  }

  try {
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    return user[0] || null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

export async function requireEditor(): Promise<AuthUser> {
  const user = await requireAuth();
  if (user.role !== 'Editor') {
    throw new Error('Editor access required');
  }
  return user;
}

export function isEditor(user: AuthUser | null): boolean {
  return user?.role === 'Editor';
}

export function isViewer(user: AuthUser | null): boolean {
  return user?.role === 'Viewer';
}

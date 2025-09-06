import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { getCurrentUser, requireEditor } from '@/lib/auth';
import { getAllUsers } from '@/lib/db/operations';
import { AdminPanel } from '@/components/admin/AdminPanel';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'Editor') {
    redirect('/');
  }

  const users = await getAllUsers();

  return (
    <Layout user={user}>
      <AdminPanel users={users} currentUser={user} />
    </Layout>
  );
}
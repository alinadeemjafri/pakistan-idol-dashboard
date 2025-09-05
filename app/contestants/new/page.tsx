import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { getCurrentUser, requireEditor } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ContestantForm } from '@/components/forms/ContestantForm';

export default async function NewContestantPage() {
  const user = await getCurrentUser();
  
  if (!user || user.role !== 'Editor') {
    redirect('/');
  }

  return (
    <Layout user={user}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Add New Contestant</h1>
          <p className="text-slate-600 mt-1">Register a new Pakistan Idol contestant</p>
        </div>
        
        <ContestantForm />
      </div>
    </Layout>
  );
}

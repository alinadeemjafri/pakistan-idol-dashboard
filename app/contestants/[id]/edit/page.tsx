import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { getCurrentUser, requireEditor } from '@/lib/auth';
import { getContestantById } from '@/lib/db/contestant-operations';
import { redirect, notFound } from 'next/navigation';
import { ContestantForm } from '@/components/forms/ContestantForm';

interface EditContestantPageProps {
  params: {
    id: string;
  };
}

export default async function EditContestantPage({ params }: EditContestantPageProps) {
  const user = await getCurrentUser();
  
  if (!user || user.role !== 'Editor') {
    redirect('/');
  }

  const contestant = await getContestantById(params.id);
  
  if (!contestant) {
    notFound();
  }

  return (
    <Layout user={user}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Edit Contestant</h1>
          <p className="text-slate-600 mt-1">Update {contestant.name}'s information</p>
        </div>
        
        <ContestantForm contestant={contestant} />
      </div>
    </Layout>
  );
}

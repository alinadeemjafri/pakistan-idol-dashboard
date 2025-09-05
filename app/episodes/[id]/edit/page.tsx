import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { getCurrentUser, requireEditor } from '@/lib/auth';
import { getEpisodeById } from '@/lib/db/operations';
import { redirect, notFound } from 'next/navigation';
import { EpisodeForm } from '@/components/forms/EpisodeForm';

interface EditEpisodePageProps {
  params: {
    id: string;
  };
}

export default async function EditEpisodePage({ params }: EditEpisodePageProps) {
  const user = await getCurrentUser();
  
  if (!user || user.role !== 'Editor') {
    redirect('/');
  }

  const episode = await getEpisodeById(params.id);
  
  if (!episode) {
    notFound();
  }

  return (
    <Layout user={user}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Edit Episode {episode.episode_no}</h1>
          <p className="text-slate-600 mt-1">Update episode details</p>
        </div>
        
        <EpisodeForm episode={episode} />
      </div>
    </Layout>
  );
}

import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { getCurrentUser } from '@/lib/auth';
import { getEpisodeById } from '@/lib/db/operations';
import { EpisodeDetailClient } from '@/components/episodes/EpisodeDetailClient';
import { notFound } from 'next/navigation';

interface EpisodeDetailPageProps {
  params: {
    id: string;
  };
}

export default async function EpisodeDetailPage({ params }: EpisodeDetailPageProps) {
  const user = await getCurrentUser();
  const episode = await getEpisodeById(params.id);

  if (!episode) {
    notFound();
  }

  return (
    <Layout user={user}>
      <EpisodeDetailClient episode={episode} user={user} />
    </Layout>
  );
}

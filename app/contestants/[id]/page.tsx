import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { getCurrentUser } from '@/lib/auth';
import { getContestantWithScores } from '@/lib/db/contestant-operations';
import { ContestantDetailClient } from '@/components/contestants/ContestantDetailClient';
import { notFound } from 'next/navigation';

interface ContestantProfilePageProps {
  params: {
    id: string;
  };
}

export default async function ContestantProfilePage({ params }: ContestantProfilePageProps) {
  const user = await getCurrentUser();
  
  try {
    const contestant = await getContestantWithScores(params.id);

    if (!contestant) {
      notFound();
    }

    return (
      <Layout user={user}>
        <ContestantDetailClient contestant={contestant} user={user} />
      </Layout>
    );
  } catch (error) {
    console.error('Error loading contestant:', error);
    notFound();
  }
}

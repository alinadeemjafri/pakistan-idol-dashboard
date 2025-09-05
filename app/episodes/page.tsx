import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { getCurrentUser } from '@/lib/auth';
import { getAllEpisodes } from '@/lib/db/operations';
import { EpisodesList } from '@/components/episodes/EpisodesList';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default async function EpisodesPage() {
  const user = await getCurrentUser();
  const episodes = await getAllEpisodes();

  // Get unique cities and phases for filters
  const cities = [...new Set(episodes.map(ep => ep.city))].sort();
  const phases = [...new Set(episodes.map(ep => ep.phase))].sort();

  return (
    <Layout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Episodes</h1>
            <p className="text-slate-600 mt-1">Manage and view all Pakistan Idol episodes</p>
          </div>
          {user?.role === 'Editor' && (
            <Link href="/episodes/new">
              <Button className="mt-4 sm:mt-0">
                <Plus className="w-4 h-4 mr-2" />
                Add Episode
              </Button>
            </Link>
          )}
        </div>

        {/* Episodes List with Search and Filters */}
        <EpisodesList 
          episodes={episodes} 
          cities={cities} 
          phases={phases} 
        />

        {episodes.length === 0 && (
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Plus className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No episodes yet</h3>
            <p className="text-slate-600 mb-4">Get started by creating your first episode.</p>
            {user?.role === 'Editor' && (
              <Link href="/episodes/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Episode
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
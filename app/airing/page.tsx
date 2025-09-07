import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { getCurrentUser } from '@/lib/auth';
import { getAllEpisodes } from '@/lib/db/operations';
import { getEpisodeStatus, formatPKTDate, formatPKTTime } from '@/lib/utils/status';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatusChip } from '@/components/ui/StatusChip';
import { Calendar, Tv, Clock } from 'lucide-react';
import Link from 'next/link';

export default async function AiringSchedulePage() {
  const user = await getCurrentUser();
  const episodes = await getAllEpisodes();

  // Sort episodes by airing start date
  const airingEpisodes = episodes
    .filter(episode => {
      const status = getEpisodeStatus(episode);
      // Show episodes that are recorded, airing, or aired (exclude only planned and recording)
      return status !== 'Recording';
    })
    .sort((a, b) => new Date(a.air_start).getTime() - new Date(b.air_start).getTime());

  // Group by date
  const episodesByDate = airingEpisodes.reduce((acc, episode) => {
    const date = formatPKTDate(episode.air_start);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(episode);
    return acc;
  }, {} as Record<string, typeof airingEpisodes>);

  return (
    <Layout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Airing Schedule</h1>
          <p className="text-slate-600">Chronological schedule of all airing episodes</p>
        </div>

        {/* Schedule */}
        {Object.keys(episodesByDate).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(episodesByDate).map(([date, episodes]) => (
              <Card key={date}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-success" />
                    <span>{date}</span>
                    <span className="text-sm font-normal text-slate-500">
                      ({episodes.length} episode{episodes.length !== 1 ? 's' : ''})
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {episodes.map((episode) => {
                      const status = getEpisodeStatus(episode);
                      
                      return (
                        <div
                          key={episode.episode_id}
                          className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-slate-900">
                                Episode {episode.episode_no} - {episode.phase}
                              </h3>
                              <StatusChip status={status} />
                              {episode.week && (
                                <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                  Week {episode.week}
                                </span>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600">
                              <div className="flex items-center space-x-2">
                                <Tv className="w-4 h-4" />
                                <span>{episode.channel}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4" />
                                <span>
                                  {formatPKTTime(episode.air_start)} - {formatPKTTime(episode.air_end)}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-slate-500">City:</span>
                                <span>{episode.city}</span>
                              </div>
                            </div>
                            
                            {episode.format_summary && (
                              <div className="mt-2">
                                <p className="text-sm text-slate-500">{episode.format_summary}</p>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2 mt-4 lg:mt-0">
                            <Link href={`/episodes/${episode.episode_id}`}>
                              <button className="px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors">
                                View Details
                              </button>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Tv className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No Airing Schedule</h3>
              <p className="text-slate-600">No episodes are currently scheduled for airing.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}

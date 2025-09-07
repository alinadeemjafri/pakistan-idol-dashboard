import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { getCurrentUser } from '@/lib/auth';
import { 
  getTodayEpisodes, 
  getNextRecording, 
  getNextAiring,
  getAllEpisodes
} from '@/lib/db/operations';
import { 
  getContestantStats, 
  getRecentlyEliminated, 
  getTopPerformers, 
  getContestantProgress 
} from '@/lib/db/contestant-operations';
import { getEpisodeStatus, formatPKTDate, formatPKTTime } from '@/lib/utils/status';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatusChip } from '@/components/ui/StatusChip';
import { Calendar, MapPin, Clock, Tv, Play, AlertCircle, TrendingUp, UserX, Mic, Users, Star, Upload, Activity } from 'lucide-react';
import Link from 'next/link';

export default async function HomePage() {
  const user = await getCurrentUser();
  
  // Fetch all dashboard data with error handling
  let todayEpisodes: any[] = [];
  let nextRecording: any = null;
  let nextAiring: any = null;
  let contestantStats: any = { total: 0, active: 0, eliminated: 0 };
  let recentlyEliminated: any[] = [];
  let topPerformers: any[] = [];
  let contestantProgress: any = {};
  let upcomingEpisodes: any[] = [];

  // Fetch episodes and next recording/airing the same way as other pages
  upcomingEpisodes = await getAllEpisodes();
  nextRecording = await getNextRecording();
  nextAiring = await getNextAiring();
  
  // Fetch other data with error handling
  try {
    [
      todayEpisodes,
      contestantStats,
      recentlyEliminated,
      topPerformers,
      contestantProgress
    ] = await Promise.all([
      getTodayEpisodes(),
      getContestantStats(),
      getRecentlyEliminated(),
      getTopPerformers(),
      getContestantProgress()
    ]);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    // If tables don't exist, show empty state
  }

  // Get upcoming episodes for timeline (next 30 days)
  const now = new Date();
  const nextMonth = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
  
  const timelineEpisodes = upcomingEpisodes
    .filter(episode => {
      const airDate = new Date(episode.air_start);
      return airDate >= now && airDate <= nextMonth;
    })
    .sort((a, b) => new Date(a.air_start).getTime() - new Date(b.air_start).getTime())
    .slice(0, 5);

  return (
    <Layout user={user}>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-4 mb-8">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg border border-slate-200">
              <span className="text-primary font-bold text-2xl">🎤</span>
            </div>
            <div className="text-left">
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">
                Production Dashboard
              </h1>
              <p className="text-slate-600 text-sm lg:text-base">
                {formatPKTDate(new Date(), 'dd MMMM yyyy')} - Live Status
              </p>
            </div>
          </div>
        </div>

        {/* Next Up - Recording Priority */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Next Recording */}
          <Card className="border border-slate-200 shadow-lg bg-white hover:shadow-xl transition-shadow duration-200">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 p-6">
              <CardTitle className="flex items-center space-x-3">
                <div className="p-3 bg-primary rounded-lg">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-semibold">Next Recording</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {nextRecording ? (
                <div className="space-y-4">
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-slate-900">Episode {nextRecording.episode_no}</h3>
                      <span className="text-sm text-primary font-medium">{nextRecording.phase}</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="font-medium">{nextRecording.city}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>{formatPKTDate(nextRecording.record_start, 'dd MMM yyyy')} at {formatPKTTime(nextRecording.record_start)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mic className="w-4 h-4 text-primary" />
                        <span>{nextRecording.record_venue}</span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/episodes/${nextRecording.episode_id}`}>
                    <button className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors">
                      View Episode Details
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p>No upcoming recordings scheduled</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Next Airing */}
          <Card className="border border-slate-200 shadow-lg bg-white hover:shadow-xl transition-shadow duration-200">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 p-6">
              <CardTitle className="flex items-center space-x-3">
                <div className="p-3 bg-secondary rounded-lg">
                  <Tv className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-semibold">Next Airing</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {nextAiring ? (
                <div className="space-y-4">
                  <div className="p-4 bg-secondary/5 rounded-lg border border-secondary/20">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-slate-900">Episode {nextAiring.episode_no}</h3>
                      <span className="text-sm text-secondary font-medium">{nextAiring.phase}</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-secondary" />
                        <span className="font-medium">{nextAiring.city}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-secondary" />
                        <span>{formatPKTDate(nextAiring.air_start, 'dd MMM yyyy')} at {formatPKTTime(nextAiring.air_start)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Tv className="w-4 h-4 text-secondary" />
                        <span>{nextAiring.channel}</span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/episodes/${nextAiring.episode_id}`}>
                    <button className="w-full px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-600 transition-colors">
                      View Episode Details
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Tv className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p>No upcoming airings scheduled</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Timeline View */}
        <Card className="border border-slate-200 shadow-lg bg-white hover:shadow-xl transition-shadow duration-200">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 p-6">
            <CardTitle className="flex items-center space-x-3">
              <div className="p-3 bg-success rounded-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold">Production Timeline - Next 30 Days</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {timelineEpisodes.length > 0 ? (
              <div className="space-y-4">
                {timelineEpisodes.map((episode, index) => {
                  const isLast = index === timelineEpisodes.length - 1;
                  const status = getEpisodeStatus(episode);
                  
                  return (
                    <div key={episode.episode_id} className="flex items-start space-x-4">
                      {/* Timeline line */}
                      <div className="flex flex-col items-center">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          status === 'Airing' ? 'bg-success border-success' :
                          status === 'Recording' ? 'bg-warning border-warning' :
                          'bg-slate-300 border-slate-300'
                        }`}></div>
                        {!isLast && <div className="w-0.5 h-8 bg-slate-200 mt-2"></div>}
                      </div>
                      
                      {/* Episode info */}
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-slate-900">
                            Episode {episode.episode_no} - {episode.phase}
                          </h4>
                          <StatusChip status={status} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatPKTDate(episode.air_start, 'dd MMM yyyy')}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>{formatPKTTime(episode.air_start)} - {formatPKTTime(episode.air_end)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>{episode.city}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Tv className="w-4 h-4" />
                            <span>{episode.channel}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <Activity className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>No upcoming episodes in the next 30 days</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contestant Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Contestant Stats */}
          <Card className="border border-slate-200 shadow-lg bg-white hover:shadow-xl transition-shadow duration-200">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 p-6">
              <CardTitle className="flex items-center space-x-3">
                <div className="p-3 bg-primary rounded-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-semibold">Contestant Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Competing</span>
                  <span className="text-2xl font-bold text-success">{contestantProgress?.totalCompeting || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Eliminated</span>
                  <span className="text-2xl font-bold text-slate-600">{contestantProgress?.totalEliminated || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Avg Score</span>
                  <span className="text-lg font-semibold text-primary">{(contestantProgress?.averageScore || 0).toFixed(1)}</span>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600">Top City: <span className="font-medium">{contestantProgress?.topCity || 'N/A'}</span></span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Performers */}
          <Card className="border border-slate-200 shadow-lg bg-white hover:shadow-xl transition-shadow duration-200">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 p-6">
              <CardTitle className="flex items-center space-x-3">
                <div className="p-3 bg-warning rounded-lg">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-semibold">Top Performers</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {topPerformers.length > 0 ? (
                  topPerformers.map((contestant, index) => (
                    <div key={contestant.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-warning rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{contestant.name}</p>
                          <p className="text-sm text-slate-600">{contestant.city}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-warning">#{contestant.serial_number}</p>
                        <p className="text-xs text-slate-500">serial</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-slate-500">
                    <Star className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm">No performers yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Eliminations */}
          <Card className="border border-slate-200 shadow-lg bg-white hover:shadow-xl transition-shadow duration-200">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 p-6">
              <CardTitle className="flex items-center space-x-3">
                <div className="p-3 bg-danger rounded-lg">
                  <UserX className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-semibold">Recent Eliminations</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {recentlyEliminated && recentlyEliminated.length > 0 ? (
                  recentlyEliminated.map((contestant) => (
                    <div key={contestant.id} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-10 h-10 bg-danger rounded-full flex items-center justify-center text-white font-bold">
                        {contestant.serial_number}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{contestant.name}</p>
                        <p className="text-sm text-slate-600">{contestant.city}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">
                          {formatPKTDate(contestant.updated_at, 'dd MMM')}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-slate-500">
                    <UserX className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm">No recent eliminations</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        {user?.role === 'Editor' && (
          <Card className="border border-slate-200 shadow-lg bg-white hover:shadow-xl transition-shadow duration-200">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 p-6">
              <CardTitle className="flex items-center space-x-3">
                <div className="p-3 bg-primary rounded-lg">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-semibold">Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <Link href="/episodes/new">
                  <button className="w-full px-6 py-4 bg-primary text-white rounded-lg hover:bg-primary-600 transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg">
                    <Calendar className="w-5 h-5" />
                    <span className="font-medium">Add Episode</span>
                  </button>
                </Link>
                <Link href="/contestants/new">
                  <button className="w-full px-6 py-4 bg-secondary text-white rounded-lg hover:bg-secondary-600 transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg">
                    <Users className="w-5 h-5" />
                    <span className="font-medium">Add Contestant</span>
                  </button>
                </Link>
                <Link href="/import">
                  <button className="w-full px-6 py-4 bg-warning text-white rounded-lg hover:bg-warning-600 transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg">
                    <Upload className="w-5 h-5" />
                    <span className="font-medium">Import Data</span>
                  </button>
                </Link>
                <Link href="/calendar">
                  <button className="w-full px-6 py-4 bg-success text-white rounded-lg hover:bg-success-600 transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg">
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-medium">View Calendar</span>
                  </button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
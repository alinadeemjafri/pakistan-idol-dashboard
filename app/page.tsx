import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { getCurrentUser } from '@/lib/auth';
import { 
  getTodayEpisodes, 
  getNextRecording, 
  getNextAiring, 
  getCurrentlyRecording, 
  getCurrentlyAiring 
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
import { Calendar, MapPin, Clock, Tv, Play, AlertCircle, TrendingUp, UserX, Mic, Users, Star } from 'lucide-react';
import Link from 'next/link';

export default async function HomePage() {
  const user = await getCurrentUser();
  
  // Fetch all dashboard data
  const [
    todayEpisodes,
    nextRecording,
    nextAiring,
    currentlyRecording,
    currentlyAiring,
    contestantStats,
    recentlyEliminated,
    topPerformers,
    contestantProgress
  ] = await Promise.all([
    getTodayEpisodes(),
    getNextRecording(),
    getNextAiring(),
    getCurrentlyRecording(),
    getCurrentlyAiring(),
    getContestantStats(),
    getRecentlyEliminated(),
    getTopPerformers(),
    getContestantProgress()
  ]);

  return (
    <Layout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-4 mb-6">
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-lg border border-slate-200">
              <span className="text-primary font-bold text-xl">🎤</span>
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold text-slate-900">
                Production Dashboard
              </h1>
              <p className="text-slate-600 text-sm">
                {formatPKTDate(new Date(), 'dd MMMM yyyy')} - Live Status
              </p>
            </div>
          </div>
        </div>

        {/* Live Status - Priority Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Currently Recording */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-warning/10 to-warning/5 hover:shadow-xl transition-all duration-200">
            <CardHeader className="bg-gradient-to-r from-warning/20 to-warning/10 border-b border-warning/20">
              <CardTitle className="flex items-center space-x-2 text-warning-800">
                <div className="p-2 bg-warning rounded-lg">
                  <Play className="w-5 h-5 text-white" />
                </div>
                <span>Currently Recording</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {currentlyRecording.length > 0 ? (
                <div className="space-y-3">
                  {currentlyRecording.map((episode) => (
                    <div key={episode.episode_id} className="p-4 bg-white rounded-lg border border-warning/20">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-slate-900">Episode {episode.episode_no}</h3>
                        <StatusChip status="Recording" />
                      </div>
                      <div className="text-sm text-slate-600 space-y-1">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{episode.city} - {episode.phase}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{formatPKTTime(episode.record_start)} - {formatPKTTime(episode.record_end)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mic className="w-4 h-4" />
                          <span>{episode.record_venue}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Play className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p>No recordings in progress</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Currently Airing */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-success/10 to-success/5 hover:shadow-xl transition-all duration-200">
            <CardHeader className="bg-gradient-to-r from-success/20 to-success/10 border-b border-success/20">
              <CardTitle className="flex items-center space-x-2 text-success-800">
                <div className="p-2 bg-success rounded-lg">
                  <Tv className="w-5 h-5 text-white" />
                </div>
                <span>Currently Airing</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {currentlyAiring.length > 0 ? (
                <div className="space-y-3">
                  {currentlyAiring.map((episode) => (
                    <div key={episode.episode_id} className="p-4 bg-white rounded-lg border border-success/20">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-slate-900">Episode {episode.episode_no}</h3>
                        <StatusChip status="Airing" />
                      </div>
                      <div className="text-sm text-slate-600 space-y-1">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{episode.city} - {episode.phase}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{formatPKTTime(episode.air_start)} - {formatPKTTime(episode.air_end)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Tv className="w-4 h-4" />
                          <span>{episode.channel}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Tv className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p>No episodes airing now</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Next Up - Recording Priority */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Next Recording */}
          <Card className="border border-slate-200 shadow-md bg-white">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
              <CardTitle className="flex items-center space-x-2">
                <div className="p-2 bg-primary rounded-lg">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <span>Next Recording</span>
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
          <Card className="border border-slate-200 shadow-md bg-white">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
              <CardTitle className="flex items-center space-x-2">
                <div className="p-2 bg-secondary rounded-lg">
                  <Tv className="w-5 h-5 text-white" />
                </div>
                <span>Next Airing</span>
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

        {/* Contestant Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contestant Stats */}
          <Card className="border border-slate-200 shadow-md bg-white">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
              <CardTitle className="flex items-center space-x-2">
                <div className="p-2 bg-primary rounded-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <span>Contestant Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Competing</span>
                  <span className="text-2xl font-bold text-success">{contestantProgress.totalCompeting}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Eliminated</span>
                  <span className="text-2xl font-bold text-slate-600">{contestantProgress.totalEliminated}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Elimination Rate</span>
                  <span className="text-lg font-semibold text-warning">{contestantProgress.eliminationRate.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Avg Score</span>
                  <span className="text-lg font-semibold text-primary">{contestantProgress.averageScore.toFixed(1)}</span>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600">Top City: <span className="font-medium">{contestantProgress.topCity}</span></span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Performers */}
          <Card className="border border-slate-200 shadow-md bg-white">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
              <CardTitle className="flex items-center space-x-2">
                <div className="p-2 bg-warning rounded-lg">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <span>Top Performers</span>
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
                        <p className="font-semibold text-warning">{contestant.average_score.toFixed(1)}</p>
                        <p className="text-xs text-slate-500">avg</p>
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
          <Card className="border border-slate-200 shadow-md bg-white">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
              <CardTitle className="flex items-center space-x-2">
                <div className="p-2 bg-danger rounded-lg">
                  <UserX className="w-5 h-5 text-white" />
                </div>
                <span>Recent Eliminations</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {recentlyEliminated.length > 0 ? (
                  recentlyEliminated.map((contestant) => (
                    <div key={contestant.id} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-10 h-10 bg-danger rounded-full flex items-center justify-center text-white font-bold">
                        {contestant.name.split(' ').map(n => n[0]).join('')}
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
          <Card className="border border-slate-200 shadow-md bg-white">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
              <CardTitle className="flex items-center space-x-2">
                <div className="p-2 bg-primary rounded-lg">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/episodes/new">
                  <button className="w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Add Episode</span>
                  </button>
                </Link>
                <Link href="/contestants/new">
                  <button className="w-full px-4 py-3 bg-secondary text-white rounded-lg hover:bg-secondary-600 transition-colors flex items-center justify-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Add Contestant</span>
                  </button>
                </Link>
                <Link href="/calendar">
                  <button className="w-full px-4 py-3 bg-success text-white rounded-lg hover:bg-success-600 transition-colors flex items-center justify-center space-x-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>View Calendar</span>
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
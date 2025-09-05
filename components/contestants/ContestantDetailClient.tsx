'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { InlineEdit } from '@/components/ui/InlineEdit';
import { InlineSelect } from '@/components/ui/InlineSelect';
import { MapPin, Calendar, Phone, Mail, Star, Mic, Trophy, Edit, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { formatPKTDate } from '@/lib/utils/status';
import { ContestantWithScores } from '@/lib/types';
import { AuthUser } from '@/lib/auth';

interface ContestantDetailClientProps {
  contestant: ContestantWithScores;
  user: AuthUser | null;
}

export function ContestantDetailClient({ contestant, user }: ContestantDetailClientProps) {
  const isEditor = user?.role === 'Editor';

  const handleUpdateContestant = async (field: string, value: any) => {
    const response = await fetch(`/api/contestants/${contestant.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ [field]: value }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update contestant');
    }

    // Refresh the page to show updated data
    window.location.reload();
  };

  // Calculate statistics
  const totalEpisodes = contestant.episodes.length;
  const averageScore = contestant.average_score;
  const highestScore = Math.max(...contestant.scores.map(s => s.score), 0);
  const lowestScore = Math.min(...contestant.scores.map(s => s.score), 0);

  // Group scores by episode
  const scoresByEpisode = contestant.scores.reduce((acc, score) => {
    if (!acc[score.episode_id]) {
      acc[score.episode_id] = [];
    }
    acc[score.episode_id].push(score);
    return acc;
  }, {} as Record<string, typeof contestant.scores>);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/contestants">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Contestants
            </Button>
          </Link>
          <div>
            <InlineEdit
              value={contestant.name}
              onSave={(value) => handleUpdateContestant('name', value)}
              canEdit={isEditor}
              className="text-3xl font-bold text-slate-900"
            />
            <div className="flex items-center space-x-3 mt-2">
              <InlineSelect
                value={contestant.status}
                onSave={(value) => handleUpdateContestant('status', value)}
                options={[
                  { value: 'Competing', label: 'Competing' },
                  { value: 'Eliminated', label: 'Eliminated' },
                  { value: 'Winner', label: 'Winner' },
                  { value: 'Runner-up', label: 'Runner-up' }
                ]}
                canEdit={isEditor}
              />
              <InlineEdit
                value={contestant.age}
                onSave={(value) => handleUpdateContestant('age', value)}
                type="number"
                canEdit={isEditor}
                className="text-slate-600"
              />
              <span className="text-slate-600">years old</span>
            </div>
          </div>
        </div>
        
        {isEditor && (
          <Link href={`/contestants/${contestant.id}/edit`}>
            <Button>
              <Edit className="w-4 h-4 mr-2" />
              Edit Contestant
            </Button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                  {contestant.name.split(' ').map(n => n[0]).join('')}
                </div>
                
                <h2 className="text-xl font-semibold text-slate-900 mb-2">{contestant.name}</h2>
                <StatusBadge status={contestant.status} />
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-slate-500" />
                  <div>
                    <p className="text-sm text-slate-500">From</p>
                    <InlineEdit
                      value={contestant.city}
                      onSave={(value) => handleUpdateContestant('city', value)}
                      canEdit={isEditor}
                      className="font-medium"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-slate-500" />
                  <div>
                    <p className="text-sm text-slate-500">Auditioned in</p>
                    <InlineEdit
                      value={contestant.audition_city}
                      onSave={(value) => handleUpdateContestant('audition_city', value)}
                      canEdit={isEditor}
                      className="font-medium"
                    />
                    {contestant.audition_date && (
                      <p className="text-sm text-slate-600">
                        {formatPKTDate(contestant.audition_date)}
                      </p>
                    )}
                  </div>
                </div>
                
                {contestant.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-500">Phone</p>
                      <InlineEdit
                        value={contestant.phone}
                        onSave={(value) => handleUpdateContestant('phone', value)}
                        canEdit={isEditor}
                        className="font-medium"
                      />
                    </div>
                  </div>
                )}
                
                {contestant.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-500">Email</p>
                      <InlineEdit
                        value={contestant.email}
                        onSave={(value) => handleUpdateContestant('email', value)}
                        canEdit={isEditor}
                        className="font-medium"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {contestant.bio && (
                <div className="mt-6">
                  <h3 className="font-semibold text-slate-900 mb-2">Bio</h3>
                  <InlineEdit
                    value={contestant.bio}
                    onSave={(value) => handleUpdateContestant('bio', value)}
                    type="textarea"
                    canEdit={isEditor}
                    className="text-slate-700 text-sm leading-relaxed"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-primary" />
                <span>Statistics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-warning" />
                  <span className="text-sm text-slate-600">Average Score</span>
                </div>
                <span className="font-semibold">{averageScore.toFixed(1)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mic className="w-4 h-4 text-primary" />
                  <span className="text-sm text-slate-600">Episodes</span>
                </div>
                <span className="font-semibold">{totalEpisodes}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-secondary" />
                  <span className="text-sm text-slate-600">Golden Mics</span>
                </div>
                <InlineEdit
                  value={contestant.golden_mics_received}
                  onSave={(value) => handleUpdateContestant('golden_mics_received', value)}
                  type="number"
                  canEdit={isEditor}
                  className="font-semibold"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Highest Score</span>
                <span className="font-semibold">{highestScore.toFixed(1)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Lowest Score</span>
                <span className="font-semibold">{lowestScore.toFixed(1)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Scores and Episodes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Performance History */}
          <Card>
            <CardHeader>
              <CardTitle>Performance History</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(scoresByEpisode).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(scoresByEpisode).map(([episodeId, scores]) => {
                    const episodeScore = scores.reduce((sum, score) => sum + score.score, 0) / scores.length;
                    
                    return (
                      <div key={episodeId} className="border border-slate-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-slate-900">
                            Episode {scores[0]?.episode_id || 'Unknown'}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <Star className="w-4 h-4 text-warning" />
                            <span className="font-semibold">{episodeScore.toFixed(1)}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {scores.map((score) => (
                            <div key={score.id} className="flex items-center justify-between text-sm">
                              <span className="text-slate-600">{score.judge_name}</span>
                              <div className="flex items-center space-x-3">
                                <span className="font-medium">{score.score.toFixed(1)}</span>
                                {score.remarks && (
                                  <span className="text-slate-500 italic">"{score.remarks}"</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Mic className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No Performances Yet</h3>
                  <p className="text-slate-600">This contestant hasn't performed in any episodes yet.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Episode Participation */}
          {contestant.episodes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Episode Participation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {contestant.episodes.map((episode) => (
                    <div key={episode.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-slate-900">
                          Episode {episode.episode_id}
                        </h4>
                        {episode.song_title && (
                          <p className="text-sm text-slate-600">Song: {episode.song_title}</p>
                        )}
                        {episode.performance_order && (
                          <p className="text-sm text-slate-600">Order: #{episode.performance_order}</p>
                        )}
                      </div>
                      <Link href={`/episodes/${episode.episode_id}`}>
                        <Button variant="outline" size="sm">
                          View Episode
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { InlineEdit } from '@/components/ui/InlineEdit';
import { InlineSelect } from '@/components/ui/InlineSelect';
import { MapPin, Phone, Hash, Edit, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
            <h1 className="text-3xl font-bold text-slate-900">{contestant.name}</h1>
            <div className="flex items-center space-x-3 mt-2">
              <StatusBadge status={contestant.status} />
              <span className="text-slate-600">Serial #{contestant.serial_number}</span>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Basic Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Hash className="w-5 h-5 text-primary" />
                <span>Basic Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">Serial Number</span>
                <InlineEdit
                  value={contestant.serial_number}
                  onSave={(value) => handleUpdateContestant('serial_number', parseInt(String(value)))}
                  type="number"
                  canEdit={isEditor}
                  className="font-semibold text-primary"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">Name</span>
                <InlineEdit
                  value={contestant.name}
                  onSave={(value) => handleUpdateContestant('name', value)}
                  canEdit={isEditor}
                  className="font-semibold text-slate-900"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">Status</span>
                <InlineSelect
                  value={contestant.status}
                  onSave={(value) => handleUpdateContestant('status', value)}
                  options={[
                    { value: 'Competing', label: 'Competing' },
                    { value: 'Eliminated', label: 'Eliminated' }
                  ]}
                  canEdit={isEditor}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-secondary" />
                <span>Location & Contact</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">City</span>
                <InlineEdit
                  value={contestant.city}
                  onSave={(value) => handleUpdateContestant('city', value)}
                  canEdit={isEditor}
                  className="font-semibold text-slate-900"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">Contact</span>
                <InlineEdit
                  value={contestant.contact}
                  onSave={(value) => handleUpdateContestant('contact', value)}
                  canEdit={isEditor}
                  className="font-semibold text-slate-900"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Performance Data */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              {contestant.scores.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                      <p className="text-2xl font-bold text-primary">{contestant.scores.length}</p>
                      <p className="text-sm text-slate-600">Total Scores</p>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                      <p className="text-2xl font-bold text-warning">
                        {contestant.scores.length > 0 
                          ? (contestant.scores.reduce((sum, s) => sum + s.score, 0) / contestant.scores.length).toFixed(1)
                          : '0.0'
                        }
                      </p>
                      <p className="text-sm text-slate-600">Average Score</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                      <p className="text-2xl font-bold text-success">
                        {contestant.scores.length > 0 ? Math.max(...contestant.scores.map(s => s.score)) : 0}
                      </p>
                      <p className="text-sm text-slate-600">Highest Score</p>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                      <p className="text-2xl font-bold text-danger">
                        {contestant.scores.length > 0 ? Math.min(...contestant.scores.map(s => s.score)) : 0}
                      </p>
                      <p className="text-sm text-slate-600">Lowest Score</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <p className="text-sm">No performance data available yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {contestant.episodes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Episode Participation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {contestant.episodes.map((episode) => (
                    <div key={episode.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">Episode {episode.episode_id}</p>
                        {episode.song_title && (
                          <p className="text-sm text-slate-600">{episode.song_title}</p>
                        )}
                      </div>
                      <div className="text-right">
                        {episode.performance_order && (
                          <p className="text-sm text-slate-500">Order: {episode.performance_order}</p>
                        )}
                      </div>
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
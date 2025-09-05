'use client';

import React from 'react';
import { getEpisodeStatus, formatPKTDate, formatPKTTime, formatPKTDateTime } from '@/lib/utils/status';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatusChip } from '@/components/ui/StatusChip';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { InlineEdit } from '@/components/ui/InlineEdit';
import { InlineSelect } from '@/components/ui/InlineSelect';
import { Calendar, MapPin, Clock, Tv, Mic, Users, Vote, Edit } from 'lucide-react';
import Link from 'next/link';
import { Episode } from '@/lib/types';
import { AuthUser } from '@/lib/auth';

interface EpisodeDetailClientProps {
  episode: Episode;
  user: AuthUser | null;
}

export function EpisodeDetailClient({ episode, user }: EpisodeDetailClientProps) {
  const status = getEpisodeStatus(episode);
  const isEditor = user?.role === 'Editor';

  const handleUpdateEpisode = async (field: string, value: any) => {
    const response = await fetch(`/api/episodes/${episode.episode_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ [field]: value }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update episode');
    }

    // Refresh the page to show updated data
    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-3xl font-bold text-slate-900">
              Episode {episode.episode_no}
            </h1>
            <StatusChip status={status} />
          </div>
          <InlineEdit
            value={episode.phase}
            onSave={(value) => handleUpdateEpisode('phase', value)}
            canEdit={isEditor}
            label="Phase"
          />
          <div className="flex items-center space-x-4 mt-2 text-sm text-slate-500">
            <InlineEdit
              value={episode.city}
              onSave={(value) => handleUpdateEpisode('city', value)}
              canEdit={isEditor}
              icon={<MapPin className="w-4 h-4" />}
            />
            {episode.week && (
              <InlineEdit
                value={episode.week}
                onSave={(value) => handleUpdateEpisode('week', value)}
                canEdit={isEditor}
                icon={<Calendar className="w-4 h-4" />}
                label="Week"
              />
            )}
          </div>
        </div>
        
        {isEditor && (
          <Link href={`/episodes/${episode.episode_id}/edit`}>
            <Button>
              <Edit className="w-4 h-4 mr-2" />
              Edit Episode
            </Button>
          </Link>
        )}
      </div>

      {/* Format Summary */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-slate-900 mb-2">Format Summary</h3>
          <InlineEdit
            value={episode.format_summary || ''}
            onSave={(value) => handleUpdateEpisode('format_summary', value)}
            type="textarea"
            placeholder="Enter format summary..."
            canEdit={isEditor}
          />
        </CardContent>
      </Card>

      {/* Recording & Airing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recording Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span>Recording</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span className="text-sm text-slate-600">
                {formatPKTDate(episode.record_start)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <span className="text-sm text-slate-600">
                {formatPKTTime(episode.record_start)} - {formatPKTTime(episode.record_end)}
              </span>
            </div>
            <InlineEdit
              value={episode.record_venue}
              onSave={(value) => handleUpdateEpisode('record_venue', value)}
              canEdit={isEditor}
              icon={<MapPin className="w-4 h-4 text-slate-500" />}
              label="Venue"
            />
          </CardContent>
        </Card>

        {/* Airing Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Tv className="w-5 h-5 text-success" />
              <span>Airing</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span className="text-sm text-slate-600">
                {formatPKTDate(episode.air_start)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <span className="text-sm text-slate-600">
                {formatPKTTime(episode.air_start)} - {formatPKTTime(episode.air_end)}
              </span>
            </div>
            <InlineEdit
              value={episode.channel}
              onSave={(value) => handleUpdateEpisode('channel', value)}
              canEdit={isEditor}
              icon={<Tv className="w-4 h-4 text-slate-500" />}
              label="Channel"
            />
          </CardContent>
        </Card>
      </div>

      {/* Format Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-primary" />
            <span>Format Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Performances Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-slate-900">Performances</h4>
              <div className="flex items-center space-x-2">
                <InlineEdit
                  value={episode.performances_locked}
                  onSave={(value) => handleUpdateEpisode('performances_locked', value)}
                  type="number"
                  canEdit={isEditor}
                  className="text-sm"
                />
                <span className="text-sm text-slate-600">/</span>
                <InlineEdit
                  value={episode.performances_planned}
                  onSave={(value) => handleUpdateEpisode('performances_planned', value)}
                  type="number"
                  canEdit={isEditor}
                  className="text-sm"
                />
              </div>
            </div>
            <ProgressBar 
              value={episode.performances_locked} 
              max={episode.performances_planned}
              showLabel={false}
            />
          </div>

          {/* Golden Mics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-secondary/20 rounded-lg">
                <Mic className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Golden Mics Available</p>
                <InlineEdit
                  value={episode.golden_mics_available}
                  onSave={(value) => handleUpdateEpisode('golden_mics_available', value)}
                  type="number"
                  canEdit={isEditor}
                  className="text-lg font-semibold text-slate-900"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-warning/20 rounded-lg">
                <Mic className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Golden Mics Used</p>
                <InlineEdit
                  value={episode.golden_mics_used}
                  onSave={(value) => handleUpdateEpisode('golden_mics_used', value)}
                  type="number"
                  canEdit={isEditor}
                  className="text-lg font-semibold text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Voting */}
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${episode.voting_enabled ? 'bg-success/20' : 'bg-slate-100'}`}>
              <Vote className={`w-5 h-5 ${episode.voting_enabled ? 'text-success' : 'text-slate-400'}`} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Voting</p>
              <InlineSelect
                value={episode.voting_enabled ? 'true' : 'false'}
                onSave={(value) => handleUpdateEpisode('voting_enabled', value === 'true')}
                options={[
                  { value: 'true', label: 'Enabled' },
                  { value: 'false', label: 'Disabled' }
                ]}
                canEdit={isEditor}
                className="font-medium"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <InlineEdit
            value={episode.notes || ''}
            onSave={(value) => handleUpdateEpisode('notes', value)}
            type="textarea"
            placeholder="Add notes..."
            canEdit={isEditor}
          />
        </CardContent>
      </Card>

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <span>Last updated by</span>
            <span className="font-medium">{episode.updated_by}</span>
            <span>on</span>
            <span className="font-medium">{formatPKTDateTime(episode.updated_at)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


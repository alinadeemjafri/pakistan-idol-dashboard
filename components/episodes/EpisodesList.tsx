'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { StatusChip } from '@/components/ui/StatusChip';
import { Search, Calendar, X } from 'lucide-react';
import { Episode, EpisodeStatus } from '@/lib/types';
import { getEpisodeStatus, formatPKTDate } from '@/lib/utils/status';
import Link from 'next/link';

interface EpisodesListProps {
  episodes: Episode[];
  cities: string[];
  phases: string[];
}

export function EpisodesList({ episodes, cities, phases }: EpisodesListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedPhase, setSelectedPhase] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const filteredEpisodes = useMemo(() => {
    return episodes.filter(episode => {
      const matchesSearch = episode.episode_no.toString().includes(searchTerm) ||
                           episode.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           episode.phase.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           episode.format_summary.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCity = !selectedCity || episode.city === selectedCity;
      const matchesPhase = !selectedPhase || episode.phase === selectedPhase;
      
      let matchesStatus = true;
      if (selectedStatus) {
        const episodeStatus = getEpisodeStatus(episode);
        matchesStatus = episodeStatus === selectedStatus;
      }

      return matchesSearch && matchesCity && matchesPhase && matchesStatus;
    });
  }, [episodes, searchTerm, selectedCity, selectedPhase, selectedStatus]);

  const hasActiveFilters = searchTerm || selectedCity || selectedPhase || selectedStatus;

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCity('');
    setSelectedPhase('');
    setSelectedStatus('');
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Section */}
      <Card className="border border-slate-200 shadow-sm bg-white">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-600 rounded-lg flex items-center justify-center shadow-sm">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Search & Filter Episodes</h3>
              </div>
              
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Clear</span>
                </button>
              )}
            </div>
            
            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search Input - NO duplicate icon */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search episodes..."
                  className="pl-10 border-slate-200 focus:border-primary focus:ring-primary/20"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select
                label="City"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                options={[
                  { value: '', label: 'All Cities' },
                  ...cities.map(city => ({ value: city, label: city }))
                ]}
              />
              
              <Select
                label="Phase"
                value={selectedPhase}
                onChange={(e) => setSelectedPhase(e.target.value)}
                options={[
                  { value: '', label: 'All Phases' },
                  ...phases.map(phase => ({ value: phase, label: phase }))
                ]}
              />
              
              <Select
                label="Status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                options={[
                  { value: '', label: 'All Status' },
                  { value: 'Planned', label: 'Planned' },
                  { value: 'Recording', label: 'Recording' },
                  { value: 'Recorded', label: 'Recorded' },
                  { value: 'Airing', label: 'Airing' },
                  { value: 'Aired', label: 'Aired' },
                ]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          Showing {filteredEpisodes.length} of {episodes.length} episodes
        </p>
      </div>

      {/* Episodes List */}
      {filteredEpisodes.length > 0 ? (
        <div className="space-y-4">
          {filteredEpisodes.map((episode) => {
            const status = getEpisodeStatus(episode);
            return (
              <Card key={episode.episode_id} className="hover:shadow-xl transition-all duration-200 border border-slate-200 bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                          <span className="text-white font-bold text-sm">E{episode.episode_no}</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">
                            Episode {episode.episode_no}
                          </h3>
                          <StatusChip status={status} />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span className="font-medium text-slate-700">Phase:</span>
                          <span className="text-slate-600">{episode.phase}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-secondary rounded-full"></div>
                          <span className="font-medium text-slate-700">City:</span>
                          <span className="text-slate-600">{episode.city}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-accent rounded-full"></div>
                          <span className="font-medium text-slate-700">Week:</span>
                          <span className="text-slate-600">{episode.week || 'N/A'}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div className="bg-slate-50 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-6 h-6 bg-warning/20 rounded-lg flex items-center justify-center">
                              <span className="text-warning text-xs">📹</span>
                            </div>
                            <span className="font-medium text-slate-700">Recording</span>
                          </div>
                          <div className="text-sm text-slate-600">
                            {formatPKTDate(episode.record_start, 'dd MMM yyyy, HH:mm')} - {formatPKTDate(episode.record_end, 'HH:mm')}
                          </div>
                          <div className="text-xs text-slate-500 mt-1">{episode.record_venue}</div>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-6 h-6 bg-success/20 rounded-lg flex items-center justify-center">
                              <span className="text-success text-xs">📺</span>
                            </div>
                            <span className="font-medium text-slate-700">Airing</span>
                          </div>
                          <div className="text-sm text-slate-600">
                            {formatPKTDate(episode.air_start, 'dd MMM yyyy, HH:mm')} - {formatPKTDate(episode.air_end, 'HH:mm')}
                          </div>
                          <div className="text-xs text-slate-500 mt-1">{episode.channel}</div>
                        </div>
                      </div>
                      
                      {episode.format_summary && (
                        <div className="mt-4 p-3 bg-primary/5 rounded-lg border-l-4 border-primary">
                          <span className="font-medium text-slate-700">Format:</span>
                          <span className="text-slate-600 ml-2">{episode.format_summary}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Link href={`/episodes/${episode.episode_id}`}>
                        <button className="px-6 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-600 transition-all duration-200 font-medium shadow-sm hover:shadow-md">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-slate-400 mb-4">
              <Calendar className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No episodes found</h3>
            <p className="text-slate-600">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

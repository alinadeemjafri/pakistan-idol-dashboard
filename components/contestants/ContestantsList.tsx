'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ContestantCard } from '@/components/contestants/ContestantCard';
import { Search, Users, X } from 'lucide-react';
import { Contestant } from '@/lib/types';

interface ContestantsListProps {
  contestants: Contestant[];
  cities: string[];
  auditionCities: string[];
}

export function ContestantsList({ contestants, cities, auditionCities }: ContestantsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedAuditionCity, setSelectedAuditionCity] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const filteredContestants = useMemo(() => {
    return contestants.filter(contestant => {
      const matchesSearch = contestant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           contestant.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           contestant.audition_city.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCity = !selectedCity || contestant.city === selectedCity;
      const matchesAuditionCity = !selectedAuditionCity || contestant.audition_city === selectedAuditionCity;
      const matchesStatus = !selectedStatus || contestant.status === selectedStatus;

      return matchesSearch && matchesCity && matchesAuditionCity && matchesStatus;
    });
  }, [contestants, searchTerm, selectedCity, selectedAuditionCity, selectedStatus]);

  const hasActiveFilters = searchTerm || selectedCity || selectedAuditionCity || selectedStatus;

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCity('');
    setSelectedAuditionCity('');
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
                <div className="w-10 h-10 bg-gradient-to-br from-secondary to-secondary-600 rounded-lg flex items-center justify-center shadow-sm">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Search & Filter Contestants</h3>
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
                  placeholder="Search by name, city..."
                  className="pl-10 border-slate-200 focus:border-secondary focus:ring-secondary/20"
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
                label="Audition City"
                value={selectedAuditionCity}
                onChange={(e) => setSelectedAuditionCity(e.target.value)}
                options={[
                  { value: '', label: 'All Audition Cities' },
                  ...auditionCities.map(city => ({ value: city, label: city }))
                ]}
              />
              
              <Select
                label="Status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                options={[
                  { value: '', label: 'All Statuses' },
                  { value: 'Competing', label: 'Competing' },
                  { value: 'Eliminated', label: 'Eliminated' },
                  { value: 'Winner', label: 'Winner' },
                  { value: 'Runner-up', label: 'Runner-up' }
                ]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          Showing {filteredContestants.length} of {contestants.length} contestants
        </p>
      </div>

      {/* Contestants List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContestants.length > 0 ? (
          filteredContestants.map((contestant) => (
            <ContestantCard key={contestant.id} contestant={contestant} />
          ))
        ) : (
          <div className="col-span-full">
            <Card className="border border-slate-200 shadow-sm bg-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No contestants found</h3>
                <p className="text-slate-600">Try adjusting your search criteria or filters.</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

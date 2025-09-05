'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Checkbox } from '@/components/ui/Checkbox';
import { EpisodeFormData, Episode } from '@/lib/types';

interface EpisodeFormProps {
  episode?: Episode;
}

export function EpisodeForm({ episode }: EpisodeFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<EpisodeFormData>({
    episode_no: episode?.episode_no || 1,
    phase: episode?.phase || '',
    city: episode?.city || '',
    week: episode?.week || '',
    record_start: episode?.record_start ? new Date(episode.record_start).toISOString().slice(0, 16) : '',
    record_end: episode?.record_end ? new Date(episode.record_end).toISOString().slice(0, 16) : '',
    record_venue: episode?.record_venue || '',
    air_start: episode?.air_start ? new Date(episode.air_start).toISOString().slice(0, 16) : '',
    air_end: episode?.air_end ? new Date(episode.air_end).toISOString().slice(0, 16) : '',
    channel: episode?.channel || '',
    performances_planned: episode?.performances_planned || 0,
    performances_locked: episode?.performances_locked || 0,
    golden_mics_available: episode?.golden_mics_available || 0,
    golden_mics_used: episode?.golden_mics_used || 0,
    voting_enabled: episode?.voting_enabled || false,
    format_summary: episode?.format_summary || '',
    notes: episode?.notes || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = episode ? `/api/episodes/${episode.episode_id}` : '/api/episodes';
      const method = episode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/episodes');
        router.refresh();
      } else {
        const error = await response.text();
        alert(`Error: ${error}`);
      }
    } catch (error) {
      console.error('Error saving episode:', error);
      alert('Error saving episode. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof EpisodeFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Episode Number"
              type="number"
              value={formData.episode_no}
              onChange={(e) => handleInputChange('episode_no', parseInt(e.target.value))}
              required
            />
            
            <Select
              label="Phase"
              value={formData.phase}
              onChange={(e) => handleInputChange('phase', e.target.value)}
              options={[
                { value: '', label: 'Select Phase' },
                { value: 'Judges', label: 'Judges' },
                { value: 'Workshop-Piano', label: 'Workshop-Piano' },
                { value: 'Gala', label: 'Gala' },
              ]}
              required
            />
            
            <Input
              label="City"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              required
            />
            
            <Input
              label="Week"
              value={formData.week}
              onChange={(e) => handleInputChange('week', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Recording Information */}
      <Card>
        <CardHeader>
          <CardTitle>Recording Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Recording Start"
              type="datetime-local"
              value={formData.record_start}
              onChange={(e) => handleInputChange('record_start', e.target.value)}
              required
            />
            
            <Input
              label="Recording End"
              type="datetime-local"
              value={formData.record_end}
              onChange={(e) => handleInputChange('record_end', e.target.value)}
              required
            />
          </div>
          
          <Input
            label="Recording Venue"
            value={formData.record_venue}
            onChange={(e) => handleInputChange('record_venue', e.target.value)}
            required
          />
        </CardContent>
      </Card>

      {/* Airing Information */}
      <Card>
        <CardHeader>
          <CardTitle>Airing Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Airing Start"
              type="datetime-local"
              value={formData.air_start}
              onChange={(e) => handleInputChange('air_start', e.target.value)}
              required
            />
            
            <Input
              label="Airing End"
              type="datetime-local"
              value={formData.air_end}
              onChange={(e) => handleInputChange('air_end', e.target.value)}
              required
            />
          </div>
          
          <Input
            label="Channel"
            value={formData.channel}
            onChange={(e) => handleInputChange('channel', e.target.value)}
            required
          />
        </CardContent>
      </Card>

      {/* Format Information */}
      <Card>
        <CardHeader>
          <CardTitle>Format Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Performances Planned"
              type="number"
              value={formData.performances_planned}
              onChange={(e) => handleInputChange('performances_planned', parseInt(e.target.value))}
              required
            />
            
            <Input
              label="Performances Locked"
              type="number"
              value={formData.performances_locked}
              onChange={(e) => handleInputChange('performances_locked', parseInt(e.target.value))}
              required
            />
            
            <Input
              label="Golden Mics Available"
              type="number"
              value={formData.golden_mics_available}
              onChange={(e) => handleInputChange('golden_mics_available', parseInt(e.target.value))}
              required
            />
            
            <Input
              label="Golden Mics Used"
              type="number"
              value={formData.golden_mics_used}
              onChange={(e) => handleInputChange('golden_mics_used', parseInt(e.target.value))}
              required
            />
          </div>
          
          <Checkbox
            label="Voting Enabled"
            checked={formData.voting_enabled}
            onChange={(e) => handleInputChange('voting_enabled', e.target.checked)}
          />
          
          <Input
            label="Format Summary"
            value={formData.format_summary}
            onChange={(e) => handleInputChange('format_summary', e.target.value)}
          />
          
          <Textarea
            label="Notes"
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : episode ? 'Update Episode' : 'Create Episode'}
        </Button>
      </div>
    </form>
  );
}

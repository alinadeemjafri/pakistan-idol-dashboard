'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { ContestantFormData, Contestant, ContestantStatus } from '@/lib/types';

interface ContestantFormProps {
  contestant?: Contestant;
}

export function ContestantForm({ contestant }: ContestantFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ContestantFormData>({
    name: contestant?.name || '',
    age: contestant?.age || 18,
    city: contestant?.city || '',
    phone: contestant?.phone || '',
    email: contestant?.email || '',
    profile_image: contestant?.profile_image || '',
    bio: contestant?.bio || '',
    audition_date: contestant?.audition_date ? new Date(contestant.audition_date).toISOString().slice(0, 16) : '',
    audition_city: contestant?.audition_city || '',
    audition_venue: contestant?.audition_venue || '',
    status: contestant?.status || 'Competing',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = contestant ? `/api/contestants/${contestant.id}` : '/api/contestants';
      const method = contestant ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/contestants');
        router.refresh();
      } else {
        const error = await response.text();
        alert(`Error: ${error}`);
      }
    } catch (error) {
      console.error('Error saving contestant:', error);
      alert('Error saving contestant. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ContestantFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const cities = [
    'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan',
    'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala', 'Hyderabad', 'Sukkur'
  ];

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
              label="Full Name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
            
            <Input
              label="Age"
              type="number"
              min="16"
              max="50"
              value={formData.age}
              onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
              required
            />
            
            <Select
              label="City"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              options={[
                { value: '', label: 'Select City' },
                ...cities.map(city => ({ value: city, label: city }))
              ]}
              required
            />
            
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value as ContestantStatus)}
              options={[
                { value: 'Competing', label: 'Competing' },
                { value: 'Eliminated', label: 'Eliminated' },
                { value: 'Winner', label: 'Winner' },
                { value: 'Runner-up', label: 'Runner-up' },
              ]}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+92-300-1234567"
            />
            
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="contestant@email.com"
            />
          </div>
        </CardContent>
      </Card>

      {/* Audition Information */}
      <Card>
        <CardHeader>
          <CardTitle>Audition Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Audition Date"
              type="datetime-local"
              value={formData.audition_date}
              onChange={(e) => handleInputChange('audition_date', e.target.value)}
            />
            
            <Select
              label="Audition City"
              value={formData.audition_city}
              onChange={(e) => handleInputChange('audition_city', e.target.value)}
              options={[
                { value: '', label: 'Select Audition City' },
                ...cities.map(city => ({ value: city, label: city }))
              ]}
              required
            />
          </div>
          
          <Input
            label="Audition Venue"
            value={formData.audition_venue}
            onChange={(e) => handleInputChange('audition_venue', e.target.value)}
            placeholder="e.g., Karachi Arts Council"
          />
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Profile Image URL"
            type="url"
            value={formData.profile_image}
            onChange={(e) => handleInputChange('profile_image', e.target.value)}
            placeholder="https://example.com/profile.jpg"
          />
          
          <Textarea
            label="Bio"
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            rows={4}
            placeholder="Tell us about the contestant's musical background, experience, and style..."
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
          {isSubmitting ? 'Saving...' : contestant ? 'Update Contestant' : 'Create Contestant'}
        </Button>
      </div>
    </form>
  );
}

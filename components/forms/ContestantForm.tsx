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
    serial_number: contestant?.serial_number || 1,
    name: contestant?.name || '',
    contact: contestant?.contact || '',
    city: contestant?.city || '',
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
      <Card>
        <CardHeader>
          <CardTitle>Contestant Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Serial Number"
              type="number"
              min="1"
              value={formData.serial_number}
              onChange={(e) => handleInputChange('serial_number', parseInt(e.target.value))}
              required
            />
            
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
            
            <Input
              label="Contact"
              value={formData.contact}
              onChange={(e) => handleInputChange('contact', e.target.value)}
              placeholder="Phone number or email"
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
              ]}
              required
            />
          </div>
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

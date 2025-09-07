import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Contestant } from '@/lib/types';
import { MapPin, Phone, Hash } from 'lucide-react';

interface ContestantCardProps {
  contestant: Contestant;
}

export function ContestantCard({ contestant }: ContestantCardProps) {
  return (
    <Card className="border border-slate-200 bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            {/* Serial Number */}
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
              {contestant.serial_number}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-slate-900 truncate">
                  {contestant.name}
                </h3>
                <StatusBadge status={contestant.status} />
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2 text-slate-600">
                  <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center">
                    <MapPin className="w-3 h-3 text-primary" />
                  </div>
                  <span className="font-medium">{contestant.city}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-slate-600">
                  <div className="w-5 h-5 bg-secondary/10 rounded-full flex items-center justify-center">
                    <Phone className="w-3 h-3 text-secondary" />
                  </div>
                  <span>{contestant.contact}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-slate-600 mt-3">
                  <div className="w-5 h-5 bg-accent/10 rounded-full flex items-center justify-center">
                    <Hash className="w-3 h-3 text-accent" />
                  </div>
                  <span className="font-semibold text-slate-700">Serial #{contestant.serial_number}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
  );
}

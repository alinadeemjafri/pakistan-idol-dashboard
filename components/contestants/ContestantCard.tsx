import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Contestant } from '@/lib/types';
import { MapPin, Calendar, Star, Mic } from 'lucide-react';
import Link from 'next/link';

interface ContestantCardProps {
  contestant: Contestant;
}

export function ContestantCard({ contestant }: ContestantCardProps) {
  return (
    <Link href={`/contestants/${contestant.id}`}>
      <Card className="hover:shadow-xl transition-all duration-200 cursor-pointer border border-slate-200 bg-white shadow-sm group">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            {/* Profile Image Placeholder */}
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-105 transition-transform duration-200">
              {contestant.name.split(' ').map(n => n[0]).join('')}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-slate-900 truncate group-hover:text-primary transition-colors">
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
                  <span className="text-slate-400">•</span>
                  <span>{contestant.age} years old</span>
                </div>
                
                <div className="flex items-center space-x-2 text-slate-600">
                  <div className="w-5 h-5 bg-secondary/10 rounded-full flex items-center justify-center">
                    <Calendar className="w-3 h-3 text-secondary" />
                  </div>
                  <span>Auditioned in {contestant.audition_city}</span>
                </div>
                
                <div className="flex items-center space-x-6 mt-3">
                  <div className="flex items-center space-x-2 bg-warning/10 rounded-lg px-3 py-1">
                    <Star className="w-4 h-4 text-warning" />
                    <span className="font-semibold text-slate-700">{contestant.average_score.toFixed(1)}</span>
                    <span className="text-slate-500 text-xs">avg</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 bg-primary/10 rounded-lg px-3 py-1">
                    <Mic className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-slate-700">{contestant.episodes_participated}</span>
                    <span className="text-slate-500 text-xs">episodes</span>
                  </div>
                </div>
              </div>
              
              {contestant.bio && (
                <div className="mt-3 p-3 bg-slate-50 rounded-lg border-l-4 border-accent">
                  <p className="text-sm text-slate-600 line-clamp-2">
                    {contestant.bio}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

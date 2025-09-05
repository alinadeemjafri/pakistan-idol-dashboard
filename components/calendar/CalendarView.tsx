'use client';

import React, { useState } from 'react';
import { formatPKTDate } from '@/lib/utils/status';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, ChevronRight, Play, Tv } from 'lucide-react';
import Link from 'next/link';

interface CalendarViewProps {
  episodes: any[];
}

export function CalendarView({ episodes }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');


  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // Generate calendar days
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(currentYear, currentMonth, day));
  }

  // Get episodes for a specific date
  const getEpisodesForDate = (date: Date) => {
    const dateStr = formatPKTDate(date, 'yyyy-MM-dd');
    const foundEpisodes = episodes.filter(episode => {
      const recordDate = formatPKTDate(episode.record_start, 'yyyy-MM-dd');
      const airDate = formatPKTDate(episode.air_start, 'yyyy-MM-dd');
      return recordDate === dateStr || airDate === dateStr;
    });
    
    
    return foundEpisodes;
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (view === 'month') {
        if (direction === 'prev') {
          newDate.setMonth(prev.getMonth() - 1);
        } else {
          newDate.setMonth(prev.getMonth() + 1);
        }
      } else if (view === 'week') {
        if (direction === 'prev') {
          newDate.setDate(prev.getDate() - 7);
        } else {
          newDate.setDate(prev.getDate() + 7);
        }
      } else if (view === 'day') {
        if (direction === 'prev') {
          newDate.setDate(prev.getDate() - 1);
        } else {
          newDate.setDate(prev.getDate() + 1);
        }
      }
      return newDate;
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Calendar</h1>
          <p className="text-slate-600 mt-1">View recording and airing schedules</p>
        </div>
        
        {/* View Toggle */}
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          {(['month', 'week', 'day'] as const).map((viewType) => (
            <Button
              key={viewType}
              variant={view === viewType ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setView(viewType)}
            >
              {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Calendar Navigation */}
      <Card className="border border-slate-200 shadow-md bg-white">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate('prev')}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <h2 className="text-xl font-semibold">
              {view === 'month' && `${monthNames[currentMonth]} ${currentYear}`}
              {view === 'week' && `Week of ${formatPKTDate(currentDate, 'MMM dd, yyyy')}`}
              {view === 'day' && formatPKTDate(currentDate, 'EEEE, MMMM dd, yyyy')}
            </h2>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate('next')}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {view === 'month' && (
            <div className="grid grid-cols-7 gap-1">
              {/* Day headers */}
              {dayNames.map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-slate-500">
                  {day}
                </div>
              ))}
              
              {/* Calendar days */}
              {calendarDays.map((date, index) => {
                if (!date) {
                  return <div key={index} className="p-2" />;
                }
                
                const dayEpisodes = getEpisodesForDate(date);
                const isToday = date.toDateString() === today.toDateString();
                
                return (
                  <div
                    key={index}
                    className={`p-2 min-h-[100px] border border-slate-200 ${
                      isToday ? 'bg-primary/5 border-primary' : 'bg-white'
                    }`}
                  >
                    <div className={`text-sm font-medium mb-1 ${
                      isToday ? 'text-primary' : 'text-slate-900'
                    }`}>
                      {date.getDate()}
                    </div>
                    
                    <div className="space-y-1">
                      {dayEpisodes.slice(0, 2).map((episode) => {
                        const isRecording = formatPKTDate(episode.record_start, 'yyyy-MM-dd') === formatPKTDate(date, 'yyyy-MM-dd');
                        const isAiring = formatPKTDate(episode.air_start, 'yyyy-MM-dd') === formatPKTDate(date, 'yyyy-MM-dd');
                        
                        return (
                          <Link
                            key={episode.episode_id}
                            href={`/episodes/${episode.episode_id}`}
                            className={`block p-1 rounded text-xs ${
                              isRecording 
                                ? 'bg-warning/20 text-warning-800' 
                                : 'bg-success/20 text-success-800'
                            }`}
                          >
                            <div className="flex items-center space-x-1">
                              {isRecording ? (
                                <Play className="w-3 h-3" />
                              ) : (
                                <Tv className="w-3 h-3" />
                              )}
                              <span>Ep {episode.episode_no}</span>
                            </div>
                          </Link>
                        );
                      })}
                      
                      {dayEpisodes.length > 2 && (
                        <div className="text-xs text-slate-500">
                          +{dayEpisodes.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {view === 'week' && (
            <div className="grid grid-cols-7 gap-1">
              {/* Day headers */}
              {dayNames.map(day => (
                <div key={day} className="p-3 text-center text-sm font-medium text-slate-500 border-b">
                  {day}
                </div>
              ))}
              
              {/* Week days */}
              {(() => {
                const startOfWeek = new Date(currentDate);
                startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
                
                return Array.from({ length: 7 }, (_, index) => {
                  const date = new Date(startOfWeek);
                  date.setDate(startOfWeek.getDate() + index);
                  
                  const dayEpisodes = getEpisodesForDate(date);
                  const isToday = date.toDateString() === today.toDateString();
                  
                  return (
                    <div
                      key={index}
                      className={`p-3 min-h-[200px] border border-slate-200 ${
                        isToday ? 'bg-primary/5 border-primary' : 'bg-white'
                      }`}
                    >
                      <div className={`text-sm font-medium mb-2 ${
                        isToday ? 'text-primary' : 'text-slate-900'
                      }`}>
                        {date.getDate()}
                      </div>
                      
                      <div className="space-y-2">
                        {dayEpisodes.map((episode) => {
                          const isRecording = formatPKTDate(episode.record_start, 'yyyy-MM-dd') === formatPKTDate(date, 'yyyy-MM-dd');
                          const isAiring = formatPKTDate(episode.air_start, 'yyyy-MM-dd') === formatPKTDate(date, 'yyyy-MM-dd');
                          
                          return (
                            <Link
                              key={episode.episode_id}
                              href={`/episodes/${episode.episode_id}`}
                              className={`block p-2 rounded text-xs ${
                                isRecording 
                                  ? 'bg-warning/20 text-warning-800' 
                                  : 'bg-success/20 text-success-800'
                              }`}
                            >
                              <div className="flex items-center space-x-1">
                                {isRecording ? (
                                  <Play className="w-3 h-3" />
                                ) : (
                                  <Tv className="w-3 h-3" />
                                )}
                                <span>Ep {episode.episode_no}</span>
                              </div>
                              <div className="text-xs mt-1 opacity-75">
                                {episode.city} - {episode.phase}
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          )}

          {view === 'day' && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-900">
                  {formatPKTDate(currentDate, 'EEEE, MMMM dd, yyyy')}
                </h3>
              </div>
              
              {(() => {
                const dayEpisodes = getEpisodesForDate(currentDate);
                
                if (dayEpisodes.length === 0) {
                  return (
                    <div className="text-center py-8 text-slate-500">
                      No episodes scheduled for this day
                    </div>
                  );
                }
                
                return (
                  <div className="space-y-3">
                    {dayEpisodes.map((episode) => {
                      const isRecording = formatPKTDate(episode.record_start, 'yyyy-MM-dd') === formatPKTDate(currentDate, 'yyyy-MM-dd');
                      const isAiring = formatPKTDate(episode.air_start, 'yyyy-MM-dd') === formatPKTDate(currentDate, 'yyyy-MM-dd');
                      
                      return (
                        <Link
                          key={episode.episode_id}
                          href={`/episodes/${episode.episode_id}`}
                          className={`block p-4 rounded-lg border ${
                            isRecording 
                              ? 'bg-warning/10 border-warning/20 hover:bg-warning/20' 
                              : 'bg-success/10 border-success/20 hover:bg-success/20'
                          } transition-colors`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {isRecording ? (
                                <Play className="w-5 h-5 text-warning" />
                              ) : (
                                <Tv className="w-5 h-5 text-success" />
                              )}
                              <div>
                                <h4 className="font-semibold text-slate-900">
                                  Episode {episode.episode_no}
                                </h4>
                                <p className="text-sm text-slate-600">
                                  {episode.city} - {episode.phase}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-slate-900">
                                {isRecording ? 'Recording' : 'Airing'}
                              </div>
                              <div className="text-xs text-slate-500">
                                {isRecording 
                                  ? formatPKTDate(episode.record_start, 'HH:mm') + ' - ' + formatPKTDate(episode.record_end, 'HH:mm')
                                  : formatPKTDate(episode.air_start, 'HH:mm') + ' - ' + formatPKTDate(episode.air_end, 'HH:mm')
                                }
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="border border-slate-200 shadow-sm bg-white">
        <CardContent className="p-4">
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-warning/20 rounded"></div>
              <span>Recording</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success/20 rounded"></div>
              <span>Airing</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

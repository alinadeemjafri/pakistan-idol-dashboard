import React from 'react';
import { cn } from '@/lib/utils/cn';
import { ContestantStatus } from '@/lib/types';

interface StatusBadgeProps {
  status: ContestantStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusConfig = (status: ContestantStatus) => {
    switch (status) {
      case 'Competing':
        return {
          bg: 'bg-success/20',
          text: 'text-success-800',
          icon: '🎤',
        };
      case 'Eliminated':
        return {
          bg: 'bg-danger/20',
          text: 'text-danger-800',
          icon: '❌',
        };
      case 'Winner':
        return {
          bg: 'bg-secondary/20',
          text: 'text-secondary-800',
          icon: '👑',
        };
      case 'Runner-up':
        return {
          bg: 'bg-warning/20',
          text: 'text-warning-800',
          icon: '🥈',
        };
      default:
        return {
          bg: 'bg-slate/20',
          text: 'text-slate-800',
          icon: '⚪',
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        config.bg,
        config.text,
        className
      )}
    >
      <span className="mr-1">{config.icon}</span>
      {status}
    </span>
  );
}

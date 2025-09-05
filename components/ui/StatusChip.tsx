import React from 'react';
import { cn } from '@/lib/utils/cn';
import { getStatusColor } from '@/lib/utils/status';
import { EpisodeStatus } from '@/lib/types';

interface StatusChipProps {
  status: EpisodeStatus;
  className?: string;
}

export function StatusChip({ status, className }: StatusChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        getStatusColor(status),
        className
      )}
    >
      {status}
    </span>
  );
}

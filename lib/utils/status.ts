import { formatInTimeZone } from 'date-fns-tz';
import { EpisodeStatus } from '@/lib/types';

const PKT_TIMEZONE = 'Asia/Karachi';

export function getCurrentPKTTime(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: PKT_TIMEZONE }));
}

export function getEpisodeStatus(episode: {
  record_start: string;
  record_end: string;
  air_start: string;
  air_end: string;
}): EpisodeStatus {
  const now = getCurrentPKTTime();
  const recordStart = new Date(episode.record_start);
  const recordEnd = new Date(episode.record_end);
  const airStart = new Date(episode.air_start);
  const airEnd = new Date(episode.air_end);

  if (now < recordStart) {
    return 'Planned';
  } else if (recordStart <= now && now <= recordEnd) {
    return 'Recording';
  } else if (recordEnd < now && now < airStart) {
    return 'Recorded';
  } else if (airStart <= now && now <= airEnd) {
    return 'Airing';
  } else if (now > airEnd) {
    return 'Aired';
  } else {
    return 'Planned';
  }
}

export function formatPKTDate(date: string | Date, format: string = 'dd MMM yyyy'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatInTimeZone(dateObj, PKT_TIMEZONE, format);
}

export function formatPKTTime(date: string | Date, format: string = 'HH:mm'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatInTimeZone(dateObj, PKT_TIMEZONE, format);
}

export function formatPKTDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatInTimeZone(dateObj, PKT_TIMEZONE, 'dd MMM yyyy, HH:mm');
}

export function getStatusColor(status: EpisodeStatus): string {
  switch (status) {
    case 'Planned':
      return 'bg-slate-100 text-slate-800';
    case 'Recording':
      return 'bg-warning-100 text-warning-800';
    case 'Recorded':
      return 'bg-primary-100 text-primary-800';
    case 'Airing':
      return 'bg-success-100 text-success-800';
    case 'Aired':
      return 'bg-slate-200 text-slate-600';
    default:
      return 'bg-slate-100 text-slate-800';
  }
}

import * as XLSX from 'xlsx';
import { EpisodeFormData, ExcelMapping } from '@/lib/types';

export interface ExcelRow {
  [key: string]: any;
}

export function parseExcelFile(file: File): Promise<ExcelRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        resolve(jsonData as ExcelRow[]);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

export function getColumnHeaders(rows: ExcelRow[]): string[] {
  if (rows.length === 0) return [];
  return Object.keys(rows[0]);
}

export function mapExcelDataToEpisodes(
  rows: ExcelRow[],
  mapping: ExcelMapping
): EpisodeFormData[] {
  return rows.map((row, index) => {
    const episode: EpisodeFormData = {
      episode_no: parseInt(row[mapping.episode_no]) || index + 1,
      phase: row[mapping.phase] || '',
      city: row[mapping.city] || '',
      week: row[mapping.week] || undefined,
      record_start: parseDateTime(row[mapping.record_start]),
      record_end: parseDateTime(row[mapping.record_end]),
      record_venue: row[mapping.record_venue] || '',
      air_start: parseDateTime(row[mapping.air_start]),
      air_end: parseDateTime(row[mapping.air_end]),
      channel: row[mapping.channel] || '',
      performances_planned: parseInt(row[mapping.performances_planned]) || 0,
      performances_locked: parseInt(row[mapping.performances_locked]) || 0,
      golden_mics_available: parseInt(row[mapping.golden_mics_available]) || 0,
      golden_mics_used: parseInt(row[mapping.golden_mics_used]) || 0,
      voting_enabled: parseBoolean(row[mapping.voting_enabled]),
      format_summary: row[mapping.format_summary] || '',
      notes: row[mapping.notes] || '',
    };

    return episode;
  });
}

function parseDateTime(value: any): string {
  if (!value) return new Date().toISOString();
  
  // Handle Excel date serial numbers
  if (typeof value === 'number') {
    const date = new Date((value - 25569) * 86400 * 1000);
    return date.toISOString();
  }
  
  // Handle string dates
  if (typeof value === 'string') {
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      return date.toISOString();
    }
  }
  
  // Handle Date objects
  if (value instanceof Date) {
    return value.toISOString();
  }
  
  return new Date().toISOString();
}

function parseBoolean(value: any): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const lower = value.toLowerCase();
    return lower === 'true' || lower === 'yes' || lower === '1' || lower === 'enabled';
  }
  if (typeof value === 'number') return value > 0;
  return false;
}

export function validateEpisodeData(episode: EpisodeFormData): string[] {
  const errors: string[] = [];
  
  if (!episode.episode_no || episode.episode_no <= 0) {
    errors.push('Episode number must be a positive integer');
  }
  
  if (!episode.phase.trim()) {
    errors.push('Phase is required');
  }
  
  if (!episode.city.trim()) {
    errors.push('City is required');
  }
  
  if (!episode.record_start) {
    errors.push('Recording start date is required');
  }
  
  if (!episode.record_end) {
    errors.push('Recording end date is required');
  }
  
  if (!episode.air_start) {
    errors.push('Airing start date is required');
  }
  
  if (!episode.air_end) {
    errors.push('Airing end date is required');
  }
  
  if (episode.record_start && episode.record_end) {
    const recordStart = new Date(episode.record_start);
    const recordEnd = new Date(episode.record_end);
    if (recordEnd < recordStart) {
      errors.push('Recording end date must be after recording start date');
    }
  }
  
  if (episode.air_start && episode.air_end) {
    const airStart = new Date(episode.air_start);
    const airEnd = new Date(episode.air_end);
    if (airEnd < airStart) {
      errors.push('Airing end date must be after airing start date');
    }
  }
  
  if (episode.performances_locked > episode.performances_planned) {
    errors.push('Performances locked cannot exceed performances planned');
  }
  
  return errors;
}

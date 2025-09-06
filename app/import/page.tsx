'use client';

import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';
import { parseExcelFile, getColumnHeaders, mapExcelDataToEpisodes, validateEpisodeData } from '@/lib/excel-import';
import { EpisodeFormData, ExcelMapping } from '@/lib/types';

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [excelData, setExcelData] = useState<any[]>([]);
  const [mapping, setMapping] = useState<ExcelMapping>({
    episode_no: '',
    phase: '',
    city: '',
    week: '',
    record_start: '',
    record_end: '',
    record_venue: '',
    air_start: '',
    air_end: '',
    channel: '',
    performances_planned: '',
    performances_locked: '',
    golden_mics_available: '',
    golden_mics_used: '',
    voting_enabled: '',
    format_summary: '',
    notes: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [importResults, setImportResults] = useState<{
    success: number;
    errors: number;
    details: string[];
  } | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setIsProcessing(true);

    try {
      const data = await parseExcelFile(uploadedFile);
      setExcelData(data);
      
      // Auto-suggest mappings based on column names
      const headers = getColumnHeaders(data);
      const suggestedMapping: Partial<ExcelMapping> = {};
      
      headers.forEach(header => {
        const lowerHeader = header.toLowerCase();
        if (lowerHeader.includes('episode') && lowerHeader.includes('no')) {
          suggestedMapping.episode_no = header;
        } else if (lowerHeader.includes('phase')) {
          suggestedMapping.phase = header;
        } else if (lowerHeader.includes('city')) {
          suggestedMapping.city = header;
        } else if (lowerHeader.includes('week')) {
          suggestedMapping.week = header;
        } else if (lowerHeader.includes('record') && lowerHeader.includes('start')) {
          suggestedMapping.record_start = header;
        } else if (lowerHeader.includes('record') && lowerHeader.includes('end')) {
          suggestedMapping.record_end = header;
        } else if (lowerHeader.includes('venue')) {
          suggestedMapping.record_venue = header;
        } else if (lowerHeader.includes('air') && lowerHeader.includes('start')) {
          suggestedMapping.air_start = header;
        } else if (lowerHeader.includes('air') && lowerHeader.includes('end')) {
          suggestedMapping.air_end = header;
        } else if (lowerHeader.includes('channel')) {
          suggestedMapping.channel = header;
        } else if (lowerHeader.includes('performances') && lowerHeader.includes('planned')) {
          suggestedMapping.performances_planned = header;
        } else if (lowerHeader.includes('performances') && lowerHeader.includes('locked')) {
          suggestedMapping.performances_locked = header;
        } else if (lowerHeader.includes('golden') && lowerHeader.includes('available')) {
          suggestedMapping.golden_mics_available = header;
        } else if (lowerHeader.includes('golden') && lowerHeader.includes('used')) {
          suggestedMapping.golden_mics_used = header;
        } else if (lowerHeader.includes('voting')) {
          suggestedMapping.voting_enabled = header;
        } else if (lowerHeader.includes('format')) {
          suggestedMapping.format_summary = header;
        } else if (lowerHeader.includes('note')) {
          suggestedMapping.notes = header;
        }
      });
      
      setMapping(prev => ({ ...prev, ...suggestedMapping }));
    } catch (error) {
      console.error('Error parsing Excel file:', error);
      alert('Error parsing Excel file. Please make sure it\'s a valid Excel file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMappingChange = (field: keyof ExcelMapping, value: string) => {
    setMapping(prev => ({ ...prev, [field]: value }));
  };

  const validateData = () => {
    if (excelData.length === 0) return;

    const episodes = mapExcelDataToEpisodes(excelData, mapping);
    const allErrors: string[] = [];
    
    episodes.forEach((episode, index) => {
      const errors = validateEpisodeData(episode);
      if (errors.length > 0) {
        allErrors.push(`Row ${index + 1}: ${errors.join(', ')}`);
      }
    });
    
    setValidationErrors(allErrors);
  };

  const handleImport = async () => {
    if (excelData.length === 0) return;

    setIsProcessing(true);
    const episodes = mapExcelDataToEpisodes(excelData, mapping);
    
    let successCount = 0;
    let errorCount = 0;
    const details: string[] = [];

    try {
      for (const episode of episodes) {
        try {
          const response = await fetch('/api/episodes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(episode),
          });

          if (response.ok) {
            successCount++;
            details.push(`Episode ${episode.episode_no}: Imported successfully`);
          } else {
            errorCount++;
            const error = await response.text();
            details.push(`Episode ${episode.episode_no}: ${error}`);
          }
        } catch (error) {
          errorCount++;
          details.push(`Episode ${episode.episode_no}: ${error}`);
        }
      }

      setImportResults({ success: successCount, errors: errorCount, details });
    } catch (error) {
      console.error('Import error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getColumnOptions = () => {
    const headers = getColumnHeaders(excelData);
    return [
      { value: '', label: '-- Select Column --' },
      ...headers.map(header => ({ value: header, label: header }))
    ];
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Import Episodes</h1>
          <p className="text-slate-600 mt-1">Import episodes from Excel file</p>
        </div>

        {/* File Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="w-5 h-5" />
              <span>Upload Excel File</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                <FileSpreadsheet className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
                >
                  Choose Excel File
                </label>
                <p className="text-sm text-slate-500 mt-2">
                  Supported formats: .xlsx, .xls
                </p>
              </div>

              {file && (
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>{file.name}</span>
                  <span>({excelData.length} rows)</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Field Mapping */}
        {excelData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Field Mapping</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Episode Number"
                  options={getColumnOptions()}
                  value={mapping.episode_no}
                  onChange={(e) => handleMappingChange('episode_no', e.target.value)}
                />
                
                <Select
                  label="Phase"
                  options={getColumnOptions()}
                  value={mapping.phase}
                  onChange={(e) => handleMappingChange('phase', e.target.value)}
                />
                
                <Select
                  label="City"
                  options={getColumnOptions()}
                  value={mapping.city}
                  onChange={(e) => handleMappingChange('city', e.target.value)}
                />
                
                <Select
                  label="Week"
                  options={getColumnOptions()}
                  value={mapping.week}
                  onChange={(e) => handleMappingChange('week', e.target.value)}
                />
                
                <Select
                  label="Recording Start"
                  options={getColumnOptions()}
                  value={mapping.record_start}
                  onChange={(e) => handleMappingChange('record_start', e.target.value)}
                />
                
                <Select
                  label="Recording End"
                  options={getColumnOptions()}
                  value={mapping.record_end}
                  onChange={(e) => handleMappingChange('record_end', e.target.value)}
                />
                
                <Select
                  label="Recording Venue"
                  options={getColumnOptions()}
                  value={mapping.record_venue}
                  onChange={(e) => handleMappingChange('record_venue', e.target.value)}
                />
                
                <Select
                  label="Airing Start"
                  options={getColumnOptions()}
                  value={mapping.air_start}
                  onChange={(e) => handleMappingChange('air_start', e.target.value)}
                />
                
                <Select
                  label="Airing End"
                  options={getColumnOptions()}
                  value={mapping.air_end}
                  onChange={(e) => handleMappingChange('air_end', e.target.value)}
                />
                
                <Select
                  label="Channel"
                  options={getColumnOptions()}
                  value={mapping.channel}
                  onChange={(e) => handleMappingChange('channel', e.target.value)}
                />
                
                <Select
                  label="Performances Planned"
                  options={getColumnOptions()}
                  value={mapping.performances_planned}
                  onChange={(e) => handleMappingChange('performances_planned', e.target.value)}
                />
                
                <Select
                  label="Performances Locked"
                  options={getColumnOptions()}
                  value={mapping.performances_locked}
                  onChange={(e) => handleMappingChange('performances_locked', e.target.value)}
                />
                
                <Select
                  label="Golden Mics Available"
                  options={getColumnOptions()}
                  value={mapping.golden_mics_available}
                  onChange={(e) => handleMappingChange('golden_mics_available', e.target.value)}
                />
                
                <Select
                  label="Golden Mics Used"
                  options={getColumnOptions()}
                  value={mapping.golden_mics_used}
                  onChange={(e) => handleMappingChange('golden_mics_used', e.target.value)}
                />
                
                <Select
                  label="Voting Enabled"
                  options={getColumnOptions()}
                  value={mapping.voting_enabled}
                  onChange={(e) => handleMappingChange('voting_enabled', e.target.value)}
                />
                
                <Select
                  label="Format Summary"
                  options={getColumnOptions()}
                  value={mapping.format_summary}
                  onChange={(e) => handleMappingChange('format_summary', e.target.value)}
                />
                
                <Select
                  label="Notes"
                  options={getColumnOptions()}
                  value={mapping.notes}
                  onChange={(e) => handleMappingChange('notes', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Validation */}
        {excelData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Validation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button onClick={validateData} variant="outline">
                  Validate Data
                </Button>
                
                {validationErrors.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-danger">
                      <AlertCircle className="w-4 h-4" />
                      <span className="font-medium">Validation Errors:</span>
                    </div>
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {validationErrors.map((error, index) => (
                        <div key={index} className="text-sm text-danger bg-danger/10 p-2 rounded">
                          {error}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {validationErrors.length === 0 && validationErrors.length > 0 && (
                  <div className="flex items-center space-x-2 text-success">
                    <CheckCircle className="w-4 h-4" />
                    <span>All data is valid</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Import */}
        {excelData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Import</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button 
                  onClick={handleImport} 
                  disabled={isProcessing || validationErrors.length > 0}
                  className="w-full"
                >
                  {isProcessing ? 'Importing...' : `Import ${excelData.length} Episodes`}
                </Button>
                
                {importResults && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 text-success">
                        <CheckCircle className="w-4 h-4" />
                        <span>{importResults.success} successful</span>
                      </div>
                      <div className="flex items-center space-x-2 text-danger">
                        <AlertCircle className="w-4 h-4" />
                        <span>{importResults.errors} errors</span>
                      </div>
                    </div>
                    
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {importResults.details.map((detail, index) => (
                        <div key={index} className="text-sm text-slate-600 bg-slate-50 p-2 rounded">
                          {detail}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}

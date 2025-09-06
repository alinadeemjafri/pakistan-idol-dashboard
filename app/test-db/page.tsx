'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function TestDbPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const testDatabase = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/test-db');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  const fixDatabase = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/fix-db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Database Test & Fix</CardTitle>
          <p className="text-slate-600">Test and fix the database schema</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <Button
              onClick={testDatabase}
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Testing...' : 'Test Database'}
            </Button>

            <Button
              onClick={fixDatabase}
              disabled={loading}
              className="flex-1"
              variant="secondary"
            >
              {loading ? 'Fixing...' : 'Fix Database'}
            </Button>
          </div>
          
          {result && (
            <div className={`p-4 rounded-lg text-sm ${
              result.success 
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              <pre className="whitespace-pre-wrap overflow-auto max-h-96">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
          
          {result?.success && (
            <div className="text-center">
              <p className="text-green-600 font-medium">Database test completed!</p>
              <p className="text-sm text-slate-600 mt-2">
                You can now <a href="/login" className="text-blue-600 hover:underline">go to login</a>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

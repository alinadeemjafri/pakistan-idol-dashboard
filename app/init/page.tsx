'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function InitPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const initializeDatabase = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/init-db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Database Initialization</CardTitle>
          <p className="text-slate-600">Initialize the database schema</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={initializeDatabase}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Initializing...' : 'Initialize Database'}
          </Button>
          
          {result && (
            <div className={`p-4 rounded-lg text-sm ${
              result.success 
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
          
          {result?.success && (
            <div className="text-center">
              <p className="text-green-600 font-medium">Database initialized successfully!</p>
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

'use client';

import { useState } from 'react';

export default function DebugTest() {
  const [users, setUsers] = useState(null);
  const [loginTest, setLoginTest] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/debug/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/debug/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@pakistanidol.com' })
      });
      const data = await response.json();
      setLoginTest(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Debug Authentication</h1>
      
      <div className="space-y-4">
        <button 
          onClick={checkUsers}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Check Users in Database'}
        </button>

        <button 
          onClick={testLogin}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 ml-4"
        >
          {loading ? 'Loading...' : 'Test Login Process'}
        </button>
      </div>

      {users && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h2 className="font-bold mb-2">Users in Database:</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(users, null, 2)}
          </pre>
        </div>
      )}

      {loginTest && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h2 className="font-bold mb-2">Login Test Result:</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(loginTest, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

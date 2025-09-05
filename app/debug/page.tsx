import React from 'react';
import { db, users } from '@/lib/db';

export default async function DebugPage() {
  try {
    const allUsers = await db.select().from(users);
    
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Database Debug</h1>
        <div className="bg-slate-100 p-4 rounded">
          <h2 className="font-semibold mb-2">Users in Database:</h2>
          {allUsers.length > 0 ? (
            <ul>
              {allUsers.map(user => (
                <li key={user.id} className="mb-2">
                  <strong>Email:</strong> {user.email}<br/>
                  <strong>Name:</strong> {user.name}<br/>
                  <strong>Role:</strong> {user.role}<br/>
                  <strong>ID:</strong> {user.id}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-red-600">No users found in database!</p>
          )}
        </div>
        
        <div className="mt-4">
          <a href="/login" className="text-blue-600 underline">Go to Login</a>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Database Error</h1>
        <div className="bg-red-100 p-4 rounded">
          <p className="text-red-600">Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      </div>
    );
  }
}

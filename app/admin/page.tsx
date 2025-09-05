import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { getCurrentUser, requireEditor } from '@/lib/auth';
import { getAllUsers } from '@/lib/db/operations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Users, Plus, Trash2, Shield } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const user = await getCurrentUser();
  
  if (!user || user.role !== 'Editor') {
    redirect('/');
  }

  const users = await getAllUsers();

  return (
    <Layout user={user}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Panel</h1>
          <p className="text-slate-600 mt-1">Manage users and system settings</p>
        </div>

        {/* Add User */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add New User</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Name"
                placeholder="Full name"
                required
              />
              <Input
                label="Email"
                type="email"
                placeholder="user@example.com"
                required
              />
              <Select
                label="Role"
                options={[
                  { value: 'Viewer', label: 'Viewer' },
                  { value: 'Editor', label: 'Editor' }
                ]}
              />
              <div className="md:col-span-3">
                <Button type="submit">
                  Add User
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Users ({users.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((userItem) => (
                <div
                  key={userItem.id}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{userItem.name}</h3>
                      <p className="text-sm text-slate-600">{userItem.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      userItem.role === 'Editor' 
                        ? 'bg-secondary/20 text-secondary' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {userItem.role}
                    </span>
                    
                    {userItem.id !== user.id && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this user?')) {
                            // Handle delete
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Info */}
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Total Users</p>
                <p className="text-lg font-semibold text-slate-900">{users.length}</p>
              </div>
              <div>
                <p className="text-slate-500">Editors</p>
                <p className="text-lg font-semibold text-slate-900">
                  {users.filter(u => u.role === 'Editor').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

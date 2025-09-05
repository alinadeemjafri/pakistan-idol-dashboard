import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { getCurrentUser } from '@/lib/auth';
import { getAllContestants, getContestantStats } from '@/lib/db/contestant-operations';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ContestantsList } from '@/components/contestants/ContestantsList';
import { Plus, Users, MapPin, Trophy, Star } from 'lucide-react';
import Link from 'next/link';

export default async function ContestantsPage() {
  const user = await getCurrentUser();
  const contestants = await getAllContestants();
  const stats = await getContestantStats();

  // Get unique cities and audition cities for filters
  const cities = [...new Set(contestants.map(c => c.city))].sort();
  const auditionCities = [...new Set(contestants.map(c => c.audition_city))].sort();

  return (
    <Layout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Contestants</h1>
            <p className="text-slate-600 mt-1">Manage and view all Pakistan Idol contestants</p>
          </div>
          {user?.role === 'Editor' && (
            <Link href="/contestants/new">
              <Button className="mt-4 sm:mt-0">
                <Plus className="w-4 h-4 mr-2" />
                Add Contestant
              </Button>
            </Link>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Total Contestants</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <Star className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Competing</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.competing}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <Trophy className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Winners</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.winners}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-slate/10 rounded-lg">
                  <MapPin className="w-6 h-6 text-slate" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Cities</p>
                  <p className="text-2xl font-bold text-slate-900">{Object.keys(stats.byCity).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contestants List with Search and Filters */}
        <ContestantsList 
          contestants={contestants} 
          cities={cities} 
          auditionCities={auditionCities} 
        />

        {contestants.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No Contestants Found</h3>
              <p className="text-slate-600 mb-4">Get started by adding your first contestant.</p>
              {user?.role === 'Editor' && (
                <Link href="/contestants/new">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Contestant
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
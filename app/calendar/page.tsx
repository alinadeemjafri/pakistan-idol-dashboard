import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { getCurrentUser } from '@/lib/auth';
import { getAllEpisodes } from '@/lib/db/operations';
import { getEpisodeStatus, formatPKTDate } from '@/lib/utils/status';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import { Calendar, ChevronLeft, ChevronRight, Play, Tv } from 'lucide-react';
import Link from 'next/link';
import { CalendarView } from '@/components/calendar/CalendarView';

export default async function CalendarPage() {
  const user = await getCurrentUser();
  const episodes = await getAllEpisodes();

  return (
    <Layout user={user}>
      <CalendarView episodes={episodes} />
    </Layout>
  );
}

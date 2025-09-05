import { NextRequest, NextResponse } from 'next/server';
import { requireEditor } from '@/lib/auth';
import { createEpisode, getAllEpisodes } from '@/lib/db/operations';
import { EpisodeFormData } from '@/lib/types';

export async function GET() {
  try {
    const episodes = await getAllEpisodes();
    return NextResponse.json(episodes);
  } catch (error) {
    console.error('Error fetching episodes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch episodes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireEditor();
    const data: EpisodeFormData = await request.json();
    
    const episode = await createEpisode(data, user.name);
    return NextResponse.json(episode, { status: 201 });
  } catch (error) {
    console.error('Error creating episode:', error);
    if (error instanceof Error && error.message === 'Editor access required') {
      return NextResponse.json(
        { error: 'Editor access required' },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create episode' },
      { status: 500 }
    );
  }
}

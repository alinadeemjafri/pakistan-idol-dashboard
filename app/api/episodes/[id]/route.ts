import { NextRequest, NextResponse } from 'next/server';
import { requireEditor } from '@/lib/auth';
import { updateEpisode, getEpisodeById } from '@/lib/db/operations';
import { EpisodeFormData } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const episode = await getEpisodeById(params.id);
    
    if (!episode) {
      return NextResponse.json({ error: 'Episode not found' }, { status: 404 });
    }

    return NextResponse.json(episode);
  } catch (error) {
    console.error('Error fetching episode:', error);
    return NextResponse.json(
      { error: 'Failed to fetch episode' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireEditor();
    const data = await request.json();
    
    const episode = await updateEpisode(params.id, {
      ...data,
      updated_by: user.name,
      updated_at: new Date().toISOString(),
    }, user.name);

    return NextResponse.json(episode);
  } catch (error) {
    console.error('Error updating episode:', error);
    
    if (error instanceof Error && error.message === 'Editor access required') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update episode' },
      { status: 500 }
    );
  }
}

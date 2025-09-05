import { NextRequest, NextResponse } from 'next/server';
import { requireEditor } from '@/lib/auth';
import { updateContestant, getContestantById } from '@/lib/db/contestant-operations';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contestant = await getContestantById(params.id);
    
    if (!contestant) {
      return NextResponse.json({ error: 'Contestant not found' }, { status: 404 });
    }

    return NextResponse.json(contestant);
  } catch (error) {
    console.error('Error fetching contestant:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contestant' },
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
    
    const contestant = await updateContestant(params.id, {
      ...data,
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json(contestant);
  } catch (error) {
    console.error('Error updating contestant:', error);
    
    if (error instanceof Error && error.message === 'Editor access required') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update contestant' },
      { status: 500 }
    );
  }
}

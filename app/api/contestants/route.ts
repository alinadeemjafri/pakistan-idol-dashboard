import { NextRequest, NextResponse } from 'next/server';
import { requireEditor } from '@/lib/auth';
import { getAllContestants, createContestant } from '@/lib/db/contestant-operations';
import { ContestantFormData } from '@/lib/types';

export async function GET() {
  try {
    const contestants = await getAllContestants();
    return NextResponse.json(contestants);
  } catch (error) {
    console.error('Error fetching contestants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contestants' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireEditor();
    const data: ContestantFormData = await request.json();
    
    const contestant = await createContestant(data);
    return NextResponse.json(contestant, { status: 201 });
  } catch (error) {
    console.error('Error creating contestant:', error);
    if (error instanceof Error && error.message === 'Editor access required') {
      return NextResponse.json(
        { error: 'Editor access required' },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create contestant' },
      { status: 500 }
    );
  }
}

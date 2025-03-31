import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.BACKEND_API_URL || 'http://localhost:3000';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const userId = req.headers.get('user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log(`Setting alert email ${id} as active for user ${userId}`);

    const response = await fetch(`${API_URL}/api/emails/${id}/set-active`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'User-Id': userId,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response from backend:', errorText);

      try {
        const errorData = JSON.parse(errorText);
        return NextResponse.json(
          { error: errorData.error || 'Failed to set email as active' },
          { status: response.status }
        );
      } catch (e) {
        return NextResponse.json(
          { error: 'Failed to set email as active: ' + errorText },
          { status: response.status }
        );
      }
    }

    const data = await response.json();
    console.log('Successfully set email as active');

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error('Error in set-active email API route:', error);
    return NextResponse.json(
      { error: 'Failed to set email as active: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}

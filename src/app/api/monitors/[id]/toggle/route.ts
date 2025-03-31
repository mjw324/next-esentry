import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.BACKEND_API_URL || 'http://localhost:3000';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const userId = req.headers.get('user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { active } = body;

    console.log(`Toggling monitor ${id} to ${active ? 'active' : 'inactive'} for user ${userId}`);

    const response = await fetch(`${API_URL}/api/monitors/${id}/toggle`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'User-Id': userId,
      },
      body: JSON.stringify({ active, userId }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response from backend:', errorText);

      try {
        const errorData = JSON.parse(errorText);
        return NextResponse.json(
          { error: errorData.message || 'Failed to toggle monitor' },
          { status: response.status }
        );
      } catch (e) {
        return NextResponse.json(
          { error: 'Failed to toggle monitor: ' + errorText },
          { status: response.status }
        );
      }
    }

    const data = await response.json();
    console.log('Successfully toggled monitor:', data);

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error('Error in monitors toggle API route:', error);
    return NextResponse.json(
      { error: 'Failed to toggle monitor: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}

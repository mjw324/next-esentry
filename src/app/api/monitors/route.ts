import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.BACKEND_API_URL || 'http://localhost:3000';

export async function GET(req: NextRequest,) {
  try {
    const userId = req.headers.get('user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Fetching monitors for user:', userId);

    const response = await fetch(`${API_URL}/api/monitors`, {
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
          { error: errorData.message || 'Failed to fetch monitors' },
          { status: response.status }
        );
      } catch (e) {
        return NextResponse.json(
          { error: 'Failed to fetch monitors: ' + errorText },
          { status: response.status }
        );
      }
    }

    const data = await response.json();
    console.log('Successfully fetched monitors:', data);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in monitors GET API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch monitors: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    const dataWithUserId = { ...body, userId };
    console.log('Creating monitor with data:', dataWithUserId);

    const response = await fetch(`${API_URL}/api/monitors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Id': userId,
      },
      body: JSON.stringify(dataWithUserId),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response from backend:', errorText);

      try {
        const errorData = JSON.parse(errorText);
        return NextResponse.json(
          { error: errorData.message || 'Failed to create monitor' },
          { status: response.status }
        );
      } catch (e) {
        return NextResponse.json(
          { error: 'Failed to create monitor: ' + errorText },
          { status: response.status }
        );
      }
    }

    const data = await response.json();
    console.log('Successfully created monitor:', data);

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error('Error in monitors POST API route:', error);
    return NextResponse.json(
      { error: 'Failed to create monitor: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}

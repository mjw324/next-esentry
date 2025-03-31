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
    const dataWithUserId = { ...body, userId };

    console.log(`Updating monitor ${id} for user ${userId} with:`, dataWithUserId);

    const response = await fetch(`${API_URL}/api/monitors/${id}`, {
      method: 'PATCH',
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
          { error: errorData.message || 'Failed to update monitor' },
          { status: response.status }
        );
      } catch (e) {
        return NextResponse.json(
          { error: 'Failed to update monitor: ' + errorText },
          { status: response.status }
        );
      }
    }

    const data = await response.json();
    console.log('Successfully updated monitor:', data);

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error('Error in monitors PATCH API route:', error);
    return NextResponse.json(
      { error: 'Failed to update monitor: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const userId = req.headers.get('user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log(`Deleting monitor ${id} for user ${userId}`);

    const response = await fetch(`${API_URL}/api/monitors/${id}`, {
      method: 'DELETE',
      headers: {
        'User-Id': userId,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response from backend:', errorText);

      if (response.status === 204) {
        return new NextResponse(null, { status: 204 });
      }

      try {
        const errorData = JSON.parse(errorText);
        return NextResponse.json(
          { error: errorData.message || 'Failed to delete monitor' },
          { status: response.status }
        );
      } catch (e) {
        return NextResponse.json(
          { error: 'Failed to delete monitor: ' + errorText },
          { status: response.status }
        );
      }
    }

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json().catch(() => ({}));
    console.log('Successfully deleted monitor');

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error('Error in monitors DELETE API route:', error);
    return NextResponse.json(
      { error: 'Failed to delete monitor: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}

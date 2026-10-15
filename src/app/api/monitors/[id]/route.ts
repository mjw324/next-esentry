import { NextRequest, NextResponse } from 'next/server';
import { backendAuth } from '@/lib/backend-auth';

const API_URL = process.env.BACKEND_API_URL || 'http://localhost:3000';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const caller = await backendAuth(req);

    if (!caller) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = caller;

    const body = await req.json();

    console.log(`Updating monitor ${id} for user ${userId} with:`, body);

    const response = await fetch(`${API_URL}/api/monitors/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...caller.headers,
      },
      body: JSON.stringify(body),
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

    const caller = await backendAuth(req);

    if (!caller) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = caller;

    console.log(`Deleting monitor ${id} for user ${userId}`);

    const response = await fetch(`${API_URL}/api/monitors/${id}`, {
      method: 'DELETE',
      headers: {
        ...caller.headers,
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

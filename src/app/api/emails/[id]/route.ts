import { NextRequest, NextResponse } from 'next/server';
import { backendAuth } from '@/lib/backend-auth';

const API_URL = process.env.BACKEND_API_URL || 'http://localhost:3000';

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

    console.log(`Deleting alert email ${id} for user ${userId}`);

    const response = await fetch(`${API_URL}/api/emails/${id}`, {
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
          { error: errorData.error || 'Failed to delete alert email' },
          { status: response.status }
        );
      } catch (e) {
        return NextResponse.json(
          { error: 'Failed to delete alert email: ' + errorText },
          { status: response.status }
        );
      }
    }

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json().catch(() => ({}));
    console.log('Successfully deleted alert email');

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error('Error in emails DELETE API route:', error);
    return NextResponse.json(
      { error: 'Failed to delete alert email: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}

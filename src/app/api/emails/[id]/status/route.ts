import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.BACKEND_API_URL || 'http://localhost:3000';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const userId = req.headers.get('user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log(`Checking status for alert email ${id}`);

    const response = await fetch(`${API_URL}/api/emails/${id}/status`, {
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
          { error: errorData.error || 'Failed to get email status' },
          { status: response.status }
        );
      } catch (e) {
        return NextResponse.json(
          { error: 'Failed to get email status: ' + errorText },
          { status: response.status }
        );
      }
    }

    const data = await response.json();
    console.log('Successfully retrieved email status');

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error('Error in email status API route:', error);
    return NextResponse.json(
      { error: 'Failed to get email status: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}

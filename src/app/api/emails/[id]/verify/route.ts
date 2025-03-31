import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.BACKEND_API_URL || 'http://localhost:3000';

export async function POST(
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

    console.log(`Verifying alert email ${id} with OTP`);

    const response = await fetch(`${API_URL}/api/emails/${id}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Id': userId,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response from backend:', errorText);

      try {
        const errorData = JSON.parse(errorText);
        return NextResponse.json(
          { error: errorData.error || 'Failed to verify email' },
          { status: response.status }
        );
      } catch (e) {
        return NextResponse.json(
          { error: 'Failed to verify email: ' + errorText },
          { status: response.status }
        );
      }
    }

    const data = await response.json();
    console.log('Successfully verified email');

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error('Error in verify email API route:', error);
    return NextResponse.json(
      { error: 'Failed to verify email: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}

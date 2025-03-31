import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.BACKEND_API_URL || 'http://localhost:3001';

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    console.log(`Finding email for verification token`);

    const response = await fetch(`${API_URL}/api/emails/verify-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response from backend:', errorText);

      try {
        const errorData = JSON.parse(errorText);
        return NextResponse.json(
          { error: errorData.error || 'Invalid or expired token' },
          { status: response.status }
        );
      } catch (e) {
        return NextResponse.json(
          { error: 'Invalid or expired token: ' + errorText },
          { status: response.status }
        );
      }
    }

    const data = await response.json();
    console.log('Successfully found email for token');

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in check token API route:', error);
    return NextResponse.json(
      { error: 'Failed to check token: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}

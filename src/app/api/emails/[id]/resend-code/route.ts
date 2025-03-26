// app/api/emails/[id]/resend-code/route.ts
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.BACKEND_API_URL || 'http://localhost:3000';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get the ID from the route params
    const { id } = await params;

    // Get userId from request headers
    const userId = req.headers.get('user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log(`Resending verification code for alert email ${id}`);

    const response = await fetch(`${API_URL}/api/emails/${id}/resend-code`, {
      method: 'POST',
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
          { error: errorData.error || 'Failed to resend verification code' },
          { status: response.status }
        );
      } catch (e) {
        return NextResponse.json(
          { error: 'Failed to resend verification code: ' + errorText },
          { status: response.status }
        );
      }
    }

    const data = await response.json();
    console.log('Successfully resent verification code');

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error('Error in resend verification code API route:', error);
    return NextResponse.json(
      { error: 'Failed to resend verification code: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}

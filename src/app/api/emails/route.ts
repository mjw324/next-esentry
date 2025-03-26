// app/api/emails/route.ts
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.BACKEND_API_URL || 'http://localhost:3000';

export async function GET(req: NextRequest) {
  try {
    // Get userId from request headers (adjust based on how you're passing it)
    const userId = req.headers.get('user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Fetching alert emails for user:', userId);

    const response = await fetch(`${API_URL}/api/emails`, {
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
          { error: errorData.error || 'Failed to fetch alert emails' },
          { status: response.status }
        );
      } catch (e) {
        return NextResponse.json(
          { error: 'Failed to fetch alert emails: ' + errorText },
          { status: response.status }
        );
      }
    }

    const data = await response.json();
    console.log('Successfully fetched alert emails');

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in emails GET API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alert emails: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{}> }
) {
  try {
    // Get userId from request headers (adjust based on how you're passing it)
    const userId = req.headers.get('user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    console.log('Adding new alert email:', body.email);

    const response = await fetch(`${API_URL}/api/emails`, {
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
          { error: errorData.error || 'Failed to add alert email' },
          { status: response.status }
        );
      } catch (e) {
        return NextResponse.json(
          { error: 'Failed to add alert email: ' + errorText },
          { status: response.status }
        );
      }
    }

    const data = await response.json();
    console.log('Successfully added alert email');

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error('Error in emails POST API route:', error);
    return NextResponse.json(
      { error: 'Failed to add alert email: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}

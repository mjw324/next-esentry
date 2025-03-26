// app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const API_URL = process.env.BACKEND_API_URL || 'http://localhost:3000';

const emailSchema = z.object({
  email: z.string().email('Invalid email format'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate request body
    const validation = emailSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message || 'Invalid email address' },
        { status: 400 }
      );
    }
    
    console.log('Processing password reset request');

    const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response from backend:', errorText);

      try {
        const errorData = JSON.parse(errorText);
        return NextResponse.json(
          { error: errorData.error || 'Failed to process password reset' },
          { status: response.status }
        );
      } catch (e) {
        return NextResponse.json(
          { error: 'Failed to process password reset: ' + errorText },
          { status: response.status }
        );
      }
    }

    const data = await response.json();
    console.log('Successfully processed password reset request');

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error('Error in forgot-password API route:', error);
    return NextResponse.json(
      { error: 'Failed to process password reset: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}

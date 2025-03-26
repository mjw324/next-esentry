// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const API_URL = process.env.BACKEND_API_URL || 'http://localhost:3000';

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate request body
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message || 'Invalid login credentials' },
        { status: 400 }
      );
    }

    console.log('Processing login request');

    const response = await fetch(`${API_URL}/api/auth/login`, {
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
          { error: errorData.error || 'Login failed' },
          { status: response.status }
        );
      } catch (e) {
        return NextResponse.json(
          { error: 'Login failed: ' + errorText },
          { status: response.status }
        );
      }
    }

    const data = await response.json();
    console.log('Successfully authenticated user');

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error('Error in login API route:', error);
    return NextResponse.json(
      { error: 'Login failed: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}

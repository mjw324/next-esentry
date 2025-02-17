import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export default auth((req) => {
  // Get the pathname of the requested URL
  const { nextUrl } = req;

  // Skip middleware for static files and API routes
  if (
    nextUrl.pathname.includes('.') || // static files
    nextUrl.pathname.startsWith('/api/') || // API routes
    nextUrl.pathname.startsWith('/_next/') // Next.js internal routes
  ) {
    return NextResponse.next();
  }
})

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
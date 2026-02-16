import { NextRequest, NextResponse } from 'next/server';

// Simple middleware to handle API routes - this can be expanded later
export function middleware(request: NextRequest) {
  // For now, just allow all requests to continue
  // More sophisticated auth handling can be done on the client side
  return NextResponse.next();
}

// Apply middleware to specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
import { NextRequest, NextResponse } from 'next/server'
import { rateLimits, withRateLimit, createRateLimitResponse } from './src/lib/rate-limit'

export async function middleware(request: NextRequest) {
  // Clone the request headers and add custom headers for monitoring
  const requestHeaders = new Headers(request.headers)
  
  // Add request ID for better error tracking
  const requestId = crypto.randomUUID()
  requestHeaders.set('x-request-id', requestId)
  
  // Add timing information
  requestHeaders.set('x-request-start', Date.now().toString())
  
  // Apply rate limiting to API routes
  const pathname = request.nextUrl.pathname
  
  // Skip rate limiting if no Redis is configured (development)
  if (rateLimits) {
    let rateLimit = null
    
    // Choose appropriate rate limit based on the path
    if (pathname.startsWith('/api/jobs') && request.method === 'POST') {
      rateLimit = rateLimits.jobs
    } else if (pathname.startsWith('/api/contact')) {
      rateLimit = rateLimits.contact
    } else if (pathname.startsWith('/api/leads')) {
      rateLimit = rateLimits.leads
    } else if (pathname.startsWith('/api/admin')) {
      rateLimit = rateLimits.admin
    } else if (pathname.startsWith('/api/')) {
      rateLimit = rateLimits.general
    }
    
    // Apply rate limiting if applicable
    if (rateLimit) {
      const result = await withRateLimit(request, rateLimit)
      
      if (result && !result.success) {
        return createRateLimitResponse(result.limit, result.remaining, result.reset)
      }
      
      // Add rate limit headers to successful requests
      if (result) {
        requestHeaders.set('x-ratelimit-limit', result.limit.toString())
        requestHeaders.set('x-ratelimit-remaining', result.remaining.toString())
        requestHeaders.set('x-ratelimit-reset', result.reset.toISOString())
      }
    }
  }
  
  // Continue with the request
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    }
  })
  
  // Add response headers for monitoring
  response.headers.set('x-request-id', requestId)
  
  return response
}

export const config = {
  matcher: [
    // Match all request paths except static files and images
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

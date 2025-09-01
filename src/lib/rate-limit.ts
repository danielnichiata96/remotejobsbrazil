import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest } from "next/server";

// Initialize Redis connection
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : undefined;

// Rate limit configurations for different endpoints
export const rateLimits = redis ? {
  // API endpoints
  jobs: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 requests per minute
    analytics: true,
  }),
  
  contact: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 m"), // 5 contact submissions per minute
    analytics: true,
  }),
  
  leads: new Ratelimit({
    redis, 
    limiter: Ratelimit.slidingWindow(3, "1 m"), // 3 lead submissions per minute
    analytics: true,
  }),
  
  admin: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 m"), // 5 admin operations per minute
    analytics: true,
  }),

  // General API rate limit
  general: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(60, "1 m"), // 60 requests per minute for GET operations
    analytics: true,
  }),
} : null;

// Helper function to get client identifier
export function getClientIdentifier(request: NextRequest): string {
  // Try to get IP from various headers (Vercel, CloudFlare, etc.)
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  
  const ip = forwarded?.split(',')[0] || realIp || cfConnectingIp || 'unknown';
  
  // Include user agent for better identification
  const userAgent = request.headers.get("user-agent") || 'unknown';
  
  return `${ip}-${Buffer.from(userAgent).toString('base64').slice(0, 10)}`;
}

// Rate limiting wrapper for API routes
export async function withRateLimit(
  request: NextRequest,
  rateLimit: Ratelimit,
  identifier?: string
): Promise<{ success: boolean; limit: number; remaining: number; reset: Date } | null> {
  const clientId = identifier || getClientIdentifier(request);
  
  try {
    const result = await rateLimit.limit(clientId);
    
    return { 
      success: result.success, 
      limit: result.limit, 
      remaining: result.remaining, 
      reset: new Date(result.reset)
    };
  } catch (error) {
    console.warn('Rate limiting failed, allowing request:', error);
    // If rate limiting fails, return null to indicate no rate limiting
    return null;
  }
}

// Response helper for rate limit exceeded
export function createRateLimitResponse(limit: number, remaining: number, reset: Date) {
  return new Response(
    JSON.stringify({
      error: "Rate limit exceeded",
      message: `Too many requests. Limit: ${limit} requests per window.`,
      retryAfter: Math.ceil((reset.getTime() - Date.now()) / 1000),
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "X-RateLimit-Limit": limit.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
        "X-RateLimit-Reset": reset.toISOString(),
        "Retry-After": Math.ceil((reset.getTime() - Date.now()) / 1000).toString(),
      },
    }
  );
}

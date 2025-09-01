import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

export type ApiHandler = (
  request: NextRequest,
  context?: { params?: Record<string, unknown> }
) => Promise<NextResponse>;

export function withErrorHandling(handler: ApiHandler): ApiHandler {
  return async (request: NextRequest, context?: { params?: Record<string, unknown> }) => {
    try {
      return await handler(request, context);
    } catch (error) {
      console.error('API Error:', error);
      
      // Track error in Sentry
      Sentry.withScope((scope) => {
        scope.setTag('api', true);
        scope.setContext('request', {
          url: request.url,
          method: request.method,
          headers: Object.fromEntries(request.headers.entries()),
          params: context?.params,
        });
        Sentry.captureException(error);
      });

      // Return appropriate error response
      const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
      const statusCode = error instanceof Error && 'statusCode' in error 
        ? (error.statusCode as number) || 500 
        : 500;

      return NextResponse.json(
        { 
          error: errorMessage,
          code: 'API_ERROR',
          timestamp: new Date().toISOString(),
        },
        { status: statusCode }
      );
    }
  };
}

export function logApiCall(request: NextRequest, response: NextResponse) {
  const duration = Date.now() - parseInt(request.headers.get('x-request-start') || '0');
  
  console.log(`[API] ${request.method} ${request.url} - ${response.status} (${duration}ms)`);
  
  // Track performance in Sentry
  Sentry.addBreadcrumb({
    category: 'api',
    message: `${request.method} ${request.url}`,
    level: 'info',
    data: {
      status: response.status,
      duration,
    },
  });
}

// Client-side instrumentation entry for Next.js App Router
// This file initializes Sentry client config and exposes hooks Next.js expects
import * as Sentry from '@sentry/nextjs';

// Initialize Sentry client (migrated from sentry.client.config.ts)
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  debug: false,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0.1,
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  environment: process.env.NODE_ENV,
  initialScope: {
    tags: { component: 'remote-jobs-brazil', version: '1.1.0' },
  },
  beforeSend(event, hint) {
    if (event.exception) {
      const error = hint.originalException;
      if (error && typeof error === 'object' && 'message' in error) {
        const message = (error as Error).message;
        if (
          message?.includes('ChunkLoadError') ||
          message?.includes('Loading chunk') ||
          message?.includes('NetworkError')
        ) {
          return null;
        }
      }
    }
    return event;
  },
});

// Called by Next.js when a nested React server component throws during rendering
export function onRequestError(error: unknown) {
  try {
    Sentry.captureException(error);
  } catch {}
}

// Hook to instrument route transitions (used by Sentry to capture navigation spans)
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

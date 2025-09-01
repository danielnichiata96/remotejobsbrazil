import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Set tracesSampleRate to 1.0 to capture 100%
  // of the transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  debug: false,
  
  replaysOnErrorSampleRate: 1.0,
  
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production.
  replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0.1,

  // You can remove this option if you're not planning to use the Sentry Session Replay feature:
  integrations: [
    Sentry.replayIntegration({
      // Additional Replay configuration goes in here, for example:
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Environment configuration
  environment: process.env.NODE_ENV,
  
  // Add project-specific tags
  initialScope: {
    tags: {
      component: "remote-jobs-brazil",
      version: "1.1.0",
    },
  },

  // Filter out common non-error events
  beforeSend(event, hint) {
    // Don't send events for expected navigation errors
    if (event.exception) {
      const error = hint.originalException;
      if (error && typeof error === 'object' && 'message' in error) {
        const message = (error as Error).message;
        if (message?.includes('ChunkLoadError') || 
            message?.includes('Loading chunk') ||
            message?.includes('NetworkError')) {
          return null;
        }
      }
    }
    return event;
  },
});

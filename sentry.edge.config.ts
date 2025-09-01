import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  tracesSampleRate: 1.0,
  
  debug: false,
  
  environment: process.env.NODE_ENV,
  
  initialScope: {
    tags: {
      component: "remote-jobs-brazil-edge",
      version: "1.1.0",
    },
  },
});

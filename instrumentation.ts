export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}

// Optional: capture request errors at server layer as well
export async function onRequestError(error: unknown) {
  const Sentry = await import('@sentry/nextjs');
  try {
    Sentry.captureException(error);
  } catch {}
}

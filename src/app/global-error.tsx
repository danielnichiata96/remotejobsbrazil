"use client";
import { useEffect } from 'react';

export default function GlobalError({ error }: { error: Error }) {
  useEffect(() => {
    try {
      // Dynamically import Sentry on the client to avoid pulling server-only integrations (e.g., Prisma) into the bundle
      import('@sentry/nextjs')
        .then((Sentry) => {
          try { Sentry.captureException(error); } catch {}
        })
        .catch(() => {});
    } catch {}
  }, [error]);

  return (
    <html>
      <body>
        <div style={{padding: 40, textAlign: 'center'}}>
          <h1>Algo deu errado</h1>
          <p>Estamos trabalhando para corrigir. Tente novamente mais tarde.</p>
        </div>
      </body>
    </html>
  );
}

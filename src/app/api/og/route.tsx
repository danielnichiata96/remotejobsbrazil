import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get parameters from URL
    const title = searchParams.get('title') || 'Remote Jobs Brazil';
    const company = searchParams.get('company') || '';
    const location = searchParams.get('location') || 'Brazil (Remote)';
    const type = searchParams.get('type') || 'Full-time';
    const salary = searchParams.get('salary') || '';

    // Determine if it's a job page or homepage
    const isJob = searchParams.has('title') && searchParams.has('company');

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8fafc',
            backgroundImage: `linear-gradient(135deg, #009b3a 0%, #002776 100%)`,
            position: 'relative',
          }}
        >
          {/* Brazil flag accent */}
          <div
            style={{
              position: 'absolute',
              top: '0',
              right: '0',
              width: '200px',
              height: '200px',
              background: 'linear-gradient(45deg, #009b3a 33%, #ffdf00 33%, #ffdf00 66%, #002776 66%)',
              borderRadius: '0 0 0 200px',
              opacity: 0.1,
            }}
          />

          {/* Main content area */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
              borderRadius: '24px',
              padding: '60px',
              margin: '40px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              maxWidth: '900px',
              textAlign: 'center',
            }}
          >
            {isJob ? (
              // Job-specific OG image
              <>
                <div
                  style={{
                    fontSize: '24px',
                    color: '#64748b',
                    marginBottom: '16px',
                    fontWeight: 500,
                  }}
                >
                  {company}
                </div>
                
                <div
                  style={{
                    fontSize: '56px',
                    fontWeight: 800,
                    color: '#0f172a',
                    lineHeight: '1.2',
                    marginBottom: '24px',
                    maxWidth: '800px',
                  }}
                >
                  {title}
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: '32px',
                    fontSize: '20px',
                    color: '#475569',
                    marginBottom: '32px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    📍 {location}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    💼 {type}
                  </div>
                  {salary && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      💰 {salary}
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Homepage OG image
              <>
                <div
                  style={{
                    fontSize: '72px',
                    fontWeight: 900,
                    color: '#0f172a',
                    lineHeight: '1.1',
                    marginBottom: '24px',
                  }}
                >
                  Remote Jobs Brazil 🇧🇷
                </div>
                
                <div
                  style={{
                    fontSize: '28px',
                    color: '#64748b',
                    marginBottom: '32px',
                    lineHeight: '1.4',
                  }}
                >
                  100% remote opportunities for Brazilian developers
                </div>
              </>
            )}

            {/* Footer brand */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 24px',
                backgroundColor: '#f1f5f9',
                borderRadius: '12px',
                fontSize: '18px',
                color: '#475569',
                fontWeight: 600,
              }}
            >
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: '#009b3a',
                }}
              />
              RemoteJobsBrazil.com
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: unknown) {
    console.log(`${e instanceof Error ? e.message : 'Unknown error'}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}

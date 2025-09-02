import { describe, it, expect } from 'vitest';
import { calculateJobScore } from '@/lib/scoring';

const baseJob = {
  title: 'Software Engineer',
  company: 'Remote Friendly Co',
  location: 'LATAM (Remote)',
  description: 'Fully remote role across LATAM. We hire in Latin America and support remote work. English required.',
  applyUrl: 'https://example.com',
};

describe('scoring penalties for NORAM and non-Brazil LATAM specifics', () => {
  it('downranks NORAM roles vs LATAM baseline', () => {
    const baseline = calculateJobScore(baseJob).score;

    const noramJob = {
      ...baseJob,
      location: 'NORAM (Remote)',
      description: baseJob.description + ' NORAM only.',
    };

    const noramScore = calculateJobScore(noramJob).score;
    expect(noramScore).toBeLessThan(baseline);
  });

  it('downranks country-specific LATAM (Argentina) when Brazil is not mentioned', () => {
    const baseline = calculateJobScore(baseJob).score;

    const argentinaJob = {
      ...baseJob,
      location: 'Argentina (Remote)',
      // keep LATAM mention so it remains brazil-friendly but without Brazil mention
      description: 'Remote across LATAM, role based in Argentina.',
    };

    const argScore = calculateJobScore(argentinaJob).score;
    expect(argScore).toBeLessThan(baseline);
  });
  
  it('treats worldwide/anywhere as a softer penalty than non-brazil-friendly', () => {
    const worldwideJob = {
      ...baseJob,
      location: 'Worldwide (Remote)',
      description: 'Work from anywhere. Fully remote worldwide.',
    };

    const nonFriendlyRemote = {
      ...baseJob,
      location: 'Remote',
  description: 'Remote position. No regional hints or time zone details.',
    };

    const worldwideScore = calculateJobScore(worldwideJob).score;
    const nonFriendlyScore = calculateJobScore(nonFriendlyRemote).score;

    // worldwide should be higher than a plain remote with no brazil-friendly hints
    expect(worldwideScore).toBeGreaterThan(nonFriendlyScore);

    // but still less than LATAM baseline
    const baseline = calculateJobScore(baseJob).score;
    expect(worldwideScore).toBeLessThan(baseline);
  });
});

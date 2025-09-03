import { describe, it, expect } from 'vitest';
import { type Job, getCompanyDomain, getLogoCandidates } from '@/lib/jobs.shared';

function makeJob(partial: Partial<Job> = {}): Job {
  return {
    id: 'id1',
    title: partial.title || 'Engenheiro Frontend',
    company: partial.company || 'Acme Inc',
    location: partial.location || 'Brazil (Remote)',
    applyUrl: partial.applyUrl || 'https://careers.acme.com/jobs/123',
    createdAt: partial.createdAt || new Date().toISOString(),
    source: partial.source || 'manual',
    ...partial,
  } as Job;
}

describe('getCompanyDomain', () => {
  it('extrai domínio do applyUrl', () => {
  // Use a non-excluded domain to validate extraction
  const job = makeJob({ applyUrl: 'https://careers.acme.com/positions/1' });
  expect(getCompanyDomain(job)).toBe('careers.acme.com');
  });

  it('usa originalUrl quando disponível', () => {
    const job = makeJob({ applyUrl: 'https://greenhouse.io/acme/123', originalUrl: 'https://acme.com/careers/123' });
    expect(getCompanyDomain(job)).toBe('acme.com');
  });

  it('remove www. do host', () => {
    const job = makeJob({ applyUrl: 'https://www.example.org/path' });
    expect(getCompanyDomain(job)).toBe('example.org');
  });

  it('retorna undefined para URLs inválidas', () => {
    const job = makeJob({ applyUrl: 'notaurl' });
    expect(getCompanyDomain(job)).toBeUndefined();
  });

  it('ignora ATS conhecidos como greenhouse/lever (retorna undefined sem originalUrl)', () => {
    const gh = makeJob({ applyUrl: 'https://boards.greenhouse.io/remotecom/jobs/123' });
    expect(getCompanyDomain(gh)).toBeUndefined();
    const lever = makeJob({ applyUrl: 'https://jobs.lever.co/remotecom/123' });
    expect(getCompanyDomain(lever)).toBeUndefined();
  });

  it('ignora subdomínios de ATS (boards.eu.greenhouse.io)', () => {
    const job = makeJob({ applyUrl: 'https://boards.eu.greenhouse.io/remotecom/jobs/123' });
    expect(getCompanyDomain(job)).toBeUndefined();
  });

  it('extrai domínio real a partir da descrição quando apply/original são ATS', () => {
    const job = makeJob({
      applyUrl: 'https://boards.greenhouse.io/remotecom/jobs/123',
      originalUrl: 'https://boards.greenhouse.io/remotecom/jobs/123',
      description: 'Conheça nossa cultura em https://remote.com/async e vagas em https://remote.com/careers',
    });
    expect(getCompanyDomain(job)).toBe('remote.com');
  });
});

describe('getLogoCandidates', () => {
  it('prioriza logoUrl curado', () => {
    const job = makeJob({ logoUrl: 'https://cdn.example.com/logo.png' });
    const c = getLogoCandidates(job);
    expect(c[0]).toBe('https://cdn.example.com/logo.png');
  });

  it('gera candidatos a partir do domínio', () => {
    const job = makeJob({ applyUrl: 'https://careers.acme.com/openings/1' });
    const c = getLogoCandidates(job);
    expect(c[0]).toMatch(/logo\.clearbit\.com\/careers\.acme\.com/);
    expect(c[1]).toMatch(/icons\.duckduckgo\.com\/ip3\/careers\.acme\.com/);
  // Accept additional favicon fallbacks when available
  // c[2+] may include https://careers.acme.com/favicon.{ico,png,svg}
  });

  it('retorna vazio quando não há como inferir domínio', () => {
    const job = makeJob({ applyUrl: 'notaurl' });
    const c = getLogoCandidates(job);
    expect(c.length).toBe(0);
  });

  it('não gera candidatos para hosts excluídos (ex: example.com, greenhouse)', () => {
    const placeholder = makeJob({ applyUrl: 'https://example.com/foo' });
    expect(getLogoCandidates(placeholder)).toEqual([]);
    const gh = makeJob({ applyUrl: 'https://boards.greenhouse.io/remotecom/jobs/123' });
    expect(getLogoCandidates(gh)).toEqual([]);
  });
});

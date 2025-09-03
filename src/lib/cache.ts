import { revalidateTag, revalidatePath, unstable_cache as cache } from 'next/cache';
import { readJobs } from '@/lib/jobs';
import type { Job } from '@/lib/jobs.shared';
import { getCompanyDomain } from '@/lib/jobs.shared';

// Cache tags for different data types
export const CACHE_TAGS = {
  JOBS: 'jobs',
  LEADS: 'leads',
  HOMEPAGE: 'homepage',
  LANDING_PAGES: 'landing-pages',
} as const;

// Cached readers tagged by JOBS, so revalidateTag('jobs') refreshes sitemap/feeds and lists
function makeReadJobsCached() {
  // In tests or outside Next runtime, return non-cached reader to avoid incrementalCache errors
  if (process.env.NODE_ENV === 'test' || !process.env.NEXT_RUNTIME) {
    return async (): Promise<Job[]> => {
      return await readJobs();
    };
  }
  return cache(
    async (): Promise<Job[]> => {
      const jobs = await readJobs();
      return jobs;
    },
    ['read-jobs'],
    { tags: [CACHE_TAGS.JOBS] }
  );
}

export const readJobsCached = makeReadJobsCached();

// Lightweight cached reader for UI lists/sitemap to stay under Next's 2MB cache entry limit
function makeReadJobsLightCached() {
  if (process.env.NODE_ENV === 'test' || !process.env.NEXT_RUNTIME) {
    return async (): Promise<Job[]> => {
      const jobs = await readJobs();
      // Strip heavy fields like descriptions/notes to reduce cache size
    return jobs.map((j) => ({
        id: j.id,
        title: j.title,
        company: j.company,
        location: j.location,
        type: j.type,
  logoUrl: j.logoUrl,
  companyDomain: getCompanyDomain(j),
  originalUrl: j.originalUrl,
        applyUrl: j.applyUrl,
        createdAt: j.createdAt,
        updatedAt: j.updatedAt,
        slug: j.slug,
        tags: j.tags,
        status: j.status,
        isFeatured: j.isFeatured,
        roleCategory: j.roleCategory,
        source: j.source,
      } as Job));
    };
  }
  return cache(
    async (): Promise<Job[]> => {
      const jobs = await readJobs();
    return jobs.map((j) => ({
        id: j.id,
        title: j.title,
        company: j.company,
        location: j.location,
        type: j.type,
  logoUrl: j.logoUrl,
  companyDomain: getCompanyDomain(j),
  originalUrl: j.originalUrl,
        applyUrl: j.applyUrl,
        createdAt: j.createdAt,
        updatedAt: j.updatedAt,
        slug: j.slug,
        tags: j.tags,
        status: j.status,
        isFeatured: j.isFeatured,
        roleCategory: j.roleCategory,
        source: j.source,
      } as Job));
    },
  ['read-jobs-light-v2'],
    { tags: [CACHE_TAGS.JOBS] }
  );
}

export const readJobsLightCached = makeReadJobsLightCached();

// Non-cached passthrough (useful for small responses like RSS feeds)
export async function readJobsDirect(): Promise<Job[]> {
  return await readJobs();
}

// Revalidate jobs-related caches
export async function revalidateJobs() {
  // Skip revalidation during testing or if not in Next.js runtime
  if (process.env.NODE_ENV === 'test' || !process.env.NEXT_RUNTIME) {
    return { success: true, skipped: true };
  }

  try {
    // Revalidate specific paths
    revalidatePath('/');
    revalidatePath('/remote-react-jobs-brazil');
    revalidatePath('/remote-node-jobs-brazil');
    revalidatePath('/remote-qa-jobs-brazil');
    revalidatePath('/sitemap.xml');
    revalidatePath('/feed.xml');
    revalidatePath('/feed/react.xml');
    revalidatePath('/feed/node.xml');
    revalidatePath('/feed/qa.xml');
    
    // Revalidate by tags
    revalidateTag(CACHE_TAGS.JOBS);
    revalidateTag(CACHE_TAGS.HOMEPAGE);
    revalidateTag(CACHE_TAGS.LANDING_PAGES);
    
    console.log('Cache revalidated successfully');
    return { success: true };
  } catch (error) {
    console.error('Cache revalidation failed:', error);
    return { success: false, error };
  }
}

// Revalidate leads-related caches
export async function revalidateLeads() {
  try {
    revalidatePath('/admin/leads');
    revalidateTag(CACHE_TAGS.LEADS);
    
    console.log('Leads cache revalidated successfully');
    return { success: true };
  } catch (error) {
    console.error('Leads cache revalidation failed:', error);
    return { success: false, error };
  }
}

// Manual cache busting endpoint - useful for testing
export function createRevalidateResponse(paths: string[], tags: string[] = []) {
  try {
    paths.forEach(path => revalidatePath(path));
    tags.forEach(tag => revalidateTag(tag));
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Cache revalidated',
        paths,
        tags,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

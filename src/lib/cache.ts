import { revalidateTag, revalidatePath } from 'next/cache';

// Cache tags for different data types
export const CACHE_TAGS = {
  JOBS: 'jobs',
  LEADS: 'leads',
  HOMEPAGE: 'homepage',
  LANDING_PAGES: 'landing-pages',
} as const;

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
    revalidatePath('/api/jobs');
    
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

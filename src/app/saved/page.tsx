import { readJobs } from '@/lib/jobs';
import BookmarkedJobsList from '../../components/BookmarkedJobsList';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

export const metadata = {
  title: 'Vagas Salvas | Remote Jobs Brazil',
  description: 'Suas vagas remotas favoritas salvas para consultar depois',
};

export default async function SavedJobsPage() {
  const jobs = await readJobs();
  
  return (
    <>
      <SiteHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              ⭐ Vagas Salvas
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Suas oportunidades remotas favoritas em um só lugar
            </p>
          </div>
          
          <BookmarkedJobsList allJobs={jobs} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

'use client';

import Link from 'next/link';
import { Job } from '@/lib/jobs.shared';
import { useBookmarks } from '@/hooks/useBookmarks';
import JobList from './JobList';

interface BookmarkedJobsListProps {
  allJobs: Job[];
}

export default function BookmarkedJobsList({ allJobs }: BookmarkedJobsListProps) {
  const { getBookmarkedJobs, totalBookmarks } = useBookmarks();
  
  const bookmarkedJobs = getBookmarkedJobs(allJobs);
  
  if (totalBookmarks === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📋</div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Nenhuma vaga salva ainda
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Navegue pelas vagas e clique no ícone ⭐ para salvar suas favoritas
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          🔍 Explorar Vagas
        </Link>
      </div>
    );
  }
  
  if (bookmarkedJobs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⏳</div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Carregando vagas salvas...
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Você tem {totalBookmarks} {totalBookmarks === 1 ? 'vaga salva' : 'vagas salvas'}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-blue-800 dark:text-blue-200">
          📊 <strong>{bookmarkedJobs.length}</strong> {bookmarkedJobs.length === 1 ? 'vaga salva' : 'vagas salvas'}
        </p>
      </div>
      
      <JobList jobs={bookmarkedJobs} />
    </div>
  );
}

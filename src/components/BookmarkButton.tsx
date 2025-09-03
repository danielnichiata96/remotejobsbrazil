'use client';

import { useBookmarks } from '@/hooks/useBookmarks';

interface BookmarkButtonProps {
  jobId: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button';
}

export default function BookmarkButton({ 
  jobId, 
  size = 'md',
  variant = 'icon'
}: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  
  const bookmarked = isBookmarked(jobId);
  
  const sizeClasses = {
    sm: 'w-4 h-4 text-sm',
    md: 'w-5 h-5 text-base', 
    lg: 'w-6 h-6 text-lg'
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(jobId);
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        className={`${sizeClasses[size]} text-gray-400 hover:text-yellow-500 transition-colors duration-200 ${
          bookmarked ? 'text-yellow-500' : ''
        }`}
        title={bookmarked ? 'Remover dos salvos' : 'Salvar vaga'}
        aria-label={bookmarked ? 'Remover dos salvos' : 'Salvar vaga'}
      >
        {bookmarked ? '★' : '☆'}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm transition-colors duration-200 ${
        bookmarked 
          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
          : 'bg-gray-100 text-gray-600 hover:bg-yellow-50 hover:text-yellow-600'
      }`}
    >
      <span className={sizeClasses[size]}>
        {bookmarked ? '★' : '☆'}
      </span>
      <span>
        {bookmarked ? 'Salva' : 'Salvar'}
      </span>
    </button>
  );
}

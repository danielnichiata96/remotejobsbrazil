'use client';

import { useState, useEffect } from 'react';
import { Job } from '@/lib/jobs.shared';

const BOOKMARKS_KEY = 'remote-jobs-brazil-bookmarks';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(BOOKMARKS_KEY);
      if (saved) {
        try {
          setBookmarks(JSON.parse(saved));
        } catch (error) {
          console.error('Failed to parse bookmarks:', error);
          localStorage.removeItem(BOOKMARKS_KEY);
        }
      }
    }
  }, []);

  const addBookmark = (jobId: string) => {
    const newBookmarks = [...bookmarks, jobId];
    setBookmarks(newBookmarks);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(newBookmarks));
  };

  const removeBookmark = (jobId: string) => {
    const newBookmarks = bookmarks.filter(id => id !== jobId);
    setBookmarks(newBookmarks);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(newBookmarks));
  };

  const toggleBookmark = (jobId: string) => {
    if (bookmarks.includes(jobId)) {
      removeBookmark(jobId);
    } else {
      addBookmark(jobId);
    }
  };

  const isBookmarked = (jobId: string) => bookmarks.includes(jobId);

  const getBookmarkedJobs = (allJobs: Job[]) => {
    return allJobs.filter(job => bookmarks.includes(job.id));
  };

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isBookmarked,
    getBookmarkedJobs,
    totalBookmarks: bookmarks.length,
  };
}

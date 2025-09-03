"use client";
import React from "react";

type Props = {
  url: string;
  job: {
    id: string;
    company: string;
    title: string;
    roleCategory?: string;
  };
  className?: string;
  children?: React.ReactNode;
};

function withUtm(url: string): string {
  try {
    const u = new URL(url);
    if (!u.searchParams.get('utm_source')) u.searchParams.set('utm_source', 'remotejobsbrazil');
    if (!u.searchParams.get('utm_medium')) u.searchParams.set('utm_medium', 'job_board');
    if (!u.searchParams.get('utm_campaign')) u.searchParams.set('utm_campaign', 'apply_button');
    return u.toString();
  } catch {
    return url;
  }
}

export function ApplyButton({ url, job, className, children }: Props) {
  const href = withUtm(url);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        try {
          import("@vercel/analytics")
            .then(({ track }) => {
              try {
                track("apply_click", {
                  job_id: job.id,
                  company: job.company,
                  title: job.title,
                  roleCategory: job.roleCategory || "unknown",
                });
              } catch {}
            })
            .catch(() => {});
        } catch {}
      }}
      className={className}
    >
      {children ?? "Apply →"}
    </a>
  );
}

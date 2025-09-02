"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { Job } from "@/lib/jobs.shared";
import { getLogoCandidates } from "@/lib/jobs.shared";

type Props = {
  job: Job;
  size?: number; // edge size in px
  className?: string;
  alt?: string;
};

export function CompanyLogo({ job, size = 32, className = "", alt }: Props) {
  const [src, setSrc] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<string[]>([]);

  useEffect(() => {
    const list = getLogoCandidates(job);
    setCandidates(list);
    setSrc(list[0] || null);
  }, [job]);

  if (!src) {
    return (
      <div
        aria-hidden
        className={`inline-flex items-center justify-center rounded-md bg-[var(--color-muted)] text-[var(--color-foreground)]/60 ${className}`}
        style={{ width: size, height: size }}
      >
        {job.company?.[0]?.toUpperCase() || "?"}
      </div>
    );
  }

  const onError = () => {
    if (!candidates.length) return setSrc(null);
    const [, ...rest] = candidates;
    setCandidates(rest);
    setSrc(rest[0] || null);
  };

  return (
    <Image
      src={src}
      alt={alt || `${job.company} logo`}
      width={size}
      height={size}
      className={`rounded-md object-contain bg-white ${className}`}
      onError={onError}
    />
  );
}

import { cn } from "@/lib/cn";
import React from "react";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
  "bg-[var(--color-muted)] text-[var(--color-foreground)]/80 border border-[var(--color-border)]",
        className
      )}
      {...props}
    />
  );
}

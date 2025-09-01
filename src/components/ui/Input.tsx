import { cn } from "@/lib/cn";
import React from "react";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={cn(
  "rounded-md px-3 py-2 focus:outline-none",
  "bg-[var(--color-surface)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)]/80",
  "border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-accent)]",
        className
      )}
      {...props}
    />
  );
});

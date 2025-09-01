import { cn } from "@/lib/cn";
import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "accent" | "ghost";
  size?: "sm" | "md" | "lg";
};

export function Button({ className, variant = "primary", size = "md", ...props }: Props) {
  const base = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
  } as const;
  const variants = {
    primary: "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:brightness-95 focus:ring-[var(--color-primary)]",
    secondary: "bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)] hover:brightness-95 focus:ring-[var(--color-secondary)]",
    accent: "bg-[var(--color-accent)] text-[var(--color-accent-foreground)] hover:brightness-95 focus:ring-[var(--color-accent)]",
    ghost: "bg-transparent hover:bg-[var(--color-muted)] text-inherit",
  } as const;
  return <button className={cn(base, sizes[size], variants[variant], className)} {...props} />;
}

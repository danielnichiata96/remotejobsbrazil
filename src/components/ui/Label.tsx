import { cn } from "@/lib/cn";
import React from "react";

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("text-sm font-medium text-[var(--color-foreground)]/90", className)} {...props} />;
}

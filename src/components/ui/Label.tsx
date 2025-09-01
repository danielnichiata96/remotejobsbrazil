import { cn } from "@/lib/cn";
import React from "react";

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("text-sm font-medium text-gray-900 dark:text-gray-100", className)} {...props} />;
}

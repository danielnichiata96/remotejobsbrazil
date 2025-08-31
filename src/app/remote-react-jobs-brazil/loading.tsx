import { LoadingSkeleton } from "@/components/LoadingSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="h-8 w-80 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse" />
        <LoadingSkeleton rows={5} />
      </div>
    </div>
  );
}

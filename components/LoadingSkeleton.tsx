import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
}

export function LoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted',
        className
      )}
      role="status"
      aria-label="Loading..."
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <LoadingSkeleton className="h-6 w-1/3" />
      <LoadingSkeleton className="h-4 w-full" />
      <LoadingSkeleton className="h-4 w-5/6" />
      <LoadingSkeleton className="h-4 w-4/5" />
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      <div className="space-y-3">
        <LoadingSkeleton className="h-10 w-1/2" />
        <LoadingSkeleton className="h-5 w-3/4" />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}

export function TranslatorSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-3">
          <LoadingSkeleton className="h-9 w-64 mx-auto" />
          <LoadingSkeleton className="h-5 w-[min(520px,90%)] mx-auto" />
        </div>
        <div className="rounded-lg border bg-card p-6 space-y-4">
          <LoadingSkeleton className="h-6 w-48" />
          <LoadingSkeleton className="h-36 w-full" />
          <div className="flex flex-wrap gap-2">
            <LoadingSkeleton className="h-10 w-28" />
            <LoadingSkeleton className="h-10 w-28" />
            <LoadingSkeleton className="h-10 w-28" />
          </div>
        </div>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    </div>
  );
}

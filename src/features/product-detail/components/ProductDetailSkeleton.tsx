import { Skeleton } from '@/components/ui/Skeleton'

/**
 * Full-page detail skeleton mirroring ProductInfo's two-column layout.
 * Doubles as the Suspense fallback while the lazy route chunk loads, so chunk
 * loading and data loading present as one continuous state.
 */
export function ProductDetailSkeleton() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8" aria-busy="true">
      <Skeleton className="h-5 w-36" />
      <div className="mt-4 grid gap-8 md:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-lg" />
        <div>
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-3 h-8 w-3/4" />
          <Skeleton className="mt-3 h-5 w-40" />
          <Skeleton className="mt-4 h-9 w-32" />
          <div className="mt-6 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="mt-6 space-y-2 pt-4">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      </div>
    </main>
  )
}

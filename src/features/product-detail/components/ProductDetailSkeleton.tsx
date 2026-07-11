import { Skeleton } from '@/components/ui/Skeleton'
import { Header } from '@/components/ui/Header'

/**
 * Full-page detail skeleton mirroring ProductInfo's three-column layout.
 * Doubles as the Suspense fallback while the lazy route chunk loads, so chunk
 * loading and data loading present as one continuous state.
 */
export function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100/60 flex flex-col pb-12">
      <Header />
      <main
        className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex-1 w-full animate-fade-in-up"
        aria-busy="true"
      >
        {/* Back button placeholder skeleton */}
        <Skeleton className="h-9 w-36 rounded-full animate-shimmer" />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Column 1: Image Gallery skeleton */}
          <div className="lg:col-span-5 space-y-4">
            <Skeleton className="aspect-square w-full rounded-2xl animate-shimmer" />
            <div className="flex justify-center gap-2.5">
              <Skeleton className="h-16 w-16 rounded-lg animate-shimmer" />
              <Skeleton className="h-16 w-16 rounded-lg animate-shimmer" />
              <Skeleton className="h-16 w-16 rounded-lg animate-shimmer" />
            </div>
          </div>

          {/* Column 2: Product Core Info skeleton */}
          <div className="lg:col-span-4 space-y-5">
            <div>
              <Skeleton className="h-3 w-16 animate-shimmer" />
              <Skeleton className="mt-2.5 h-8 w-11/12 animate-shimmer" />
              <Skeleton className="mt-2 h-4 w-1/3 animate-shimmer" />
            </div>
            <hr className="border-gray-200" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-1/2 animate-shimmer" />
              <Skeleton className="h-3 w-1/3 animate-shimmer" />
            </div>
            <div className="space-y-2.5">
              <Skeleton className="h-3 w-full animate-shimmer" />
              <Skeleton className="h-3 w-full animate-shimmer" />
              <Skeleton className="h-3 w-4/5 animate-shimmer" />
            </div>
            <hr className="border-gray-200" />
            <div className="space-y-3">
              <Skeleton className="h-3 w-1/3 animate-shimmer" />
              <div className="rounded-xl bg-gray-50 p-4 border border-gray-100 space-y-2.5">
                <Skeleton className="h-3.5 w-11/12 animate-shimmer" />
                <Skeleton className="h-3.5 w-5/6 animate-shimmer" />
                <Skeleton className="h-3.5 w-3/4 animate-shimmer" />
              </div>
            </div>
          </div>

          {/* Column 3: E-commerce Buy Box skeleton */}
          <div className="lg:col-span-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs space-y-4">
            <div className="space-y-1">
              <Skeleton className="h-3 w-1/3 animate-shimmer" />
              <Skeleton className="h-8 w-1/2 animate-shimmer" />
            </div>
            <Skeleton className="h-4.5 w-2/3 animate-shimmer" />
            <div className="rounded-xl bg-gray-50/50 p-3 border border-gray-100 space-y-2">
              <Skeleton className="h-3.5 w-full animate-shimmer" />
              <Skeleton className="h-3.5 w-11/12 animate-shimmer" />
              <Skeleton className="h-3.5 w-1/2 animate-shimmer" />
            </div>
            <div className="space-y-2.5 pt-2">
              <Skeleton className="h-10 w-full rounded-full animate-shimmer" />
              <Skeleton className="h-10 w-full rounded-full animate-shimmer" />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

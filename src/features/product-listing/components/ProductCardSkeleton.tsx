import { Skeleton } from '@/components/ui/Skeleton'

/** Occupies the exact grid slot of a ProductCard so loading → loaded causes no layout shift. */
export function ProductCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <Skeleton className="aspect-square w-full rounded-b-none" />
      <div className="flex flex-col gap-2.5 p-4">
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-4 w-2/3 mt-1" />
        <Skeleton className="mt-3.5 h-7 w-2/5" />
      </div>
    </div>
  )
}

import { Skeleton } from '@/components/ui/Skeleton'

/** Occupies the exact grid slot of a ProductCard so loading → loaded causes no layout shift. */
export function ProductCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="flex flex-col gap-2 p-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="mt-2 h-6 w-1/3" />
      </div>
    </div>
  )
}

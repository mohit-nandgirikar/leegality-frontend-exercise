interface SkeletonProps {
  className?: string
}

/** Base shimmer block; feature skeletons compose it into layout-matching shapes. */
export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded bg-gray-200 motion-reduce:animate-none ${className}`}
    />
  )
}

interface SkeletonProps {
  className?: string
}

/** Base swiping shimmer block; feature skeletons compose it into layout-matching shapes. */
export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`animate-shimmer rounded-lg bg-gray-200/40 motion-reduce:animate-none ${className}`}
    />
  )
}

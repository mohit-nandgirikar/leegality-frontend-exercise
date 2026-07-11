interface RatingStarsProps {
  /** Rating on a 0–5 scale. */
  rating: number
}

function StarIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`h-3.5 w-3.5 shrink-0 ${className}`}
    >
      <path
        fillRule="evenodd"
        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

/** Fractional star display: a colored overlay clipped to the rating percentage. */
export function RatingStars({ rating }: RatingStarsProps) {
  const clamped = Math.min(Math.max(rating, 0), 5)
  const percentage = (clamped / 5) * 100

  return (
    <div
      className="inline-flex items-center gap-1.5 select-none"
      role="img"
      aria-label={`Rated ${clamped.toFixed(1)} out of 5`}
    >
      <div className="relative flex items-center gap-0.5 text-gray-200" aria-hidden="true">
        <StarIcon />
        <StarIcon />
        <StarIcon />
        <StarIcon />
        <StarIcon />
        <div
          className="absolute inset-y-0 left-0 flex items-center gap-0.5 overflow-hidden whitespace-nowrap text-[#f5a623]"
          style={{ width: `${percentage}%` }}
        >
          <StarIcon />
          <StarIcon />
          <StarIcon />
          <StarIcon />
          <StarIcon />
        </div>
      </div>
      <span className="text-[12px] font-bold text-gray-500 font-sans" aria-hidden="true">
        ({clamped.toFixed(1)})
      </span>
    </div>
  )
}

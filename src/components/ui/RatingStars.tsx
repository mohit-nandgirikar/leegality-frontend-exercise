interface RatingStarsProps {
  /** Rating on a 0–5 scale. */
  rating: number
}

const STARS = '★★★★★'

/** Fractional star display: a colored overlay clipped to the rating percentage. */
export function RatingStars({ rating }: RatingStarsProps) {
  const clamped = Math.min(Math.max(rating, 0), 5)
  const percentage = (clamped / 5) * 100

  return (
    <span
      className="inline-flex items-center gap-1.5"
      role="img"
      aria-label={`Rated ${clamped.toFixed(1)} out of 5`}
    >
      <span className="relative leading-none text-gray-300" aria-hidden="true">
        {STARS}
        <span
          className="absolute inset-0 overflow-hidden whitespace-nowrap text-amber-500"
          style={{ width: `${percentage}%` }}
        >
          {STARS}
        </span>
      </span>
      <span className="text-sm text-gray-600" aria-hidden="true">
        {clamped.toFixed(1)}
      </span>
    </span>
  )
}

import type { SyntheticEvent } from 'react'
import { FALLBACK_IMAGE_SRC } from '@/constants'

/** Swaps a broken product image for the neutral placeholder (fires at most once). */
export function handleImageError(event: SyntheticEvent<HTMLImageElement>) {
  event.currentTarget.onerror = null
  event.currentTarget.src = FALLBACK_IMAGE_SRC
}

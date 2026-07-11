/** DummyJSON prices are USD. */
const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export function formatPrice(amount: number): string {
  return usdFormatter.format(amount)
}

/** Category slug → display name, e.g. "mens-shirts" → "Mens Shirts". */
export function formatCategoryName(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

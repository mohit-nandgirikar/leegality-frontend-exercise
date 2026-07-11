import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import type { ProductSummary } from '@/types/product'
import { ProductCard } from './ProductCard'

const product: ProductSummary = {
  id: 42,
  title: 'Annibale Colombo Bed',
  category: 'furniture',
  price: 1899.99,
  rating: 4.8,
  brand: 'Annibale Colombo',
  thumbnail: 'https://example.com/bed.jpg',
}

function renderCard() {
  return render(
    <MemoryRouter>
      <ProductCard product={product} />
    </MemoryRouter>,
  )
}

describe('ProductCard', () => {
  it('links the whole card to the product detail page', () => {
    renderCard()
    expect(screen.getByRole('link')).toHaveAttribute('href', '/product/42')
  })

  it('shows title, formatted price, and accessible rating', () => {
    renderCard()
    expect(screen.getByText('Annibale Colombo Bed')).toBeInTheDocument()
    expect(screen.getByText('$1,899.99')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Rated 4.8 out of 5' })).toBeInTheDocument()
  })

  it('lazy-loads the product image with the title as alt text', () => {
    renderCard()
    const image = screen.getByAltText('Annibale Colombo Bed')
    expect(image).toHaveAttribute('loading', 'lazy')
    expect(image).toHaveAttribute('src', product.thumbnail)
  })
})

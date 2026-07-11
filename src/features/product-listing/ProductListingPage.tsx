import { useState } from 'react'
import { useProduct } from '@/features/product-detail/hooks/useProduct'
import { useCategories } from './hooks/useCategories'
import { useProducts } from './hooks/useProducts'

const DEBUG_CATEGORIES = [null, 'smartphones', 'furniture', 'groceries'] as const

/**
 * Phase 1 verification panel — throwaway debug render exercising the data
 * hooks (fetch, abort, cache). Replaced by the real listing UI in Phase 2.
 */
export default function ProductListingPage() {
  const [category, setCategory] = useState<string | null>(null)
  const products = useProducts(category)
  const categories = useCategories()
  const sampleProduct = useProduct('1')

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Product Catalog</h1>
      <p className="mt-1 text-sm text-gray-500">Phase 1 verification — replaced in Phase 2.</p>

      <section className="mt-6 rounded border border-gray-200 bg-white p-4">
        <h2 className="font-medium">useProducts({category === null ? 'all' : category})</h2>
        <div className="mt-2 flex gap-2">
          {DEBUG_CATEGORIES.map((slug) => (
            <button
              key={slug ?? 'all'}
              onClick={() => setCategory(slug)}
              className={`rounded border px-2 py-1 text-sm ${
                category === slug ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
              }`}
            >
              {slug ?? 'all'}
            </button>
          ))}
        </div>
        <p className="mt-2 text-sm">
          {products.isLoading && 'Loading…'}
          {products.error && `Error: ${products.error.message}`}
          {products.data &&
            `${products.data.total} products — first: ${products.data.products[0]?.title ?? 'n/a'}`}
        </p>
      </section>

      <section className="mt-4 rounded border border-gray-200 bg-white p-4">
        <h2 className="font-medium">useCategories()</h2>
        <p className="mt-2 text-sm">
          {categories.isLoading && 'Loading…'}
          {categories.error && `Error: ${categories.error.message}`}
          {categories.data &&
            `${categories.data.length} categories — e.g. ${categories.data
              .slice(0, 3)
              .map((c) => c.name)
              .join(', ')}`}
        </p>
      </section>

      <section className="mt-4 rounded border border-gray-200 bg-white p-4">
        <h2 className="font-medium">useProduct('1')</h2>
        <p className="mt-2 text-sm">
          {sampleProduct.isLoading && 'Loading…'}
          {sampleProduct.error && `Error: ${sampleProduct.error.message}`}
          {sampleProduct.data &&
            `${sampleProduct.data.title} — $${sampleProduct.data.price}, ${sampleProduct.data.brand ?? 'no brand'}, ${sampleProduct.data.images.length} image(s)`}
        </p>
      </section>
    </main>
  )
}

import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 text-center">
      <p className="text-sm font-semibold text-blue-600">404</p>
      <h1 className="mt-1 text-2xl font-bold text-gray-900">Page not found</h1>
      <p className="mt-2 text-sm text-gray-500">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline">
        ← Back to products
      </Link>
    </main>
  )
}

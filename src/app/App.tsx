import { BrowserRouter } from 'react-router-dom'
import { ErrorBoundary } from './ErrorBoundary'
import { AppRoutes } from './routes'
import { ScrollToTop } from './ScrollToTop'

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <AppRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  )
}

import { Component, type ErrorInfo, type ReactNode } from 'react'
import { ErrorMessage } from '@/components/ui/ErrorMessage'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  error: Error | null
}

/**
 * Catches render errors below it. Mounted at two levels: the app root (last
 * resort) and per route — keyed by pathname in routes.tsx, so navigating away
 * from a crashed route automatically resets the boundary.
 *
 * The one class component in the app: error boundaries have no hook API.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Reporting hook point (e.g. Sentry.captureException) in a real app.
    console.error('ErrorBoundary caught a render error:', error, info.componentStack)
  }

  handleReset = () => {
    this.setState({ error: null })
  }

  render() {
    if (this.state.error !== null) {
      return (
        <div className="mx-auto max-w-2xl px-4 py-16">
          <ErrorMessage
            title="Something went wrong"
            message="An unexpected error occurred while rendering this page. You can try again, or reload if the problem persists."
            onRetry={this.handleReset}
          />
        </div>
      )
    }

    return this.props.children
  }
}

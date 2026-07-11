import { Button } from './Button'

interface ErrorMessageProps {
  title?: string
  message: string
  onRetry?: () => void
}

export function ErrorMessage({
  title = 'Something went wrong',
  message,
  onRetry,
}: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-6 py-12 text-center"
    >
      <h2 className="text-lg font-semibold text-red-800">{title}</h2>
      <p className="text-sm text-red-700">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} className="mt-3">
          Try again
        </Button>
      )}
    </div>
  )
}

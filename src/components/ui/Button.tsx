import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
}

const VARIANT_CLASSES = {
  primary:
    'border border-[#ffd814] bg-gradient-to-b from-[#ffd814] to-[#f7ca00] text-gray-900 shadow-sm hover:from-[#f5c71a] hover:to-[#e6b800] focus-visible:ring-amazon-orange hover:shadow',
  secondary:
    'border border-gray-300 bg-gradient-to-b from-white to-gray-50 text-gray-800 shadow-xs hover:from-gray-50 hover:to-gray-100/90 focus-visible:ring-gray-400 hover:shadow-sm',
} as const

export function Button({ variant = 'primary', className = '', ...rest }: ButtonProps) {
  return (
    <button
      className={`font-heading text-xs font-semibold rounded-full px-5 py-2.5 transition-all duration-150 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 ${VARIANT_CLASSES[variant]} ${className}`}
      {...rest}
    />
  )
}

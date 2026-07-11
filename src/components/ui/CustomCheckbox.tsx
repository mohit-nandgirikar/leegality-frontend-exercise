import type { InputHTMLAttributes } from 'react'

interface CustomCheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
}

export function CustomCheckbox({ label, className = '', ...props }: CustomCheckboxProps) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3.5 rounded-md px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100/50 hover:text-gray-900 group select-none transition-all duration-200 ${className}`}
    >
      <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
        <input type="checkbox" className="peer sr-only" {...props} />
        {/* Checkbox box */}
        <span className="h-5 w-5 rounded border border-gray-300 bg-white shadow-inner transition-all duration-200 ease-out peer-checked:border-amazon-orange peer-checked:bg-amazon-orange group-hover:border-gray-400 peer-focus-visible:ring-2 peer-focus-visible:ring-amazon-orange peer-focus-visible:ring-offset-2" />
        {/* Custom SVG Checkmark */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={3.5}
          className="absolute h-3 w-3 text-white scale-0 transition-transform duration-200 ease-out peer-checked:scale-100"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      </span>
      <span className="font-sans text-[13.5px] font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200 leading-none">
        {label}
      </span>
    </label>
  )
}

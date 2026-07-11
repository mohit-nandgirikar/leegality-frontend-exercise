import type { InputHTMLAttributes } from 'react'

interface CustomRadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
}

export function CustomRadio({ label, className = '', ...props }: CustomRadioProps) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3.5 rounded-md px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100/50 hover:text-gray-900 group select-none transition-all duration-200 ${className}`}
    >
      <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
        <input type="radio" className="peer sr-only" {...props} />
        {/* Outer Ring */}
        <span className="h-5 w-5 rounded-full border border-gray-300 bg-white shadow-inner transition-all duration-200 ease-out peer-checked:border-amazon-orange peer-checked:ring-1 peer-checked:ring-amazon-orange group-hover:border-gray-400 peer-focus-visible:ring-2 peer-focus-visible:ring-amazon-orange peer-focus-visible:ring-offset-2" />
        {/* Inner Dot */}
        <span className="absolute h-2.5 w-2.5 rounded-full bg-amazon-orange scale-0 opacity-0 transition-all duration-200 ease-out peer-checked:scale-100 peer-checked:opacity-100" />
      </span>
      <span className="font-sans text-[13.5px] font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200 leading-none">
        {label}
      </span>
    </label>
  )
}

import { Link } from 'react-router-dom'

export function Header() {
  return (
    <header className="w-full text-white">
      {/* Top Banner/Nav bar */}
      <div className="bg-amazon-dark px-4 py-2.5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link to="/" className="group flex flex-col justify-center focus-visible:outline-none">
              <span className="font-heading text-xl font-black tracking-tight text-white sm:text-2xl">
                leegality<span className="text-amazon-orange">shop</span>
              </span>
              {/* Amazon-like curve */}
              <div className="-mt-1 h-1 w-full rounded-full bg-amazon-orange transition-transform duration-300 group-hover:scale-x-110 group-hover:bg-amazon-orange-hover" />
            </Link>

            {/* Mock Delivery Location */}
            <div className="hidden items-center gap-1.5 rounded-sm p-1.5 hover:ring-1 hover:ring-white lg:flex cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="h-5 w-5 text-gray-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                />
              </svg>
              <div className="flex flex-col text-left leading-none">
                <span className="text-[11px] text-gray-400">Deliver to</span>
                <span className="text-xs font-bold text-gray-100">India</span>
              </div>
            </div>
          </div>

          {/* Search bar mockup */}
          <div className="relative flex flex-1 max-w-2xl h-10 items-stretch rounded-md bg-white text-gray-900 shadow-sm focus-within:ring-2 focus-within:ring-amazon-orange focus-within:ring-offset-2 focus-within:ring-offset-amazon-dark">
            <div className="hidden items-center rounded-l-md border-r border-gray-200 bg-gray-100 px-3 text-xs font-medium text-gray-600 hover:bg-gray-200 sm:flex cursor-pointer select-none">
              All Categories
              <span aria-hidden="true" className="ml-1 text-[8px]">
                ▼
              </span>
            </div>
            <input
              type="text"
              placeholder="Search mock items..."
              disabled
              className="w-full bg-transparent px-3.5 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none disabled:cursor-not-allowed"
            />
            <button
              type="button"
              disabled
              aria-label="Search"
              className="flex items-center justify-center rounded-r-md bg-amazon-orange px-6 text-amazon-dark hover:bg-amazon-orange-hover focus-visible:outline-none disabled:opacity-90 select-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.4}
                stroke="currentColor"
                className="h-4.5 w-4.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.637Z"
                />
              </svg>
            </button>
          </div>

          {/* Right items */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Accounts & Lists */}
            <div className="hidden flex-col text-left leading-none rounded-sm p-1.5 hover:ring-1 hover:ring-white md:flex cursor-pointer">
              <span className="text-[11px] text-gray-400">Hello, Guest</span>
              <span className="text-xs font-bold text-gray-100">Account & Lists</span>
            </div>

            {/* Returns & Orders */}
            <div className="hidden flex-col text-left leading-none rounded-sm p-1.5 hover:ring-1 hover:ring-white sm:flex cursor-pointer">
              <span className="text-[11px] text-gray-400">Returns</span>
              <span className="text-xs font-bold text-gray-100">& Orders</span>
            </div>

            {/* Cart Icon */}
            <div className="flex items-center gap-1.5 rounded-sm p-1.5 hover:ring-1 hover:ring-white cursor-pointer">
              <div className="relative">
                <span className="absolute -top-1.5 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amazon-orange px-1 text-[10px] font-bold text-amazon-dark">
                  0
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-6 w-6 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                  />
                </svg>
              </div>
              <span className="mt-1 hidden text-xs font-bold text-white lg:inline">Cart</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub bar */}
      <div className="bg-amazon-blue flex items-center px-4 py-1.5 sm:px-6 lg:px-8 text-xs font-semibold text-gray-100 border-b border-amazon-dark/30">
        <div className="mx-auto flex w-full max-w-7xl gap-4 overflow-x-auto custom-scrollbar whitespace-nowrap">
          <button
            type="button"
            className="flex items-center gap-1 hover:text-white focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.2}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
            All
          </button>
          <a href="#" className="hover:text-white">
            Today's Deals
          </a>
          <a href="#" className="hover:text-white">
            Customer Service
          </a>
          <a href="#" className="hover:text-white">
            Registry
          </a>
          <a href="#" className="hover:text-white">
            Gift Cards
          </a>
          <a href="#" className="hover:text-white">
            Sell
          </a>
        </div>
      </div>
    </header>
  )
}

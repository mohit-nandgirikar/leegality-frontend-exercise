# 🛒 Implementation Plan — Product Listing & Detail App (Leegality Frontend Assessment)

An Amazon-style e-commerce app built on the [DummyJSON Products API](https://dummyjson.com/docs/products), with a filterable, paginated Product Listing Page and a Product Detail Page.

---

## 1. Requirements Recap (from the assessment)

| Area                | Requirement                                                                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Screens             | Product Listing Page (`/`), Product Detail Page (`/product/:id`)                                                                |
| Listing layout      | Filters on the left, product grid on the right, pagination at the bottom                                                        |
| Product card        | Image, title, price, rating; click → detail page                                                                                |
| Filters (mandatory) | Category (from `/products/categories`), Price range (min/max inputs), Brand (unique brands from fetched products, multi-select) |
| Filter behavior     | Combined filtering, immediate list update, pagination resets on filter change, loading + error states                           |
| Detail page         | Image, name, price, rating, description, brand, category + Back button                                                          |
| Navigation          | Filters must persist when navigating back from detail page                                                                      |
| Tech                | React functional components, React Router, hooks, CSS/Tailwind; **no heavy UI libraries**                                       |
| Submission          | GitHub repo + live demo + README (setup, assumptions, architecture decisions, future improvements)                              |

---

## 2. Tech Stack & Justification

| Choice                                           | Why                                                                                                                                                                                                                                                                                                                                     |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **React 18 + Vite**                              | Fast dev server, instant HMR, optimized production builds with automatic code splitting. CRA is deprecated; Vite is the current standard.                                                                                                                                                                                               |
| **TypeScript**                                   | API response typing catches contract bugs at compile time; self-documenting props; expected at senior level.                                                                                                                                                                                                                            |
| **React Router v6**                              | Declarative routes, `useSearchParams` for URL-driven filter state, lazy route support.                                                                                                                                                                                                                                                  |
| **Tailwind CSS**                                 | Explicitly allowed by the assessment. Utility-first, no runtime cost, no component library weight. Design tokens (spacing/colors) stay consistent by default.                                                                                                                                                                           |
| **No state library** (no Redux/Zustand)          | Server data lives in custom hooks; filter state lives in the URL. Adding a global store here would be over-engineering — an important senior signal is knowing when _not_ to add a dependency.                                                                                                                                          |
| **No data-fetching library** (no TanStack Query) | Only 3 endpoints. A small custom `useProducts`/`useFetch` layer with `AbortController` + in-memory cache demonstrates fundamentals the assessment is explicitly evaluating ("work with APIs", "manage state"). The API layer is abstracted so React Query could be swapped in later without touching UI (see §6, Dependency Inversion). |
| **Vitest + React Testing Library**               | Zero-config with Vite. Unit tests for pure filter logic + key component tests.                                                                                                                                                                                                                                                          |
| **ESLint + Prettier**                            | Enforced consistency; `eslint-plugin-react-hooks` catches dependency-array bugs.                                                                                                                                                                                                                                                        |

---

## 3. Core Architectural Decision — Filtering & Pagination Strategy

This is the highest-leverage design decision in the whole exercise, because DummyJSON's API capabilities don't line up 1:1 with the required filters:

| Filter      | API support                                                                                       |
| ----------- | ------------------------------------------------------------------------------------------------- |
| Category    | ✅ Server-side — `GET /products/category/{category}`                                              |
| Price range | ❌ No server support                                                                              |
| Brand       | ❌ No server support — and the brand _facet list_ itself must be derived from the full result set |
| Pagination  | ✅ `limit`/`skip` — but only meaningful when the server also applies every active filter          |

**The trap:** naive server-side `limit/skip` pagination breaks the moment a client-side filter (price/brand) is active — you'd fetch a page of 12, filter it down to 3, and render a broken grid with wrong page counts. Also, building the complete brand checklist requires the _entire_ dataset for the current category, not one page of it.

**Decision — hybrid fetch, client-side filter + paginate:**

1. **Fetch once per category** (the only server-side filter): `GET /products?limit=0` or `GET /products/category/{slug}?limit=0`, using DummyJSON's `select` param (`?select=title,price,rating,thumbnail,brand,category`) to slim the payload. The full dataset is ~194 products — a few KB of JSON.
2. **Derive everything else client-side, memoized:**
   - `useMemo` #1: unique brand list from the fetched dataset (the facet).
   - `useMemo` #2: filtered products (price range + selected brands applied as composed pure predicates).
   - `useMemo` #3: current page slice of the filtered list.
3. **Cache per category** in a module-level `Map` so switching between categories (or returning from the detail page) doesn't re-fetch.

**Trade-off, stated honestly (goes in the README):** this is the correct call for a ≤200-item dataset — one request, instant filter response, zero pagination bugs. At real e-commerce scale (10k+ SKUs) the same UI would move to server-side faceted search (filters as query params, server-computed facets); the architecture supports that swap because all fetching sits behind the `productService` + `useProducts` abstraction, and filter state is already serialized in the URL — exactly the shape a server API would consume.

### Filter state lives in the URL — single source of truth

`/?category=smartphones&brands=Apple,Samsung&minPrice=100&maxPrice=900&page=2`

Managed via React Router's `useSearchParams`, wrapped in one custom hook (`useProductFilters`). This single decision elegantly satisfies several requirements at once:

- ✅ **"Filters remain applied when navigating back"** — free, via browser history. No state syncing, no context, no sessionStorage hacks.
- ✅ Shareable/bookmarkable filtered views (real e-commerce behavior).
- ✅ Refresh-safe.
- ✅ **"Pagination resets when filters change"** — the hook deletes `page` whenever any filter param is written.
- ✅ No prop drilling and no global store — components read/write filters through one hook.

### Data flow

```
URL search params  ──▶  useProductFilters()  ──▶  filter state (typed)
                                                    │
GET /products[/category/:slug] ─▶ useProducts() ──▶ raw dataset (cached per category)
                                                    │
                                        useMemo: applyFilters(dataset, filters)
                                                    │
                                        useMemo: paginate(filtered, page, PAGE_SIZE)
                                                    │
                                    ProductGrid ▸ ProductCard (memoized)
```

---

## 4. Directory Structure (feature-based)

Feature-based over type-based: everything about a feature lives together, shared primitives are promoted only when actually reused (DRY without premature abstraction).

```
src/
├── app/
│   ├── App.tsx                    # Router + Suspense + top-level ErrorBoundary
│   ├── routes.tsx                 # Route config; detail page lazy-loaded
│   └── ErrorBoundary.tsx          # Reusable class-based boundary (~40 lines, no library)
│
├── api/
│   ├── client.ts                  # fetch wrapper: base URL, JSON parsing, HTTP error → ApiError, AbortSignal
│   └── productService.ts          # getProducts, getProductsByCategory, getProductById, getCategories
│
├── features/
│   ├── product-listing/
│   │   ├── ProductListingPage.tsx
│   │   ├── components/
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductCard.tsx            # React.memo
│   │   │   ├── ProductCardSkeleton.tsx
│   │   │   ├── Pagination.tsx
│   │   │   └── filters/
│   │   │       ├── FilterSidebar.tsx      # composes the three filters
│   │   │       ├── CategoryFilter.tsx
│   │   │       ├── PriceRangeFilter.tsx   # debounced inputs
│   │   │       └── BrandFilter.tsx        # multi-select checkboxes
│   │   ├── hooks/
│   │   │   ├── useProducts.ts             # fetch + cache + abort + loading/error state
│   │   │   ├── useCategories.ts
│   │   │   └── useProductFilters.ts       # URL ⇄ typed filter state
│   │   └── utils/
│   │       ├── filterProducts.ts          # pure, unit-tested predicate composition
│   │       └── paginate.ts                # pure
│   │
│   └── product-detail/
│       ├── ProductDetailPage.tsx
│       ├── components/
│       │   ├── ProductDetailSkeleton.tsx
│       │   └── ProductInfo.tsx
│       └── hooks/
│           └── useProduct.ts
│
├── components/ui/                 # shared, dependency-free primitives
│   ├── Skeleton.tsx               # base shimmer block; feature skeletons compose it
│   ├── RatingStars.tsx
│   ├── ErrorMessage.tsx           # message + Retry button
│   ├── EmptyState.tsx             # "No products match your filters" + Clear-filters action
│   └── Button.tsx
│
├── hooks/
│   └── useDebouncedValue.ts
│
├── types/
│   └── product.ts                 # Product, Category, ProductsResponse, Filters
│
├── constants/
│   └── index.ts                   # PAGE_SIZE, API_BASE_URL, DEBOUNCE_MS
│
├── utils/
│   └── format.ts                  # formatPrice (Intl.NumberFormat), clamp
│
└── main.tsx
```

**Naming conventions:** `PascalCase.tsx` components, `useCamelCase.ts` hooks, `camelCase.ts` utils, `UPPER_SNAKE` constants, event props `onX` / handlers `handleX`, boolean props `is/has` prefixed.

---

## 5. Component Design

### Product Listing Page

- `ProductListingPage` is a thin **container**: wires `useProductFilters` + `useProducts` + the two memoized derivations, and hands plain props to presentational children (container/presentational split = testable, reusable UI).
- `ProductCard` — pure presentational, wrapped in `React.memo`. Renders thumbnail (`loading="lazy"`, explicit `aspect-ratio` to prevent layout shift), title (line-clamped), `formatPrice`, `RatingStars`. Entire card is a `<Link to={/product/${id}}>` — real navigation semantics (open-in-new-tab, middle-click work).
- `FilterSidebar` — composes `CategoryFilter`, `PriceRangeFilter`, `BrandFilter`; each receives `(value, onChange)` and nothing else. Collapses to a drawer/accordion under `md:` breakpoint.
- `Pagination` — pure: `(currentPage, totalPages, onPageChange)`. Windowed page numbers with ellipsis, prev/next, disabled edge states, `aria-current="page"`.
- `EmptyState` when combined filters match zero products, with a one-click **Clear filters**.

### Product Detail Page

- Lazy-loaded route (`React.lazy` + `Suspense`).
- `useProduct(id)` → loading (skeleton) / error / not-found (invalid id → friendly 404 with link home) / success.
- **Back button uses `navigate(-1)`** when there's in-app history (arrived from the listing → history restores the exact filtered+paginated URL), falling back to `<Link to="/">` on direct deep-loads. This is what makes "previously selected filters remain applied" bulletproof.

---

## 6. SOLID & DRY — applied concretely, not ceremonially

| Principle                     | Where it shows up                                                                                                                                                                                                                                                                                                |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **S — Single Responsibility** | `useProducts` only fetches/caches; `useProductFilters` only syncs URL ⇄ state; `filterProducts.ts` is pure logic with zero React imports; `ProductCard` only renders. Each unit has exactly one reason to change.                                                                                                |
| **O — Open/Closed**           | Filtering is composed from small predicates (`byPriceRange`, `byBrands`) — adding a "minimum rating" filter means adding one predicate + one sidebar section, modifying nothing existing. `Skeleton` extends via props/composition, not edits.                                                                   |
| **L — Substitutability**      | `ProductCardSkeleton` and `ProductCard` occupy identical grid slots (same dimensions/contract), so loading → loaded swaps without layout shift. Any component consuming the `Product` type works with list or detail data.                                                                                       |
| **I — Interface Segregation** | Components receive minimal props: `Pagination` gets 3 values, not the whole query state; `BrandFilter` gets `(brands, selected, onToggle)`, not the product array. TS interfaces per component keep contracts narrow.                                                                                            |
| **D — Dependency Inversion**  | Pages depend on hook abstractions, hooks depend on `productService`, which depends on `client.ts`. Swapping `fetch` → axios, or custom hooks → TanStack Query, touches one layer. Components never call `fetch`.                                                                                                 |
| **DRY**                       | One `client.ts` (error handling, JSON parsing, abort — written once); one `Skeleton` primitive composed everywhere; one `formatPrice`; one `useDebouncedValue`; endpoints & magic numbers in `constants/`. Counter-balance: no premature abstraction — shared code is _extracted on second use_, not speculated. |

---

## 7. Error Handling Strategy (layered)

1. **Render errors → Error Boundaries.** A small hand-written class component (the only class in the app — boundaries require it; no library needed):
   - `getDerivedStateFromError` + `componentDidCatch` (logging hook point)
   - Renders a fallback with a **"Try again"** reset button
   - Placed at **two levels**: app-root (last resort, full-page fallback) and **per-route** (a crash on the detail page never takes down the listing; reset re-renders just that route).
2. **Async/API errors → hook state** (boundaries don't catch async): `client.ts` normalizes non-2xx and network failures into a typed `ApiError`; hooks expose `{ data, isLoading, error }`; UI renders `ErrorMessage` with **Retry** (re-triggers the fetch). Aborted requests are explicitly _not_ surfaced as errors.
3. **Not-found**: invalid `/product/:id` (DummyJSON 404) → dedicated not-found UI; unknown routes → catch-all 404 route.
4. **Empty results** ≠ errors: zero matches renders `EmptyState` + clear-filters.
5. **Image failures**: `onError` fallback placeholder so broken product images never show as broken-icon glyphs.

---

## 8. Loading UX — Skeleton Screens

- **Listing**: while fetching, render `PAGE_SIZE × ProductCardSkeleton` in the same grid — identical card dimensions ⇒ zero layout shift (CLS ≈ 0), perceived performance far better than a spinner.
- **Detail**: `ProductDetailSkeleton` mirrors the final two-column layout (image block + text lines).
- **Filters**: category/brand lists get compact line skeletons on first load.
- All built by composing one `Skeleton` primitive (shimmer via a single CSS keyframe animation, `motion-reduce:animate-none` for reduced-motion users).
- Skeletons appear only on _initial/route_ loads; because filtering is client-side and memoized, filter changes update the grid instantly with no loading flash.

---

## 9. Performance Optimization Plan

| Technique                      | Application                                                                                                                                                                                                          |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Route-level code splitting** | `React.lazy(() => import('./ProductDetailPage'))` + `Suspense` — detail bundle loads on demand; Vite chunks automatically.                                                                                           |
| **`React.memo`**               | `ProductCard` (the hot path: up to `PAGE_SIZE` instances re-rendering on every filter keystroke without it), `Pagination`, individual filter sections.                                                               |
| **`useMemo`**                  | The three derived computations: brand facet extraction, filtered list, page slice. Filter changes re-run cheap array ops instead of re-fetching.                                                                     |
| **`useCallback`**              | Handlers passed into memoized children (`onToggleBrand`, `onPageChange`) so `memo` actually holds.                                                                                                                   |
| **Debouncing**                 | Price min/max inputs debounced ~400ms via `useDebouncedValue` — no re-filter per keystroke; inputs stay instantly responsive because raw input state is local.                                                       |
| **Request cancellation**       | `AbortController` in `useProducts` — effect cleanup aborts in-flight requests on rapid category switches/unmount: no race conditions, no state-after-unmount, no stale data flashes.                                 |
| **In-memory cache**            | Category → dataset `Map`; back-navigation and repeat category visits render instantly with zero network.                                                                                                             |
| **Payload trimming**           | DummyJSON `select=` param — listing fetches only the 6 fields cards need.                                                                                                                                            |
| **Pagination**                 | Only `PAGE_SIZE` (12) cards mounted per page — bounds DOM size regardless of dataset.                                                                                                                                |
| **Image optimization**         | `thumbnail` (small asset) on cards, full image only on detail; `loading="lazy"` + `decoding="async"`; fixed `aspect-ratio` boxes → CLS ≈ 0.                                                                          |
| **Re-render discipline**       | Filter state read via one hook per consumer (no giant context provider re-rendering the tree); local input state stays local; stable `key`s (`product.id`). Verified with React DevTools Profiler before submission. |
| **No heavy deps**              | Runtime deps: `react`, `react-dom`, `react-router-dom`. Tailwind is build-time. Target: main JS bundle < 100KB gzip, Lighthouse ≥ 95 performance.                                                                    |

---

## 10. Accessibility & Responsiveness (senior-level polish)

- Semantic structure: `<main>`, `<aside>` (filters), `<nav>` (pagination), one `<h1>` per page.
- Fully keyboard-navigable: cards are links, filters are native inputs/checkboxes (styled, never div-soup), visible focus rings.
- `aria-live="polite"` region announcing "N products found" on filter change; labeled inputs; `RatingStars` with text alternative ("4.6 out of 5").
- Responsive: mobile-first — filters collapse into a toggleable drawer below `md`, grid steps 1 → 2 → 3 → 4 columns.

---

## 11. Testing Strategy (high-value, not exhaustive)

- **Unit (pure logic first)**: `filterProducts` (combined filters, boundary prices, empty selections), `paginate`, `useDebouncedValue`.
- **Component**: `ProductCard` renders fields + links correctly; `Pagination` disabled states; listing page shows skeletons → products → empty state (mocked service).
- **Hook**: `useProductFilters` URL round-tripping (page resets when a filter changes).
- Run in CI (GitHub Actions: lint + typecheck + test on PR) — Vercel deploys only green builds.

---

## 12. Deployment — Vercel

1. Import the GitHub repo into Vercel — zero-config detects Vite (`npm run build` → `dist/`).
2. **SPA rewrite** (critical — deep links like `/product/5` 404 without it):
   ```json
   // vercel.json
   { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
   ```
3. `VITE_API_BASE_URL` as an env var (12-factor hygiene, even for a public API).
4. Every PR gets an automatic **preview deployment**; `main` = production. Demo URL + repo link go in the README.

---

## 13. Execution Phases

> ⚠️ **Working agreement:** After each phase, execution **stops** for review. **No commits are made on the user's behalf** — the user reviews and commits each phase themselves.

**Phase 0 — Scaffold & foundations**
Vite + React + TS init, Tailwind, React Router, ESLint/Prettier, folder structure, `constants`, `types/product.ts`, `vercel.json`, base `client.ts`. Verify: app boots, lint/typecheck clean. **⏸ stop**

**Phase 1 — API layer & data hooks**
`productService`, `useProducts` (abort + cache + loading/error), `useCategories`, `useProduct`. Verify with a throwaway debug render. **⏸ stop**

**Phase 2 — Listing page core**
`ProductListingPage`, `ProductGrid`, `ProductCard` (+skeleton), `Pagination`, `RatingStars`, `formatPrice`, empty/error states. Client-side pagination over the fetched dataset. **⏸ stop**

**Phase 3 — Filters**
`useProductFilters` (URL state), `FilterSidebar` + Category/Price/Brand filters, debounced price inputs, pure `filterProducts`, combined filtering + page-reset behavior, `EmptyState` with clear-filters. **⏸ stop**

**Phase 4 — Detail page & routing polish**
Lazy `/product/:id` route, `useProduct`, detail UI + skeleton, back-with-history-fallback, not-found handling, catch-all 404, route-level + root Error Boundaries. **⏸ stop**

**Phase 5 — Performance, a11y & responsive polish**
Memoization audit with the Profiler, image lazy-loading/aspect-ratios, mobile filter drawer, keyboard/ARIA pass, Lighthouse run, tests + CI workflow. **⏸ stop**

**Phase 6 — README & deploy**
README (setup, assumptions, architecture decisions incl. §3 trade-off, improvements-with-more-time), Vercel deployment, live-demo smoke test of every requirement. **⏸ stop — submit**

---

## 14. README "Improvements with more time" (pre-drafted talking points)

Server-side faceted search at scale; TanStack Query for cache invalidation/stale-while-revalidate; search-by-text + sort options; virtualized grid for 1000+ items; E2E tests (Playwright); optimistic UI for a cart feature; i18n/currency localization; image CDN with `srcset`.

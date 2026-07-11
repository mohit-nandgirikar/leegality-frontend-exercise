# 🛒 Product Catalog

An Amazon-style **Product Listing + Product Detail** app built on the [DummyJSON Products API](https://dummyjson.com/docs/products), for the Leegality Frontend Engineer assessment.

**Live demo:** [leegality-frontend-exercise.vercel.app](https://leegality-frontend-exercise.vercel.app/) · **Source:** [github.com/mohit-nandgirikar/leegality-frontend-exercise](https://github.com/mohit-nandgirikar/leegality-frontend-exercise)

- Filterable, paginated product grid (category · price range · brand, all combinable)
- Product detail page with an interactive image gallery, buy box with stock indicators, and history-aware back navigation — **filters persist when navigating back**
- Amazon-inspired design system: global header, deal badges, custom radio/checkbox controls, shimmer skeletons
- Skeleton loading, error states with retry, 404s, and error boundaries throughout
- 39 unit/component tests, CI pipeline, Lighthouse **accessibility 100 · best practices 100 · CLS 0**

---

## Getting started

Requires **Node 20.19+ or 22+**.

```bash
git clone https://github.com/mohit-nandgirikar/leegality-frontend-exercise.git
cd leegality-frontend-exercise
npm install
npm run dev        # http://localhost:5173
```

| Script            | What it does                            |
| ----------------- | --------------------------------------- |
| `npm run dev`     | Start the dev server                    |
| `npm run build`   | Typecheck (`tsc -b`) + production build |
| `npm run preview` | Serve the production build locally      |
| `npm run test`    | Run the Vitest suite (39 tests)         |
| `npm run lint`    | oxlint (includes `rules-of-hooks`)      |
| `npm run format`  | Prettier                                |

No environment variables are required — the API base URL defaults to `https://dummyjson.com` and can be overridden via `VITE_API_BASE_URL` (see `.env.example`).

---

## Tech stack

| Choice                                    | Why                                                                                                                                                                                                                                                                                 |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Vite + React 19 + TypeScript (strict)** | Fast builds, automatic code splitting, compile-time API contract safety.                                                                                                                                                                                                            |
| **React Router 7**                        | Routing plus `useSearchParams` — the backbone of URL-driven filter state.                                                                                                                                                                                                           |
| **Tailwind CSS 4**                        | Utility styling with zero runtime cost. No heavy UI library, per the brief.                                                                                                                                                                                                         |
| **No Redux / no TanStack Query**          | Deliberate: filter state lives in the URL and server data lives in a small custom hook layer (`useFetch` with abort + cache). At this scope, a store or query library would be over-engineering; the service layer is abstracted so either could be swapped in without touching UI. |
| **Vitest + React Testing Library**        | Unit tests for the pure filter/pagination logic, behavioral tests for the fetch hook, component tests for card + pagination.                                                                                                                                                        |

---

## Architecture

```
src/
├── app/                  # App shell: router, error boundaries, 404, scroll restoration
├── api/                  # client.ts (typed fetch wrapper) + productService.ts (endpoints)
├── components/ui/        # Dependency-free primitives: Header, Skeleton, Button, CustomRadio,
│                         # CustomCheckbox, RatingStars, ErrorMessage, EmptyState
├── features/
│   ├── product-listing/  # Page, grid, cards, pagination, filters + hooks + pure utils
│   └── product-detail/   # Page (lazy-loaded): image gallery + buy box, back button + hook
├── hooks/                # useFetch (abort + cache), useDebouncedValue
├── types/ · utils/ · constants/
```

**Data flow:** URL search params → `useProductFilters` (typed filter state) → `useProducts` (one fetch per category, cached, abortable) → three memoized derivations: brand facet → filtered list → page slice → memoized grid.

### The key decision: client-side filtering + pagination

DummyJSON supports category filtering and `limit/skip` server-side — but **not** price or brand. Naive server-side pagination breaks the moment a client-only filter is active (fetch a page of 12, filter it to 3, render a broken grid with wrong page counts), and the brand facet list itself needs the _whole_ category dataset, not one page of it.

So the app **fetches the full dataset once per category** (~194 products max, payload trimmed via DummyJSON's `select` param to the six fields cards need), then filters and paginates client-side through memoized pure functions. Results: one network request per category per session, instant filter response, zero pagination math bugs.

**Trade-off, stated honestly:** this is the right call for a ≤200-item catalog and would not scale to 10k+ SKUs. At that point filtering moves server-side (filters as query params, server-computed facets) — the URL already serializes the exact state a server API would consume, and all fetching sits behind `productService`/`useProducts`, so the swap is contained to one layer.

### Filter state lives in the URL

`/?category=smartphones&brands=Apple,Samsung&minPrice=100&maxPrice=900&page=2`

One decision satisfies several requirements at once: **back navigation restores filters** (via browser history — no state syncing), filtered views are shareable and refresh-safe, and "pagination resets on filter change" is enforced in a single place (every filter write drops the `page` param).

### Error handling (layered)

1. **Render crashes** → hand-written `ErrorBoundary` class (~45 lines, no library) at the app root _and_ per route, keyed by pathname so navigating away auto-resets and one route's crash never takes down another.
2. **API failures** → normalized into a typed `ApiError` by the fetch wrapper; hooks expose `{ data, isLoading, error, refetch }`; UI renders retryable error panels. Aborted requests are never surfaced as errors.
3. **Not found** → invalid product ids (API 404) get a dedicated UI; unknown routes hit a catch-all 404 page.
4. **Empty results** ≠ errors → "No products match your filters" with one-click clear.
5. **Broken images** → `onError` swap to an inline SVG placeholder.

### Performance

| Technique            | Where                                                                                                                   |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Code splitting       | Detail page is a lazy route (separate ~3 KB chunk); main bundle ~83 KB gzip                                             |
| `React.memo`         | `ProductCard`, `Pagination`, filter components — verified with render counters: toggling UI state re-renders zero cards |
| `useMemo`            | Brand facet → filtered list → page slice; recomputed only when inputs change                                            |
| Debouncing           | Price inputs commit to the URL after 400 ms; typing stays local and instant                                             |
| Request cancellation | `AbortController` per request — rapid category switches can't race or flash stale data                                  |
| In-memory cache      | Per-category dataset + per-product detail; back navigation renders with zero network                                    |
| Payload trimming     | `?select=` limits listing responses to the fields cards use                                                             |
| Image discipline     | Lazy loading, `decoding="async"`, fixed aspect boxes → **CLS 0**; skeletons dimensionally match real cards              |

Lighthouse (production, mobile emulation): **Accessibility 100 · Best Practices 100 · CLS 0**, Performance in the high 80s — the remaining LCP headroom is DummyJSON's image CDN under throttled emulation, outside app control.

### Accessibility

Semantic landmarks, one `h1` per page, real `<a>`/`<input>` elements everywhere (cards are links — middle-click works; filters are native radios/checkboxes), visible focus rings, `aria-live` result count, `aria-current` pagination, `aria-expanded` mobile filter drawer, skip-to-products link, `motion-reduce`-aware animations, text alternatives for star ratings.

---

## Assumptions

- **Dataset size:** DummyJSON's catalog (~194 products) fits comfortably in one response, making fetch-once + client-side filtering the optimal strategy. The pivot point to server-side faceting is documented above.
- **"You may use pagination via limit and skip"** was read as optional; client-side pagination (12/page) was chosen because it stays correct under combined client-side filters.
- **Brand facet** is derived from the _current category's_ dataset. Switching category clears brand selections (they'd silently match nothing in the new category) but keeps the price range.
- Products without a `brand` field (e.g. groceries) are excluded once any brand filter is active, and don't appear in the facet.
- **Min > max price** is treated as a valid-but-empty filter (empty state + clear CTA) rather than auto-swapped.
- Prices are USD; formatted with `Intl.NumberFormat`.
- The catalog is static per session, so caches have no TTL/invalidation.

---

## Testing

39 tests across 6 files: pure logic (pagination slicing/windowing, filter predicates, facet extraction, URL param parsing — junk/negative/decimal inputs), the `useFetch` engine (loading → data, error normalization, **aborts ignored**, **cache hits skip the network**, refetch-after-error, request-identity switching), and components (`ProductCard` rendering/link/lazy image, `Pagination` disabled edges / `aria-current` / callbacks / ellipsis windowing).

CI (GitHub Actions) runs lint → format check → tests → build on every push/PR to `main`.

---

## Deployment

Deployed on **Vercel** (zero-config Vite):

1. Push to GitHub and import the repo at [vercel.com/new](https://vercel.com/new) — build command and output dir are auto-detected.
2. `vercel.json` ships the SPA rewrite so deep links like `/product/5` don't 404:
   ```json
   { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
   ```
3. Every PR gets a preview deployment; `main` is production. CI gates merges.

---

## Improvements with more time

- **Search functionality** — wire the header's search bar (currently a visual mock) to DummyJSON's `/products/search?q=` with a debounced input, adding `q` to the existing URL-state pattern so searches are shareable and survive navigation like every other filter.
- **Sorting** (price / rating / newest), a rating filter (one new predicate in the composed filter pipeline), and a price histogram slider.
- **Server-side faceted search** once the catalog outgrows a single response (the URL schema is already the API contract).
- **TanStack Query** for stale-while-revalidate, cache invalidation, and hover-prefetching product details.
- **E2E tests** (Playwright) covering the filter → paginate → detail → back journey; axe automated a11y checks in CI.
- **Virtualized grid** if page sizes grow; `srcset`/image CDN for responsive images.
- **Error reporting** (Sentry hook is already stubbed in the ErrorBoundary) and web-vitals RUM.
- Cart with optimistic updates; i18n + multi-currency via `Intl`.

---

_The full phased implementation plan this was built from lives in [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)._

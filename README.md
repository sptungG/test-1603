# Product Explorer

A high-performance React 19 application for browsing and filtering a 10,000-item product catalog.

## Features

- **High-Performance List**: Virtualized rendering of 10,000 products using `react-window` — only visible rows are rendered in the DOM.
- **Authentication**: Simple login with hardcoded demo credentials persisted to `localStorage`.
- **Real-time Search**: Debounced search input (300ms) filtering products by name.
- **Multi-filter Support**:
  - Multi-select category filter (Electronics, Clothing, Books, Home & Garden, Sports)
  - Dual-handle price range slider ($0–$2000)
  - Minimum star rating filter
- **Sorting**: Price (asc/desc), Rating (desc), Name (asc/desc)
- **URL State Sync**: All filter and sort parameters are synced with URL search params (e.g. `?categories=electronics&sort=rating_desc&minRating=4`)
- **Product Detail Page**: Dedicated page per product with full details and breadcrumb navigation
- **Responsive Layout**: Sidebar collapses on mobile with a filter toggle button

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| Routing | React Router 7 |
| Styling | Tailwind CSS v4 |
| Icons | lucide-react |
| Virtualization | react-window v2 |
| URL State | query-string + custom `useUrlState` hook |
| Testing | Vitest + React Testing Library |

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) and sign in with:

- **Username**: `admin`
- **Password**: `password123`

## Commands

```bash
pnpm dev          # Start development server
pnpm build        # TypeScript check + production build
pnpm test         # Run tests in watch mode
pnpm test:run     # Run tests once
pnpm test:coverage # Run tests with coverage report
pnpm lint         # ESLint
```

## Project Structure

```
src/
├── components/
│   ├── ui/
│   │   ├── Button.tsx          # Shared button with loading state (Loader2 spinner)
│   │   └── Input.tsx           # Shared input with optional left-icon slot
│   ├── AppLayout.tsx           # Sticky header + main layout wrapper
│   ├── ProtectedRoute.tsx      # Redirects unauthenticated users to /login
│   └── Router.tsx              # All application routes
├── context/
│   └── AuthContext.tsx         # Login/logout state, localStorage persistence
├── hooks/
│   ├── useDebounce.ts          # Generic debounce hook (shared)
│   ├── useFetch.ts             # Generic data-fetching hook
│   └── useUrlState.ts          # Sync arbitrary state to URL search params
├── modules/
│   ├── auth/
│   │   └── PageLogin.tsx       # Login page
│   └── product/
│       ├── components/
│       │   ├── FilterPanel.tsx          # Sidebar: categories, price range, rating
│       │   ├── FilterRangeSlider.tsx    # Dual-handle price range slider
│       │   ├── ViewCategoryBadge.tsx    # Colored pill badge per category
│       │   ├── ViewProductCard.tsx      # Row card used inside the virtualized list
│       │   ├── ViewStarRating.tsx       # Star rating display (partial stars via SVG gradient)
│       │   └── VirtualizedProductList.tsx # react-window List wrapper
│       ├── PageProductDetail.tsx        # Single product detail page
│       ├── PageProductList.tsx          # Main catalog page (search, filter, sort)
│       ├── product-service.ts           # fetchProducts() + filterAndSortProducts()
│       └── product-types.ts             # Product, ProductFilters, SortOption types & constants
├── test/
│   ├── setup.ts
│   ├── AuthContext.test.tsx
│   ├── FilterPanel.test.tsx
│   ├── PageLogin.test.tsx
│   └── productService.test.ts
└── utils/
    └── utils.ts                # cn() class-name utility
public/
└── products.json               # 10,000 generated products (1.85 MB)
```

## Data Schema

Each product in `public/products.json` follows this schema:

```ts
{
  id: string;          // UUID
  name: string;        // "{Brand} {Adjective} {Type}"
  price: number;       // $5–$2000
  rating: number;      // 1.0–5.0
  category: "electronics" | "clothing" | "books" | "home-garden" | "sports";
  stock: number;       // 0–500
  image_url: string;   // https://picsum.photos/seed/{n}/400/300
}
```

## Testing

**40 tests** across 4 test files:

| File | Type | Coverage |
|---|---|---|
| `productService.test.ts` | Unit | Filter/sort logic: search, categories, price range, rating, sort orders, mutation safety |
| `AuthContext.test.tsx` | Integration | Login, logout, bad credentials, localStorage persistence, session restore |
| `FilterPanel.test.tsx` | Integration | Category toggle, rating radio, clear filters, result counts |
| `PageLogin.test.tsx` | Integration | Form rendering, input change, error display, loading state |

---

## AI Usage Disclosure

This project was built with significant AI assistance (Claude via OpenCode):

- **Architecture planning**: AI proposed the overall folder structure, component boundaries, and data flow design based on project requirements.
- **Boilerplate generation**: AI generated the initial versions of all components, hooks, and the product data generator script.
- **react-window v2 API**: AI identified that the installed version (v2) has a breaking API change from v1 (no `FixedSizeList`, uses `List` with `rowComponent`/`rowProps`) and adapted the implementation accordingly.
- **URL state sync**: AI designed the pattern of coercing URL string params back to typed values in `PageProductList` using the existing `useUrlState` hook.
- **Test generation**: AI authored the full test suite (unit + integration), including identifying a fake-timer/waitFor conflict in RTL tests and applying a real-timer override to fix it.
- **Bug fixes**: AI diagnosed a Label-Input association bug (`htmlFor`/`id` missing) found during test failures and fixed it directly in the `Input` component.

Human review and direction was provided throughout: library choices (react-window, Vitest), auth strategy, and architectural decisions were made by the human developer.

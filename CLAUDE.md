# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Dev server at http://localhost:3000
npm run build      # Production build
npm test           # Run tests in watch mode
npm test -- --watchAll=false                    # Run tests once (CI mode)
npm test -- --testPathPattern=<file>            # Run a single test file
```

There is no separate lint command — ESLint runs automatically via `react-scripts` (CRA's built-in config extends `react-app`).

## Architecture Overview

This is a **Create React App** property management SaaS for a Kuwait-based real estate company (Warba United Co., `admin.wuc.com.kw`). It manages the full rental lifecycle: tenants → properties/units → contracts → invoices → payments.

### Routing & Auth Boundary

Two distinct route trees exist in `src/App.js`:

- **Public routes** (no auth required): `/signin`, `/signup`, `/forget-password`, `/reset-password/:uid/:reset_token`, `/checkout/:uid`, `/payments/:uid`, `/privacy-policy`, `/`
- **Authenticated shell**: `path="/*"` renders `src/components/Layout.jsx`, which redirects unauthenticated users to `/signin` via a `useEffect` watching the JWT state.

The `/checkout` and `/payments` paths are special — they are mounted both inside Layout (for authenticated users) and outside it. Layout detects these paths and suppresses the Navbar.

### API Layer (`src/utils/api/`)

All HTTP calls go through a single shared axios instance in `src/utils/api/index.js`. It:
- Switches `baseURL` between `http://127.0.0.1:8000` (dev) and `https://admin.wuc.com.kw` (prod) via `process.env.NODE_ENV`
- Injects the JWT Bearer token from localStorage on every request via an interceptor
- Does **not** auto-logout on 401 — expired tokens are only caught client-side

Each domain has its own API module (`tenants.js`, `properties.js`, `contracts.js`, `invoices.js`, `payment.js`, `meters.js`, `units.js`, `dashboard.js`, `utils.js`). All functions return raw axios promises; callers access `.data` on the resolved response.

### State Management

[TanStack Query v4](https://tanstack.com/query/v4) handles all server state. Query key conventions:
- Single entity list: `["contracts"]`, `["properties"]`, `["tenants"]`
- Entity with parameter: `["CheckoutItems", unique_payment_identifier]`
- Mutations call `queryClient.invalidateQueries(["<entity>"])` on success to refetch

Auth state is managed by `react-query-auth` (`src/utils/auth/index.js`). Use the exported hooks `useUser`, `useLogin`, `useRegister`, `useLogout` everywhere — never read localStorage directly for auth. JWT is stored in localStorage via `src/utils/storage.js`.

### UI Layer

The project uses **multiple coexisting UI libraries** — be aware of which to reach for:

| Library | Use case |
|---|---|
| **MUI Material** (`@mui/material`) | Cards, Dividers, Alerts, general MUI components |
| **MUI Joy** (`@mui/joy`) | Buttons and circular progress in newer components |
| **MUI X** (`@mui/x-data-grid`, `@mui/x-date-pickers`) | Data tables, date pickers |
| **Material Tailwind** (`@material-tailwind/react`) | Select/Option dropdowns |
| **Tailwind CSS** | Primary layout and utility styling |
| **Flowbite** | Additional Tailwind components |
| **Headless UI** (`@headlessui/react`) | Navbar disclosure/menu, accessible primitives |

Tailwind is configured with `important: true`, custom breakpoints (`mobile`, `xs`, `lg_992`), and a custom color palette. Brand colors: `primary=#BD9A5F` (gold), `secondary=#1C1f2A`, background `#F7F6F2`.

### Forms

Forms use **Formik** for state and either:
- **Yup** schemas (newer pattern — see `ContractNew.jsx`)
- Custom `Validation.js` validate functions (older pattern — see `src/components/contracts/Validation.js`)

Reusable form primitives live in `src/utils/form/`: `Input`, `Dropdown`, `DateInput`, `Radio`, `Toggle`, `Textarea`, `FileInput`. These are styled consistently; prefer them over raw `<input>` elements.

Date handling uses **dayjs** with `en-gb` locale (DD/MM/YYYY display). Formatting utilities in `src/utils/format.js`:
- `changeAmountFormat(amount, decimal=3)` — KWD uses 3 decimal places
- `changeDatesFormat(date)` — outputs `DD/MM/YYYY`
- `validateIBAN(iban)` — validates 30-character Kuwait IBANs

### Payment Flow

The checkout is a tenant-facing public page. Flow:
1. Tenant receives a unique payment link (`/checkout/:unique_payment_identifier`)
2. `Checkout.jsx` fetches invoice details and lets tenant select invoices to pay
3. Submitting calls `sendPayment()` → backend proxies to **Hesabe** (Kuwait payment gateway)
4. Hesabe redirects back to `/checkout/response` or `/payments/:uid/:payment_id`

The `src/utils/hesabe/` directory contains AES encryption utilities for the Hesabe integration; the actual gateway communication happens server-side.

### File Conventions

- Components use `.jsx` (sometimes `.js` for older files); there is one `.tsx` file (`GoogleIcon.tsx`)
- Feature components live under `src/components/<feature>/`; shared UI primitives under `src/utils/`
- Validation logic per feature is colocated: `src/components/<feature>/Validation.js`
- The `src/components/` root contains stale landing-page scaffolding files (`.js` files like `About.js`, `Blog.js`) that predate the current app structure — these are not part of the active application

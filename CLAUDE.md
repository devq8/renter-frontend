# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Bootstrapped with Create React App (`react-scripts` 5.0.1). No TypeScript build step — the app is JS/JSX (one stray `.tsx` exists).

- `npm start` — dev server at http://localhost:3000
- `npm run build` — production build to `build/`
- `npm test` — Jest in watch mode (CRA / `@testing-library/react`)
- `npm test -- --watchAll=false src/App.test.js` — run a single test file once
- Avoid `npm run eject` (one-way, irreversible)

There is no separate lint script; ESLint runs through `react-scripts` (config `react-app`, `react-app/jest`) and surfaces in the dev console / build output.

## Backend coupling

The frontend talks to a **Django REST Framework** API. The base URL is hardcoded in [src/utils/api/index.js](src/utils/api/index.js) and switches on `NODE_ENV`:
- development → `http://127.0.0.1:8000`
- production → `https://admin.wuc.com.kw`

There is no `.env`-based config and no CRA proxy — a local backend must run on port 8000 for `npm start` to function.

**The backend source lives at `/Users/khaledalghanim/Development/Django/warba_united`** (Django 5.1.7 monolith, `warba_united` project; apps: `rentals`, `meters`, `users`, `accounting`, `chatbot`). It is the source of truth for the API contract — when an endpoint, payload, or response shape is unclear, read it there rather than guessing. That repo has a detailed root `CLAUDE.md` plus per-app `PROCESSES.md` files with `file:line` citations; start there.

API mounting (backend `warba_united/urls.py`) — the `/api/...` paths this frontend calls resolve as:
- `/api/...` → `rentals.APIs.urls` (web REST surface — **this is the one the web app uses**; the backend also has a parallel `/api/app/` mobile surface under `rentals/app/`, so when verifying a route make sure you're reading `rentals/APIs/`)
- `/api/auth/...` → `users.APIs.urls` (JWT / SimpleJWT auth: signin, signup, password reset)
- `/api/meters/...` → `meters.urls`
- `/api/accounting/...` → `accounting.urls`

Cross-cutting backend behavior worth knowing on the frontend side: money is Decimal with **3 decimal places** (KWD/fils); the system is **bilingual en/ar** end-to-end; phone numbers are Kuwaiti 8-digit local format; and some backend error strings are matched verbatim by the frontend (flagged with "DO NOT CHANGE THE ERROR MESSAGE" comments in the backend) — don't loosen frontend string matching without checking the backend. Payments go through the **Hesabe** gateway (see [src/utils/hesabe/](src/utils/hesabe/) here and `PAYMENT_FLOW.md` / `rentals/crypt.py` in the backend).

## Architecture

**Domain:** a rental / property-management app (WUC = a Kuwaiti utility). Core entities: properties → units → contracts → invoices, plus tenants, utility **meters** (readings), and **payments** via the Hesabe gateway.

**Routing is two-tiered:**
- [src/App.js](src/App.js) holds the providers (`QueryClientProvider`, MUI `LocalizationProvider` with dayjs/`en-gb`) and the **public** routes: `/signin`, `/signup`, `/forget-password`, `/reset-password/:uid/:reset_token`, `/privacy-policy`, `/checkout/response`. Everything else (`/*`) renders [src/components/Layout.jsx](src/components/Layout.jsx).
- [src/components/Layout.jsx](src/components/Layout.jsx) is the **authenticated shell**: it gates access via `useUser()` (redirects to `/signin` when there's no user, except on `/checkout`, `/payments`, `/privecypolicy` paths), renders the Navbar + Footer, and declares all the in-app routes. Add new authenticated pages here.

**Auth** ([src/utils/auth/index.js](src/utils/auth/index.js)): uses `react-query-auth`'s `configureAuth` to expose `useUser` / `useLogin` / `useRegister` / `useLogout`. A JWT is stored in `localStorage` via [src/utils/storage.js](src/utils/storage.js) and decoded client-side (`jwt-decode`) to derive the user and check expiry. The axios request interceptor in [src/utils/api/index.js](src/utils/api/index.js) attaches `Authorization: Bearer <token>` to every request.

**API layer** ([src/utils/api/](src/utils/api/)): one module per domain (`properties.js`, `tenants.js`, `contracts.js`, `invoices.js`, `meters.js`, `dashboard.js`, `payment.js`, `units.js`). All import the shared axios `instance` from `index.js` and typically return `res.data`. [src/utils/api/_normalize.js](src/utils/api/_normalize.js) exists to smooth over inconsistent DRF list shapes (`{count,next,previous,results}` vs `{data}` vs bare array) — note that components are inconsistent about which field they read (some use `.data`, some `.results`), so check the actual response shape when wiring up a list.

**Data fetching:** TanStack React Query **v4** (`useQuery(["key"], fn)` tuple syntax — not v5 object syntax). Server state lives in React Query; there is no global client store (Redux/Context for app state).

**Forms:** Formik + Yup, with shared field components in [src/utils/form/](src/utils/form/).

**UI stack is mixed:** MUI (`@mui/material`, `@mui/joy`, `@mui/x-data-grid`, `@mui/x-date-pickers`), Tailwind CSS (config in [tailwind.config.js](tailwind.config.js)), Flowbite / flowbite-react, Headless UI, and `react-select`. Toasts via `react-toastify` (single `<ToastContainer>` in `App.js`). Dates via `dayjs`. Shared presentational utilities (Button, Modal, Spinner, Breadcrumb, SearchBox, etc.) live directly under [src/utils/](src/utils/).

**Payments:** Hesabe gateway integration in [src/utils/hesabe/](src/utils/hesabe/) (uses `hesabe-crypt` for AES encrypt/decrypt), driving the `/checkout` and `/payments` flows.

**i18n:** minimal — a small en/ar dictionary in [src/utils/language/index.js](src/utils/language/index.js); RTL/LTR is toggled off a `lan` route param in `Layout.jsx`.

## Conventions to match

- Components are `.jsx`; co-locate a feature's components under `src/components/<feature>/`.
- API calls go through a domain module in `src/utils/api/` — don't call axios directly from components.
- Codebase has heavy `console.log` debugging and commented-out code blocks throughout; prefer leaving cleaner code than you found, but this is the existing baseline.

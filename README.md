# ImaginePhilippines MVP

## Run

```bash
npm start
```

The app runs at `http://127.0.0.1:8080`.

## API Endpoints

- `POST /api/search`
  - Returns in-page booking result data for flights, hotels, experiences, and cars.
- `GET|POST /api/cms/content`
  - Returns CMS content grouped by section.
  - Query/body: `city`, `page`, optional `section`.
- `GET|POST|PUT|DELETE /api/cms/items`
  - Full content CRUD for admin.
  - Supports booking metadata fields per card:
    - `bookingMode`: `none` | `book` | `provider` | `info`
    - `bookingType`: `hotels` | `experiences` | `flights` | `cars`
    - `ctaLabel`, `ctaUrl`, `bookingInfo`
- `GET /api/booking/inventory`
  - Returns public booking inventory rows.
- `GET|POST|PUT|DELETE /api/admin/booking-inventory`
  - Full booking inventory CRUD for admin.
- `GET /api/partners`
  - Returns published partner income-stream programs for the public partner page and partner account dashboard.
- `POST /api/auth/login`
- `POST /api/auth/signup`
- `POST /api/auth/logout`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET|PUT /api/auth/profile`

## Booking Affiliate Setup

Configure values in `booking.js`:

- `AFFILIATE.bookingAid`
- `AFFILIATE.label`
- `AFFILIATE.endpoints.flights`
- `AFFILIATE.endpoints.hotels`
- `AFFILIATE.endpoints.experiences`
- `AFFILIATE.endpoints.cars`

## RAG Integration

Optional env var:

```bash
RAG_API_URL="https://your-rag-endpoint/chat" npm start
```

If `RAG_API_URL` is set, the server proxies chat requests to that endpoint. Otherwise, it uses a local fallback assistant.

## Deploy To Vercel

1. Push this repository to GitHub.
2. In Vercel, import the repo and keep defaults (`Framework Preset: Other`).
3. Add optional env var in Vercel project settings:

```bash
RAG_API_URL=https://your-rag-endpoint/chat
```

4. Deploy.

The site pages are served as static files, and APIs run from:

- `/api/search`
- `/api/cms/content`
- `/api/cms/items`
- `/api/booking/inventory`
- `/api/admin/booking-inventory`
- `/api/partners`
- `/api/auth/login`
- `/api/auth/signup`
- `/api/auth/logout`
- `/api/auth/forgot-password`
- `/api/auth/reset-password`
- `/api/auth/profile`

## Vercel Free Tier API Limit (Max 12)

This repo enforces a hard deployment cap of 12 API functions.

- `npm run vercel-build` runs both:
  - `npm run api:enforce-limit`
  - `npm run check:vercel-api-limit`
- If function count is above 12, deploy fails.
- Overflow functions are auto-moved from `api/` to `api_disabled/` based on priority order.

Policy and operations guide:

- `docs/vercel-api-limit-policy.md`

## CMS Admin

- Open `admin.html` for the CMS UI.
- ADMIN CMS access is role-gated. A signed-in profile must have role `admin`; non-admin users should not see the ADMIN CMS link and cannot read or write `/api/cms/items`.
- Manage content for:
  - Homepage sections
  - Things To Do
  - Events
  - Eat & Drink
  - Where to Stay
  - Maps & Guides
- Changes reflect on `index.html` and section pages.

## Partner Program System

- Open `partner.html` to see how partner pages package income streams.
- Partner programs load from `GET /api/partners?city=davao`.
- Supabase-backed deployments should apply `supabase/migrations/20260516_add_acl_partner_programs.sql`, which creates:
  - `access_roles`
  - `access_rules`
  - `partner_programs`
- Local development falls back to `data/partner_programs.json` when Supabase is not enabled.

## Supabase Migration Path

Current MVP storage is `data/cms_content.json`. To migrate to Supabase:

1. Create a `cms_items` table in Supabase with columns matching API fields:
   - `id`, `city`, `page`, `section`, `title`, `text`, `image`, `meta`, `tag`, `tags`, `cta_label`, `cta_url`, `booking_mode`, `booking_type`, `booking_info`, `sort_order`, `created_at`, `updated_at`
2. Add environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Replace file-store functions in `api/_lib/cms-store.js` with Supabase queries.
4. Keep `api/cms/content` and `api/cms/items` routes unchanged so frontend/admin UI continues to work without redesign.
5. Apply the ACL and partner-program migration before using page-specific CMS roles or Supabase-backed partner programs.

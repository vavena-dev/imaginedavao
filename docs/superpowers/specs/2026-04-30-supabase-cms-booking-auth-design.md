# Supabase CMS, Booking Rows, and User Auth Design

This design defines a phased architecture for ImagineDavao to support full admin-managed content in Supabase, booking results shown as row-based listings, and authenticated end-user flows. The goal is to keep the existing site experience and design language while replacing file-backed content with database-backed content and preparing the platform for multiple Philippine cities.

## Scope and sequencing

This work is intentionally split into three implementation phases to reduce delivery risk:

1. Phase A: Supabase-backed CMS and admin management for public content sections.
2. Phase B: Booking output redesign from tile cards to row-based list presentation.
3. Phase C: End-user authentication and account-aware booking/information flows.

The phases are cumulative. Phase A must land first because Phase B and C rely on shared data, roles, and API boundaries introduced there.

## Current state summary

The repository currently has a functional admin page (`admin.html`) and CMS APIs (`/api/cms/content`, `/api/cms/items`) backed by `data/cms_content.json`. Public pages already consume CMS-shaped payloads through project APIs. Booking search and result rendering are implemented, but result UI is card/tile oriented. Authentication for end users is not yet present.

## Chosen design decisions

- Admin access model: Supabase Auth with role-based admin enforcement.
- Media model: both image upload (Supabase Storage) and external image URL supported.
- Data model: hybrid. Shared `content_blocks` table for most sections, specialized `booking_inventory` table for booking-oriented records.
- Data access model: server API only. Frontend calls project `/api/*`; server queries Supabase.
- Initial specialization: booking only. Other sections use shared content table.

## Architecture

### Client surfaces

Public pages (`index`, `things`, `events`, `eat`, `stay`, `guides`, `booking`) remain static HTML/CSS/JS shells that fetch data from project APIs.

Admin pages are also web UI, but all write operations require authenticated admin role.

### Server API boundary

All reads and writes pass through project APIs. The browser does not use Supabase service keys. This keeps authorization and validation logic centralized and avoids accidental privilege leaks.

### Data and storage

Supabase Postgres stores content and booking records. Supabase Storage stores uploaded media files. Content records may alternatively point to external image URLs.

### Authorization

Supabase Auth manages sessions. A `profiles` table maps users to roles (`admin`, `user`). API middleware resolves caller identity and authorizes write operations accordingly.

## Data model

### profiles

Purpose: role lookup and future user features.

Columns:

- `id` UUID primary key (matches Supabase Auth user id)
- `email` text
- `role` text check (`admin`, `user`)
- `created_at` timestamptz
- `updated_at` timestamptz

### content_blocks (shared CMS table)

Purpose: all editorial content for `index`, `things`, `events`, `eat`, `stay`, `guides` and reusable sections.

Columns:

- `id` UUID primary key
- `city` text (e.g. `davao`)
- `page` text (`index`, `things`, `events`, `eat`, `stay`, `guides`)
- `section` text (`things`, `events`, `eat`, `stay`, `guides`, `districts`, `deals`)
- `title` text
- `body` text
- `image_mode` text check (`upload`, `url`)
- `image_url` text
- `storage_path` text nullable
- `meta` text nullable
- `tag` text nullable
- `tags` text[] nullable
- `cta_label` text nullable
- `cta_url` text nullable
- `booking_mode` text check (`none`, `book`, `provider`, `info`)
- `booking_type` text check nullable (`hotels`, `flights`, `experiences`, `cars`)
- `booking_info` text nullable
- `status` text check (`draft`, `published`)
- `sort_order` integer
- `created_by` UUID nullable references `profiles(id)`
- `updated_by` UUID nullable references `profiles(id)`
- `created_at` timestamptz
- `updated_at` timestamptz

### booking_inventory (specialized table)

Purpose: structured booking listing records used by row/list output in booking surface.

Columns:

- `id` UUID primary key
- `city` text
- `category` text check (`flights`, `hotels`, `experiences`, `cars`)
- `provider_name` text
- `title` text
- `description` text
- `location_label` text nullable
- `price_amount` numeric nullable
- `price_currency` text default `PHP`
- `price_unit` text nullable
- `rating` numeric nullable
- `review_count` integer nullable
- `thumbnail_mode` text check (`upload`, `url`)
- `thumbnail_url` text
- `thumbnail_storage_path` text nullable
- `affiliate_url` text nullable
- `bookable` boolean default `true`
- `status` text check (`draft`, `published`)
- `sort_order` integer
- `created_by` UUID nullable references `profiles(id)`
- `updated_by` UUID nullable references `profiles(id)`
- `created_at` timestamptz
- `updated_at` timestamptz

### Storage bucket

Bucket name: `cms-media`.

Path convention:

- Content uploads: `content/<city>/<page>/<uuid>.<ext>`
- Booking uploads: `booking/<city>/<category>/<uuid>.<ext>`

## API contract

### Auth

- `POST /api/auth/login` input `{ email, password }` output `{ accessToken, refreshToken, user }`
- `POST /api/auth/logout`
- `GET /api/auth/me` output `{ user: { id, email, role } }`

### Shared content

- `GET /api/cms/content?city=&page=&section=` for published public reads
- `GET /api/admin/content?...` for admin reads (includes drafts)
- `POST /api/admin/content` create
- `PUT /api/admin/content/:id` update
- `DELETE /api/admin/content/:id` delete

### Booking inventory

- `GET /api/booking/inventory?city=&category=` public published rows
- `GET /api/admin/booking-inventory?...` admin list
- `POST /api/admin/booking-inventory` create
- `PUT /api/admin/booking-inventory/:id` update
- `DELETE /api/admin/booking-inventory/:id` delete

### Media

- `POST /api/admin/media/upload` multipart payload (`file`, context fields)
- URL mode is stored directly from admin payload with `image_mode=\"url\"`

### Validation rules

- `city`, `page`, `section`, `category` restricted to known values.
- `status=published` requires required display fields (`title`, `body`, image).
- `booking_mode=book` requires `booking_type` or valid `cta_url`.
- Upload mode requires successful storage URL/path.

## Admin UX design

### Login and authorization

Admin entry route requires authenticated session. Non-admin users are blocked from admin CRUD surfaces.

### Admin dashboard structure

Two top-level management areas:

1. Content Blocks (shared table)
2. Booking Inventory (specialized table)

Each includes filters by city, status, and contextual dimension (page/section or category).

### Editor form behavior

Form supports:

- add/update/delete
- draft/published state
- upload image or paste image URL
- booking action behavior (`none`, `book`, `provider`, `info`)

### Publishing lifecycle

Draft first, publish when complete. Unpublish remains supported.

## Public rendering behavior

- Public APIs return only `published` records.
- Existing page scripts keep current rendering hooks but source data from Supabase-backed APIs.
- If API fails, frontend falls back to current local defaults to avoid blank screens.

## Phase B design (booking rows)

Booking results should be rendered as rows rather than large tiles.

Row layout:

- Left: title, provider, location, brief description.
- Middle: badges, rating, review count, availability cues.
- Right: image/logo thumbnail, price block, main action (`Open Booking`).

Category variations:

- Flights: airline icon/logo and route metadata.
- Hotels/stays: property image and nightly pricing.
- Cars: rental brand icon/image and daily pricing.
- Experiences: contextual image and booking/info action from `booking_inventory`.
- Eat & drink and events: booking/info action from `content_blocks` (`booking_mode` + CTA fields), with optional linkage to specialized inventory later if needed.

Visual style should reuse current surface/background tokens and button language already used across pages.

## Phase C design (end-user authentication)

### User features

Authenticated users can:

- save booking intents
- view personalized booking history (where applicable)
- save favorite places/events/guides
- manage profile basics

### Public vs authenticated behavior

- Anonymous users can browse and initiate booking.
- Authenticated users get saved state and account-specific actions.

### Booking and info actions

Users can:

- book via in-site flow where configured
- follow provider links where configured
- view booking instructions where `booking_mode=info`

## Migration plan from file store

1. Create Supabase tables and storage bucket.
2. Seed `content_blocks` from `data/cms_content.json` via migration script.
3. Keep existing API shapes so frontend requires minimal changes.
4. Introduce backend switch flag: `CMS_BACKEND=file|supabase` for safe rollout.
5. Default to Supabase after verification and keep fallback path temporarily.
6. Remove file mode once stable in production.

## Error handling and reliability

- API returns clear JSON errors and status codes.
- Admin UI surfaces validation errors inline.
- Upload failures do not create partial published records.
- Public pages gracefully render fallback content if CMS read fails.

## Security and privacy requirements

- Service role key only on server.
- Admin write routes enforce session + role checks.
- CORS and origin controls on auth-sensitive routes.
- Input validation and allowlist checks for enums and URLs.
- Storage paths are generated server-side, not trusted from client input.

## Testing strategy

### Backend tests

- Authorization tests: admin vs user vs anonymous on write endpoints.
- Validation tests for required fields and enum constraints.
- Content query tests by city/page/section and published filtering.
- Upload flow tests for both upload mode and URL mode.

### Frontend tests

- Admin form flows: create, edit, delete, publish/unpublish.
- Public page rendering from API data for each section.
- Booking row rendering for each category.
- Regression check for fallback behavior when API is unavailable.

### End-to-end checks

- Login as admin, create content, publish, verify visible on public page.
- Upload image and confirm rendering.
- Create booking inventory item and verify row output.

## Out-of-scope for this spec

- Payment processing and checkout settlement.
- Complex recommendation/ranking systems.
- Multi-tenant billing and enterprise permissions.

## Success criteria

- Admin can CRUD all targeted content sections.
- All targeted sections read from Supabase-backed data.
- Booking output renders row/list style with category-aware media.
- Authenticated user model is in place for subsequent booking and personalization features.

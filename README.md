# ImaginePhilippines MVP

## Run

```bash
npm start
```

The app runs at `http://127.0.0.1:8080`.

## API Endpoints

- `POST /api/book-link`
  - Creates a tracked affiliate URL.
  - Local `npm start`: logs click metadata to `data/booking_clicks.jsonl`.
  - Vercel deploy: logs best-effort to temporary serverless storage.
- `POST /api/search`
  - Returns in-page booking result data for flights, hotels, experiences, and cars.
- `POST /api/chat/stream`
  - Streams chat responses (SSE) and returns booking action buttons.
- `GET|POST /api/cms/content`
  - Returns CMS content grouped by section.
  - Query/body: `city`, `page`, optional `section`.
- `GET|POST|PUT|DELETE /api/cms/items`
  - Full content CRUD for admin.
  - Supports booking metadata fields per card:
    - `bookingMode`: `none` | `book` | `provider` | `info`
    - `bookingType`: `hotels` | `experiences` | `flights` | `cars`
    - `ctaLabel`, `ctaUrl`, `bookingInfo`

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
- `/api/book-link`
- `/api/chat/stream`
- `/api/cms/content`
- `/api/cms/items`

## CMS Admin

- Open `admin.html` for the CMS UI.
- Manage content for:
  - Homepage sections
  - Things To Do
  - Events
  - Eat & Drink
  - Where to Stay
  - Maps & Guides
- Changes reflect on `index.html` and section pages.

## Supabase Migration Path

Current MVP storage is `data/cms_content.json`. To migrate to Supabase:

1. Create a `cms_items` table in Supabase with columns matching API fields:
   - `id`, `city`, `page`, `section`, `title`, `text`, `image`, `meta`, `tag`, `tags`, `cta_label`, `cta_url`, `booking_mode`, `booking_type`, `booking_info`, `sort_order`, `created_at`, `updated_at`
2. Add environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Replace file-store functions in `api/_lib/cms-store.js` with Supabase queries.
4. Keep `api/cms/content` and `api/cms/items` routes unchanged so frontend/admin UI continues to work without redesign.

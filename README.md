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

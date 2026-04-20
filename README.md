# ImaginePhilippines MVP

## Run

```bash
npm start
```

The app runs at `http://127.0.0.1:8080`.

## API Endpoints

- `POST /api/book-link`
  - Creates a tracked affiliate URL and logs click metadata to `data/booking_clicks.jsonl`.
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
# imaginedavao
# imaginedavao

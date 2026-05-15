const http = require("http");
const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const raw = fs.readFileSync(filePath, "utf8");
  const lines = raw.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx <= 0) continue;
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(path.join(process.cwd(), ".env.local"));
loadEnvFile(path.join(process.cwd(), ".env"));

const cmsContentHandler = require("./api/cms/content");
const cmsItemsHandler = require("./api/cms/items");
const searchHandler = require("./api/search");
const partnersHandler = require("./api/partners");
const bookingInventoryHandler = require("./api/booking/inventory");
const adminBookingInventoryHandler = require("./api/admin/booking-inventory");
const authLoginHandler = require("./api/auth/login");
const authSignupHandler = require("./api/auth/signup");
const authLogoutHandler = require("./api/auth/logout");
const authForgotPasswordHandler = require("./api/auth/forgot-password");
const authResetPasswordHandler = require("./api/auth/reset-password");
const authProfileHandler = require("./api/auth/profile");

const HOST = process.env.HOST || "127.0.0.1";
const PORT = Number(process.env.PORT || 8080);
const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "data");
const CLICKS_LOG = path.join(DATA_DIR, "booking_clicks.jsonl");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

const RESULT_IMAGES = {
  hotels: [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Davao_City_skyline_at_night_01.jpg/1920px-Davao_City_skyline_at_night_01.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Davao_Agdao_skyline_%28Davao_City%3B_04-22-2024%29.jpg/1920px-Davao_Agdao_skyline_%28Davao_City%3B_04-22-2024%29.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Davao_City_Coastal_Road.jpg/1920px-Davao_City_Coastal_Road.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Davao_skyline_at_Jackridge_Resort_and_Restaurant.jpg/1920px-Davao_skyline_at_Jackridge_Resort_and_Restaurant.jpg"
  ],
  flights: [
    "https://upload.wikimedia.org/wikipedia/commons/0/04/2022-10-07_Davao-Samal_Bridge_001.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/4/4f/2022-10-07_Davao-Samal_Bridge_002.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/2025-07-19_Bucana_Bridge_007.jpg/1920px-2025-07-19_Bucana_Bridge_007.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Davao_City_Coastal_Road_Bucana_northbound_%28Davao_City%3B_08-21-2023%29.jpg/1920px-Davao_City_Coastal_Road_Bucana_northbound_%28Davao_City%3B_08-21-2023%29.jpg"
  ],
  experiences: [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Kadayawan_Festival.jpg/1920px-Kadayawan_Festival.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Celebrating_Kadayawan_Festival.jpg/1920px-Celebrating_Kadayawan_Festival.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Roxas_Ave_Night_Market_001.jpg/1920px-Roxas_Ave_Night_Market_001.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Roxas_Ave_Night_Market_002.jpg/1920px-Roxas_Ave_Night_Market_002.jpg"
  ],
  cars: [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Mount_Apo_Banner.JPG/1920px-Mount_Apo_Banner.JPG",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Mount_Apo_Rainforest.jpg/1920px-Mount_Apo_Rainforest.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Lake_Venado.jpg/1920px-Lake_Venado.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Fruit_market_in_Magsaysay_Davao_City.jpg/1920px-Fruit_market_in_Magsaysay_Davao_City.jpg"
  ]
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

async function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];

    req.on("data", (chunk) => {
      chunks.push(chunk);
      const size = chunks.reduce((sum, item) => sum + item.length, 0);
      if (size > 1_000_000) {
        reject(new Error("Payload too large"));
      }
    });

    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("Invalid JSON payload"));
      }
    });

    req.on("error", reject);
  });
}

async function appendClickLog(entry) {
  await fsp.mkdir(DATA_DIR, { recursive: true });
  await fsp.appendFile(CLICKS_LOG, JSON.stringify(entry) + "\n", "utf8");
}

function buildTrackedUrl(urlString, trackId) {
  const url = new URL(urlString);
  url.searchParams.set("aff_track", trackId);
  return url.toString();
}

function buildAssistantReply(message, city) {
  const lower = message.toLowerCase();
  const cityLabel = city || "your city";

  let focus = "a balanced city trip";
  if (lower.includes("hotel") || lower.includes("stay")) focus = "best-value hotels";
  if (lower.includes("flight")) focus = "flight options";
  if (lower.includes("car")) focus = "car rentals";
  if (lower.includes("experience") || lower.includes("tour") || lower.includes("activity")) focus = "experiences and tours";

  const text = `Great choice. I can help you plan ${focus} for ${cityLabel}. Start with the booking action below, then I can refine by budget, travel dates, and traveler type.`;

  const actions = [
    { type: "book", label: "Book Flights", tab: "flights" },
    { type: "book", label: "Book Hotels", tab: "hotels" },
    { type: "book", label: "Book Experiences", tab: "experiences" },
    { type: "book", label: "Book Cars", tab: "cars" }
  ];

  return { text, actions };
}

async function handleBookLink(req, res) {
  try {
    const body = await readBody(req);
    const { url, category = "unknown", city = "unknown", payload = {}, source = "web", title = "" } = body;

    if (!url || typeof url !== "string") {
      sendJson(res, 400, { error: "Missing booking URL" });
      return;
    }

    const trackId = crypto.randomUUID();
    const trackedUrl = buildTrackedUrl(url, trackId);
    const safePayload = payload && typeof payload === "object" ? { ...payload } : {};
    delete safePayload.userId;
    delete safePayload.userEmail;

    await appendClickLog({
      trackId,
      timestamp: new Date().toISOString(),
      category,
      city,
      source,
      title,
      url,
      trackedUrl,
      payload: safePayload
    });

    sendJson(res, 200, { trackId, trackedUrl });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Failed to create booking link" });
  }
}

function asNumber(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function buildResultSet(category, city, payload = {}) {
  const cityLabel = city || "Davao";
  const images = RESULT_IMAGES[category] || RESULT_IMAGES.hotels;
  const adults = asNumber(payload.adults, 2);

  if (category === "flights") {
    const origin = payload.origin || "MNL";
    const destination = payload.destination || "DVO";
    return Array.from({ length: 4 }).map((_, idx) => ({
      id: `flight-${idx + 1}`,
      title: `${origin} to ${destination} • ${cityLabel} Saver ${idx + 1}`,
      description: `Flexible fare with ${adults} passenger${adults > 1 ? "s" : ""}, baggage option available.`,
      rating: (4.2 + idx * 0.1).toFixed(1),
      location: `${origin} → ${destination}`,
      price: 2600 + idx * 850,
      currency: "PHP",
      priceUnit: "per passenger",
      image: images[idx % images.length]
    }));
  }

  if (category === "experiences") {
    const interest = payload.interest || "city highlights";
    return Array.from({ length: 4 }).map((_, idx) => ({
      id: `exp-${idx + 1}`,
      title: `${cityLabel} ${interest} Experience ${idx + 1}`,
      description: "Hosted activity with local guide, curated route, and priority slots.",
      rating: (4.4 + idx * 0.1).toFixed(1),
      location: cityLabel,
      price: 1200 + idx * 300,
      currency: "PHP",
      priceUnit: "per guest",
      image: images[idx % images.length]
    }));
  }

  if (category === "cars") {
    return Array.from({ length: 4 }).map((_, idx) => ({
      id: `car-${idx + 1}`,
      title: `${cityLabel} Car Class ${idx + 1}`,
      description: "Automatic transmission, insurance options, and flexible pick-up windows.",
      rating: (4.1 + idx * 0.1).toFixed(1),
      location: cityLabel,
      price: 1800 + idx * 520,
      currency: "PHP",
      priceUnit: "per day",
      image: images[idx % images.length]
    }));
  }

  const destination = payload.destination || cityLabel;
  const rooms = asNumber(payload.rooms, 1);
  return Array.from({ length: 4 }).map((_, idx) => ({
    id: `hotel-${idx + 1}`,
    title: `${destination} Hotel Collection ${idx + 1}`,
    description: `${rooms} room plan with breakfast options and city access.`,
    rating: (4.3 + idx * 0.1).toFixed(1),
    location: destination,
    price: 3200 + idx * 950,
    currency: "PHP",
    priceUnit: "per night",
    image: images[idx % images.length]
  }));
}

async function handleSearch(req, res) {
  try {
    const body = await readBody(req);
    const category = String(body.category || "hotels").toLowerCase();
    const city = String(body.city || "Davao");
    const payload = body.payload && typeof body.payload === "object" ? body.payload : {};

    if (!["flights", "hotels", "experiences", "cars"].includes(category)) {
      sendJson(res, 400, { error: "Unsupported category" });
      return;
    }

    const results = buildResultSet(category, city, payload);
    sendJson(res, 200, { category, city, results });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Failed to generate results" });
  }
}

async function proxyRagIfConfigured(message, city, history) {
  const endpoint = process.env.RAG_API_URL;
  if (!endpoint) return null;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, city, history })
    });

    if (!response.ok) return null;
    const data = await response.json();
    if (!data || typeof data.answer !== "string") return null;

    return {
      text: data.answer,
      actions: Array.isArray(data.actions)
        ? data.actions
        : [
            { type: "book", label: "Book Flights", tab: "flights" },
            { type: "book", label: "Book Hotels", tab: "hotels" }
          ]
    };
  } catch {
    return null;
  }
}

async function handleChatStream(req, res) {
  let body;
  try {
    body = await readBody(req);
  } catch (error) {
    sendJson(res, 400, { error: error.message || "Invalid request" });
    return;
  }

  const message = String(body.message || "").trim();
  const city = String(body.city || "Davao");
  const history = Array.isArray(body.history) ? body.history : [];

  if (!message) {
    sendJson(res, 400, { error: "Message is required" });
    return;
  }

  const ragReply = await proxyRagIfConfigured(message, city, history);
  const assistant = ragReply || buildAssistantReply(message, city);

  res.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive"
  });

  const emit = (payload) => {
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  };

  emit({ type: "start" });

  const words = assistant.text.split(" ");
  for (let index = 0; index < words.length; index += 1) {
    const chunk = index === 0 ? words[index] : ` ${words[index]}`;
    emit({ type: "token", text: chunk });
    await new Promise((resolve) => setTimeout(resolve, 20));
  }

  emit({ type: "actions", actions: assistant.actions || [] });
  emit({ type: "done" });
  res.end();
}

async function serveStatic(req, res, pathname) {
  const safePath = path.normalize(pathname).replace(/^\/+/g, "");
  const basePath = path.join(ROOT, safePath);
  const candidates = [];

  if (pathname === "/") {
    candidates.push(path.join(ROOT, "index.html"));
  } else {
    candidates.push(basePath);
    candidates.push(path.join(basePath, "index.html"));

    // Allow extensionless routes like /eat to resolve to /eat.html.
    if (!path.extname(basePath)) {
      candidates.push(`${basePath}.html`);
    }
  }

  for (const candidate of candidates) {
    if (!candidate.startsWith(ROOT)) {
      sendJson(res, 403, { error: "Forbidden" });
      return;
    }

    try {
      const stat = await fsp.stat(candidate);
      let filePath = candidate;

      if (stat.isDirectory()) {
        filePath = path.join(candidate, "index.html");
        const indexStat = await fsp.stat(filePath);
        if (!indexStat.isFile()) {
          continue;
        }
      } else if (!stat.isFile()) {
        continue;
      }

      const ext = path.extname(filePath).toLowerCase();
      const type = MIME[ext] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": type });

      if (req.method === "HEAD") {
        res.end();
        return;
      }

      fs.createReadStream(filePath).pipe(res);
      return;
    } catch {
      // Try next candidate.
    }
  }

  sendJson(res, 404, { error: "Not found" });
}

const server = http.createServer(async (req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host || `${HOST}:${PORT}`}`);

  if (req.method === "POST" && reqUrl.pathname === "/api/book-link") {
    await handleBookLink(req, res);
    return;
  }

  if (req.method === "POST" && reqUrl.pathname === "/api/chat/stream") {
    await handleChatStream(req, res);
    return;
  }

  if (req.method === "POST" && reqUrl.pathname === "/api/search") {
    await searchHandler(req, res);
    return;
  }

  if (req.method === "GET" && reqUrl.pathname === "/api/partners") {
    await partnersHandler(req, res);
    return;
  }

  if (req.method === "POST" && reqUrl.pathname === "/api/auth/login") {
    await authLoginHandler(req, res);
    return;
  }

  if (req.method === "POST" && reqUrl.pathname === "/api/auth/signup") {
    await authSignupHandler(req, res);
    return;
  }

  if (req.method === "POST" && reqUrl.pathname === "/api/auth/logout") {
    await authLogoutHandler(req, res);
    return;
  }

  if (req.method === "POST" && reqUrl.pathname === "/api/auth/forgot-password") {
    await authForgotPasswordHandler(req, res);
    return;
  }

  if (req.method === "POST" && reqUrl.pathname === "/api/auth/reset-password") {
    await authResetPasswordHandler(req, res);
    return;
  }

  if ((req.method === "GET" || req.method === "PUT") && reqUrl.pathname === "/api/auth/profile") {
    await authProfileHandler(req, res);
    return;
  }

  if ((req.method === "GET" || req.method === "POST") && reqUrl.pathname === "/api/cms/content") {
    await cmsContentHandler(req, res);
    return;
  }

  if (["GET", "POST", "PUT", "DELETE"].includes(req.method) && reqUrl.pathname === "/api/cms/items") {
    await cmsItemsHandler(req, res);
    return;
  }

  if (req.method === "GET" && reqUrl.pathname === "/api/booking/inventory") {
    await bookingInventoryHandler(req, res);
    return;
  }

  if (["GET", "POST", "PUT", "DELETE"].includes(req.method) && reqUrl.pathname === "/api/admin/booking-inventory") {
    await adminBookingInventoryHandler(req, res);
    return;
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  if (reqUrl.pathname.endsWith(".html")) {
    const safePath = path.normalize(reqUrl.pathname).replace(/^\/+/g, "");
    const candidate = path.join(ROOT, safePath);

    if (!candidate.startsWith(ROOT)) {
      sendJson(res, 403, { error: "Forbidden" });
      return;
    }

    try {
      const stat = await fsp.stat(candidate);
      if (stat.isFile()) {
        const canonicalPath = reqUrl.pathname === "/index.html" ? "/" : reqUrl.pathname.slice(0, -5);
        const location = `${canonicalPath}${reqUrl.search}`;
        res.writeHead(308, { Location: location });
        res.end();
        return;
      }
    } catch {
      // Fall through to normal static handling.
    }
  }

  await serveStatic(req, res, reqUrl.pathname);
});

server.listen(PORT, HOST, () => {
  console.log(`Imagine Davao server running at http://${HOST}:${PORT}`);
});

const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

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
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string" && req.body.trim()) {
    return JSON.parse(req.body);
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const raw = Buffer.concat(chunks).toString("utf8").trim();
  if (!raw) return {};
  return JSON.parse(raw);
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

function buildTrackedUrl(urlString, trackId) {
  const url = new URL(urlString);
  url.searchParams.set("aff_track", trackId);
  return url.toString();
}

function getIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket?.remoteAddress || "unknown";
}

async function appendClickLog(entry) {
  const filePath = path.join("/tmp", "booking_clicks.jsonl");
  await fs.appendFile(filePath, `${JSON.stringify(entry)}\n`, "utf8");
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

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function makeTrackId() {
  return crypto.randomUUID();
}

module.exports = {
  appendClickLog,
  buildAssistantReply,
  buildResultSet,
  buildTrackedUrl,
  getIp,
  makeTrackId,
  proxyRagIfConfigured,
  readJsonBody,
  sendJson,
  wait
};

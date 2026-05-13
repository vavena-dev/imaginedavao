#!/usr/bin/env node

const { createCmsItem, listCmsItems, updateCmsItem } = require("../lib/cms-store");

const CITY = "davao";
const PAGE = "now";

const seedItems = [
  {
    section: "hero",
    sortOrder: 1,
    title: "Experience Davao Through Its Events",
    text: "From major cultural festivals to curated weekend experiences, discover what is happening across the city and book your place in minutes.",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1920&q=80",
    meta: "City Calendar + Signature Festivals",
    ctaLabel: "Explore Events",
    ctaUrl: "#eventsFeaturedGrid",
    bookingMode: "info",
    bookingType: "experiences",
    bookingInfo: "Book Event Plans",
    tag: "now_seed"
  },
  {
    section: "curation",
    sortOrder: 1,
    title: "Built for travelers who want culture, rhythm, and easy planning.",
    text: "Each featured event includes atmosphere details, ideal timing, and direct booking access so you can plan with confidence around your Davao itinerary.",
    meta: "Curation Notes",
    bookingMode: "none",
    tag: "now_seed"
  },
  {
    section: "stats",
    sortOrder: 1,
    title: "Featured Events",
    text: "5",
    bookingMode: "none",
    tag: "now_seed"
  },
  {
    section: "stats",
    sortOrder: 2,
    title: "District Zones",
    text: "4",
    bookingMode: "none",
    tag: "now_seed"
  },
  {
    section: "stats",
    sortOrder: 3,
    title: "Booking Path",
    text: "1",
    bookingMode: "none",
    tag: "now_seed"
  },
  {
    section: "events",
    sortOrder: 1,
    title: "Kadayawan Grand Parade",
    text: "The city's biggest cultural celebration with floral floats, street performances, and region-wide creative showcases.",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1400&q=80",
    meta: "Downtown Davao | August Program",
    tag: "Signature Festival",
    tags: ["Full-day parade route", "Traditional dance showcases", "Best for first-time visitors"],
    ctaLabel: "Learn more",
    ctaUrl: "event-kadayawan-grand-parade.html",
    bookingMode: "info",
    bookingInfo: "booking.html#experiences"
  },
  {
    section: "events",
    sortOrder: 2,
    title: "Lanterns on the Gulf",
    text: "A waterfront evening event with live music, illuminated art installations, and curated local food stations.",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1400&q=80",
    meta: "Coastal Davao Gulf | Friday Evenings",
    tag: "Night Culture",
    tags: ["Sunset-to-night schedule", "Family-friendly route", "Easy transfer options"],
    ctaLabel: "Learn more",
    ctaUrl: "event-lanterns-on-the-gulf.html",
    bookingMode: "info",
    bookingInfo: "booking.html#experiences"
  },
  {
    section: "events",
    sortOrder: 3,
    title: "Mindanao Coffee & Music Social",
    text: "An open-air weekend social featuring regional coffee roasters, acoustic sets, and local artisan pop-up stalls.",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1400&q=80",
    meta: "Poblacion District | Weekend Mornings",
    tag: "Music + Food Weekend",
    tags: ["Small-stage local artists", "Coffee tasting lanes", "Strong for groups and couples"],
    ctaLabel: "Learn more",
    ctaUrl: "event-mindanao-coffee-music-social.html",
    bookingMode: "info",
    bookingInfo: "booking.html#experiences"
  },
  {
    section: "events",
    sortOrder: 4,
    title: "Davao River Night Run",
    text: "A guided evening run featuring lit route markers, hydration points, and post-run local snacks by the river.",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1400&q=80",
    meta: "Riverside Zone | Monthly Edition",
    tag: "Active City Series",
    tags: ["Timed and non-timed tracks", "Community run format", "Beginner-friendly pacing"],
    ctaLabel: "Learn more",
    ctaUrl: "event-davao-river-night-run.html",
    bookingMode: "info",
    bookingInfo: "booking.html#experiences"
  },
  {
    section: "events",
    sortOrder: 5,
    title: "Poblacion Food & Culture Walk",
    text: "A hosted evening trail through heritage lanes, tasting stops, and storytelling points led by local guides.",
    image: "https://images.unsplash.com/photo-1523451190197-94e8f8ce2f76?auto=format&fit=crop&w=1400&q=80",
    meta: "Poblacion Core | Tuesday and Saturday",
    tag: "Neighborhood Culture",
    tags: ["Guided bilingual hosts", "Local heritage narration", "Includes tasting credits"],
    ctaLabel: "Learn more",
    ctaUrl: "event-poblacion-food-culture-walk.html",
    bookingMode: "info",
    bookingInfo: "booking.html#experiences"
  },
  {
    section: "planning",
    sortOrder: 1,
    title: "Mix Major + Local Picks",
    text: "Pair one large festival moment with one neighborhood-led event for a fuller view of Davao culture.",
    meta: "Plan A Stronger Events Weekend",
    bookingMode: "none",
    tag: "now_seed"
  },
  {
    section: "planning",
    sortOrder: 2,
    title: "Book Before Peak Hours",
    text: "Popular evening slots and festival access windows fill quickly, especially during long weekends.",
    meta: "Plan A Stronger Events Weekend",
    bookingMode: "none",
    tag: "now_seed"
  },
  {
    section: "planning",
    sortOrder: 3,
    title: "Bundle With Transport",
    text: "After selecting your events, secure transfer options in the same booking flow for smoother city movement.",
    meta: "Plan A Stronger Events Weekend",
    bookingMode: "none",
    tag: "now_seed"
  }
];

async function upsertNowItems() {
  const existing = await listCmsItems({ city: CITY, page: PAGE }, { includeDrafts: true });

  const byKey = new Map(
    existing.map((item) => [`${item.section}::${item.title}`.toLowerCase(), item])
  );

  let created = 0;
  let updated = 0;

  for (const seed of seedItems) {
    const payload = {
      city: CITY,
      page: PAGE,
      status: "published",
      ...seed
    };

    const key = `${payload.section}::${payload.title}`.toLowerCase();
    const match = byKey.get(key);

    if (match) {
      await updateCmsItem(match.id, { ...payload, id: match.id });
      updated += 1;
    } else {
      await createCmsItem(payload);
      created += 1;
    }
  }

  const finalRows = await listCmsItems({ city: CITY, page: PAGE }, { includeDrafts: true });

  console.log(`seed-now-content complete: created=${created}, updated=${updated}, total_now_items=${finalRows.length}`);
}

upsertNowItems().catch((error) => {
  console.error("seed-now-content failed:", error.message || error);
  process.exit(1);
});

#!/usr/bin/env node

const { createCmsItem, listCmsItems, updateCmsItem } = require("../lib/cms-store");

const CITY = "davao";

const seeds = {
  things: [
    { section: "hero", sortOrder: 1, title: "Discover the Best Things to Do in Davao", text: "From island escapes and mountain routes to chocolate farms and culture-rich neighborhoods, build a Davao itinerary that feels personal, local and unforgettable.", image: "https://images.unsplash.com/photo-1646940413673-e935f5ab9756?auto=format&fit=crop&w=1960&q=80", meta: "Things to Do", tag: "Photo: Davao Gulf viewpoint", bookingMode: "none" },
    { section: "spotlight", sortOrder: 1, title: "Kadayawan Cultural Week Routes", text: "Plan your week around floral floats, indigenous weaving showcases and curated food stops across downtown Davao.", meta: "Seasonal Highlight", ctaLabel: "Learn more", ctaUrl: "activity-kadayawan-culture-walk.html", bookingMode: "none" },
    { section: "newsletter", sortOrder: 1, title: "Trip Updates", text: "Receive curated guides on festivals, outdoor activities and weekend-ready itineraries in Davao.", bookingMode: "none" },
    { section: "topics", sortOrder: 1, title: "Adventure", ctaUrl: "#adventure", bookingMode: "none" },
    { section: "topics", sortOrder: 2, title: "Culture", ctaUrl: "#culture", bookingMode: "none" },
    { section: "topics", sortOrder: 3, title: "Nature", ctaUrl: "#nature", bookingMode: "none" },
    { section: "topics", sortOrder: 4, title: "Food Experiences", ctaUrl: "#food", bookingMode: "none" },
    { section: "topics", sortOrder: 5, title: "Waterfront", ctaUrl: "#water", bookingMode: "none" },
    { section: "topics", sortOrder: 6, title: "Family Friendly", ctaUrl: "#family", bookingMode: "none" },
    { section: "cards", sortOrder: 1, title: "Samal Island Hopping Day", text: "Snorkel over reef gardens, relax on powdery coves and visit marine sanctuaries just off Davao City.", image: "https://images.unsplash.com/photo-1530973428-5bf2db2e4d71?auto=format&fit=crop&w=1280&q=80", tag: "Waterfront", meta: "water", ctaLabel: "Learn more", ctaUrl: "activity-samal-island-hopping.html", bookingMode: "info", bookingInfo: "booking.html#experiences", bookingType: "experiences" },
    { section: "cards", sortOrder: 2, title: "Mt. Apo Highland Trek", text: "Take a guided trek to dramatic volcanic ridges, mossy forests and sunrise viewpoints above Mindanao.", image: "https://images.unsplash.com/photo-1588841296836-ee6cd5d4ff0f?auto=format&fit=crop&w=1280&q=80", tag: "Adventure", meta: "adventure", ctaLabel: "Learn more", ctaUrl: "activity-mt-apo-highland-trek.html", bookingMode: "info", bookingInfo: "booking.html#experiences", bookingType: "experiences" },
    { section: "cards", sortOrder: 3, title: "Philippine Eagle Center Visit", text: "Meet one of the world's largest eagles and learn conservation stories through ranger-led experiences.", image: "https://images.unsplash.com/photo-1516939884455-1445c8652f83?auto=format&fit=crop&w=1280&q=80", tag: "Nature", meta: "nature", ctaLabel: "Learn more", ctaUrl: "activity-philippine-eagle-center.html", bookingMode: "info", bookingInfo: "booking.html#experiences", bookingType: "experiences" },
    { section: "cards", sortOrder: 4, title: "Malagos Chocolate & Farm Tour", text: "Follow bean-to-bar cacao making, then taste award-winning dark chocolate paired with local fruit.", image: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=1280&q=80", tag: "Food Experiences", meta: "food", ctaLabel: "Learn more", ctaUrl: "activity-malagos-chocolate-farm-tour.html", bookingMode: "info", bookingInfo: "booking.html#experiences", bookingType: "experiences" },
    { section: "cards", sortOrder: 5, title: "Kadayawan Heritage Walk", text: "Explore museums, local art hubs and indigenous craft studios with a route inspired by Kadayawan stories.", image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1280&q=80", tag: "Culture", meta: "culture", ctaLabel: "Learn more", ctaUrl: "activity-kadayawan-culture-walk.html", bookingMode: "info", bookingInfo: "booking.html#experiences", bookingType: "experiences" },
    { section: "cards", sortOrder: 6, title: "Davao Gulf Sunset Cruise", text: "End the day with skyline views, live acoustic music and local dinner plates while cruising the gulf.", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1280&q=80", tag: "Family Friendly", meta: "family", ctaLabel: "Learn more", ctaUrl: "activity-davao-gulf-sunset-cruise.html", bookingMode: "info", bookingInfo: "booking.html#experiences", bookingType: "experiences" }
  ],
  eat: [
    { section: "hero", sortOrder: 1, title: "Explore Davao Through Its Tables, Markets, and Night Kitchens", text: "From heritage cooking houses to modern rooftop grills, this guide helps you map where to dine, what to order, and how to book your next meal-led city experience.", image: "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?auto=format&fit=crop&w=1980&q=80", meta: "Eat + Drink in Davao", ctaLabel: "Discover Places", ctaUrl: "#eatFeaturedGrid", bookingMode: "info", bookingType: "experiences", bookingInfo: "Book Dining Experiences" },
    { section: "curation", sortOrder: 1, title: "Every pick is selected for flavor, setting, and travel convenience.", text: "These featured spots are strong options for first-time visitors, returning food lovers, and groups planning a full day around Davao's food scene.", meta: "Curation Notes", bookingMode: "none" },
    { section: "stats", sortOrder: 1, title: "Featured Places", text: "6", bookingMode: "none" },
    { section: "stats", sortOrder: 2, title: "Dining Districts", text: "4", bookingMode: "none" },
    { section: "stats", sortOrder: 3, title: "Booking Hub", text: "1", bookingMode: "none" },
    { section: "cards", sortOrder: 1, title: "Tiny Kitchen & Dulce Vida", text: "Chef-led tasting sets highlighting Mindanao ingredients, served in a warm heritage-inspired dining room.", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1280&q=80", tag: "Filipino Heritage Dining", meta: "Bajada District", ctaLabel: "Learn more", ctaUrl: "eat-tiny-kitchen-dulce-vida.html", bookingMode: "info", bookingInfo: "booking.html#experiences", bookingType: "experiences" },
    { section: "cards", sortOrder: 2, title: "Luz Kinilaw House", text: "Bright, citrus-forward seafood plates and local-style kinilaw prepared daily with seasonal gulf catch.", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1280&q=80", tag: "Seafood + Kinilaw", meta: "Poblacion Waterfront", ctaLabel: "Learn more", ctaUrl: "eat-luz-kinilaw-house.html", bookingMode: "info", bookingInfo: "booking.html#experiences", bookingType: "experiences" },
    { section: "cards", sortOrder: 3, title: "Madayaw Rooftop Grill", text: "Evening grill sessions, city skyline views, and craft mocktails designed for long group dinners.", image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1280&q=80", tag: "Skyline Grill", meta: "Lanang", ctaLabel: "Learn more", ctaUrl: "eat-madayaw-rooftop-grill.html", bookingMode: "info", bookingInfo: "booking.html#experiences", bookingType: "experiences" },
    { section: "cards", sortOrder: 4, title: "Poblacion Coffee Social", text: "Single-origin Mindanao brews, all-day pastries, and laid-back lounge corners for remote or casual catch-ups.", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1280&q=80", tag: "Cafe Culture", meta: "Poblacion", ctaLabel: "Learn more", ctaUrl: "eat-poblacion-coffee-social.html", bookingMode: "info", bookingInfo: "booking.html#experiences", bookingType: "experiences" },
    { section: "cards", sortOrder: 5, title: "Bankerohan Breakfast Route", text: "A guided early route through fruit stalls, native rice cakes, and comfort-food counters beloved by locals.", image: "https://images.unsplash.com/photo-1611599538934-74f0ba6f58ad?auto=format&fit=crop&w=1280&q=80", tag: "Morning Market Trail", meta: "Bankerohan Public Market", ctaLabel: "Learn more", ctaUrl: "eat-bankerohan-breakfast-route.html", bookingMode: "info", bookingInfo: "booking.html#experiences", bookingType: "experiences" },
    { section: "cards", sortOrder: 6, title: "Davao Gulf Sundown Seafood", text: "Freshly grilled platters by the coast with sunset seating and easy transfer options from the city center.", image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1280&q=80", tag: "Sunset Dining", meta: "Coastal Davao Gulf", ctaLabel: "Learn more", ctaUrl: "eat-davao-gulf-sundown-seafood.html", bookingMode: "info", bookingInfo: "booking.html#experiences", bookingType: "experiences" },
    { section: "planning", sortOrder: 1, title: "Start With District Pairing", text: "Pair Bajada and Lanang for modern dining, then add Poblacion and Bankerohan for local flavor and market energy.", meta: "Plan Your Food-First Itinerary", bookingMode: "none" },
    { section: "planning", sortOrder: 2, title: "Reserve Peak Dinner Slots Early", text: "Rooftop and waterfront tables fill quickly on weekends and festival periods, so lock in your timing in advance.", meta: "Plan Your Food-First Itinerary", bookingMode: "none" },
    { section: "planning", sortOrder: 3, title: "Bundle With Activities", text: "After choosing your dining stops, continue to experiences or transport inside one booking flow for easier trip planning.", meta: "Plan Your Food-First Itinerary", bookingMode: "none" }
  ],
  guides: [
    { section: "hero", sortOrder: 1, title: "Navigate Davao Like You Already Know the City", text: "Build smarter itineraries with district-by-district routes, walkable culture loops and practical day plans curated for first-time and returning travelers.", image: "https://images.unsplash.com/photo-1627317949431-2e7f02ad0f44?auto=format&fit=crop&w=2000&q=80", meta: "Maps & Guides", tag: "Photo: Coastal Davao skyline", bookingMode: "none" },
    { section: "spotlight", sortOrder: 1, title: "72 Hours in Davao: City + Highlands + Island Day", text: "Balance heritage stops in Poblacion, cacao trails in Calinan and a Samal coastal finale in one easy-to-follow three-day itinerary.", meta: "Featured Planning Route", ctaLabel: "Learn more", ctaUrl: "guide-72-hours-davao.html", bookingMode: "none" },
    { section: "newsletter", sortOrder: 1, title: "Guide Drops", text: "Get practical route edits, festival movement tips and seasonal planning maps before your travel dates.", bookingMode: "none" },
    { section: "topics", sortOrder: 1, title: "First Timers", ctaUrl: "#first-timers", bookingMode: "none" },
    { section: "topics", sortOrder: 2, title: "Culture Routes", ctaUrl: "#culture", bookingMode: "none" },
    { section: "topics", sortOrder: 3, title: "Nature & Outdoors", ctaUrl: "#nature", bookingMode: "none" },
    { section: "topics", sortOrder: 4, title: "Family Friendly", ctaUrl: "#family", bookingMode: "none" },
    { section: "topics", sortOrder: 5, title: "Food Trails", ctaUrl: "#food", bookingMode: "none" },
    { section: "topics", sortOrder: 6, title: "Weekend Escapes", ctaUrl: "#weekend", bookingMode: "none" },
    { section: "cards", sortOrder: 1, title: "72 Hours in Davao", text: "A complete three-day framework covering markets, museums, mountain air and seaside dining without overplanning your day.", image: "https://images.unsplash.com/photo-1561484930-998b6a7b22e8?auto=format&fit=crop&w=1400&q=80", tag: "First Timers", meta: "first-timers", ctaLabel: "Learn more", ctaUrl: "guide-72-hours-davao.html", bookingMode: "info", bookingInfo: "booking.html#experiences", bookingType: "experiences" },
    { section: "cards", sortOrder: 2, title: "Kadayawan Culture Loop", text: "Follow a route through heritage spaces, weaving communities and local art stops shaped by Kadayawan stories and makers.", image: "https://images.unsplash.com/photo-1531501410720-c8d437636169?auto=format&fit=crop&w=1400&q=80", tag: "Culture Routes", meta: "culture", ctaLabel: "Learn more", ctaUrl: "guide-kadayawan-culture-loop.html", bookingMode: "info", bookingInfo: "booking.html#experiences", bookingType: "experiences" },
    { section: "cards", sortOrder: 3, title: "Highlands and Waterfalls Circuit", text: "A practical route for mountain viewpoints, ranger-led trails and cool-climate cafes in the uplands outside central Davao.", image: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?auto=format&fit=crop&w=1400&q=80", tag: "Nature & Outdoors", meta: "nature", ctaLabel: "Learn more", ctaUrl: "guide-highlands-waterfalls-circuit.html", bookingMode: "info", bookingInfo: "booking.html#experiences", bookingType: "experiences" },
    { section: "cards", sortOrder: 4, title: "Family Day Planner", text: "Kid-friendly museums, wildlife encounters and soft-adventure stops grouped into a smooth full-day family route.", image: "https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=1400&q=80", tag: "Family Friendly", meta: "family", ctaLabel: "Learn more", ctaUrl: "guide-family-day-planner.html", bookingMode: "info", bookingInfo: "booking.html#experiences", bookingType: "experiences" },
    { section: "cards", sortOrder: 5, title: "Davao Food Trail by District", text: "Track the city's best breakfast starts, durian market stops, seafood dinners and late-night dessert corners by district.", image: "https://images.unsplash.com/photo-1526318472351-c75fcf070305?auto=format&fit=crop&w=1400&q=80", tag: "Food Trails", meta: "food", ctaLabel: "Learn more", ctaUrl: "guide-davao-food-trail.html", bookingMode: "info", bookingInfo: "booking.html#experiences", bookingType: "experiences" },
    { section: "cards", sortOrder: 6, title: "Samal & Gulf Weekend Escape", text: "Use this two-day map for ferry timing, beach sequencing and sunset dining along the Davao Gulf and Samal coast.", image: "https://images.unsplash.com/photo-1473959383414-a1e0d001617f?auto=format&fit=crop&w=1400&q=80", tag: "Weekend Escapes", meta: "weekend", ctaLabel: "Learn more", ctaUrl: "guide-samal-gulf-weekend.html", bookingMode: "info", bookingInfo: "booking.html#hotels", bookingType: "hotels" }
  ],
  stay: [
    { section: "hero", sortOrder: 1, title: "Stay in Davao", text: "Choose your base in the city center, by the gulf, or steps from culture and nightlife. Find a stay that matches your pace and book it in minutes.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Davao_City_Samual_Island_view.jpg/1920px-Davao_City_Samual_Island_view.jpg", meta: "Dusit Thani Residence Davao. Photo: Patrickroque01 via Wikimedia", ctaLabel: "Explore Hotels", ctaUrl: "#stayHotelGrid", bookingMode: "info", bookingInfo: "Book Your Stay", bookingType: "hotels" },
    { section: "intro", sortOrder: 1, title: "Hotels and resorts for every kind of trip", text: "From business-ready towers in Lanang to island-style escapes with sunrise views, these curated stays help you plan with confidence.", meta: "Find Your Next Stay", bookingMode: "none" },
    { section: "zones", sortOrder: 1, title: "Bajada", ctaUrl: "#stayHotelGrid", bookingMode: "none" },
    { section: "zones", sortOrder: 2, title: "Lanang", ctaUrl: "#stayHotelGrid", bookingMode: "none" },
    { section: "zones", sortOrder: 3, title: "Poblacion", ctaUrl: "#stayHotelGrid", bookingMode: "none" },
    { section: "zones", sortOrder: 4, title: "Samal Island", ctaUrl: "#stayHotelGrid", bookingMode: "none" },
    { section: "curation", sortOrder: 1, title: "Curated for location, comfort, and planning speed", text: "Each featured stay is selected for reliable service, strong neighborhood access, and easy transfer routes to attractions, dining, and airport links.", meta: "Curation Notes", bookingMode: "none" },
    { section: "stats", sortOrder: 1, title: "Featured Hotels", text: "4", bookingMode: "none" },
    { section: "stats", sortOrder: 2, title: "Direct Booking Path", text: "1", bookingMode: "none" },
    { section: "stats", sortOrder: 3, title: "Concierge Chat Access", text: "24/7", bookingMode: "none" },
    { section: "cards", sortOrder: 1, title: "Seda Abreeza", text: "A polished city stay beside Abreeza Mall with quick access to business hubs, cafes, and evening dining spots.", image: "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=1400", meta: "Bajada District, Davao City", tags: ["Business-ready rooms", "Walkable shopping and dining", "Reliable airport transfers"], ctaLabel: "Learn More", ctaUrl: "hotel-seda-abreeza.html", bookingMode: "info", bookingInfo: "booking.html#hotels", bookingType: "hotels" },
    { section: "cards", sortOrder: 2, title: "Dusit Thani Residence Davao", text: "A premium address with spacious suites and elevated amenities, ideal for longer city stays and family trips.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Dusit_Thani_Residence_Davao.jpg/1280px-Dusit_Thani_Residence_Davao.jpg", meta: "Lanang, Davao City", tags: ["Suite-style accommodations", "Wellness and pool facilities", "Close to SM Lanang Premier"], ctaLabel: "Learn More", ctaUrl: "hotel-dusit-thani-residence.html", bookingMode: "info", bookingInfo: "booking.html#hotels", bookingType: "hotels" },
    { section: "cards", sortOrder: 3, title: "Apo View Hotel", text: "A heritage-favorite in the downtown core, perfect for travelers who want culture, markets, and local food nearby.", image: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1400", meta: "Poblacion District, Davao City", tags: ["Classic Davao hospitality", "Near museums and city landmarks", "Great base for walking tours"], ctaLabel: "Learn More", ctaUrl: "hotel-apo-view.html", bookingMode: "info", bookingInfo: "booking.html#hotels", bookingType: "hotels" },
    { section: "cards", sortOrder: 4, title: "Pearl Farm Beach Resort", text: "A celebrated island retreat with overwater-style villas, clear water views, and curated resort experiences.", image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1400", meta: "Samal Island, Davao Gulf", tags: ["Island-resort atmosphere", "Private beach settings", "Best for leisure escapes"], ctaLabel: "Learn More", ctaUrl: "hotel-pearl-farm.html", bookingMode: "info", bookingInfo: "booking.html#hotels", bookingType: "hotels" },
    { section: "planning", sortOrder: 1, title: "Choose By District", text: "Stay near Bajada and Lanang for city access, or move toward Samal routes for a more resort-forward escape.", meta: "Plan A Better Hotel Match", bookingMode: "none" },
    { section: "planning", sortOrder: 2, title: "Book Around Your Schedule", text: "For festival periods and long weekends, reserve early and compare room categories before final booking.", meta: "Plan A Better Hotel Match", bookingMode: "none" },
    { section: "planning", sortOrder: 3, title: "Bundle Your Trip", text: "After locking your hotel, continue to flights, experiences, and car rental inside the same booking flow.", meta: "Plan A Better Hotel Match", bookingMode: "none" }
  ]
};

function keyOf(item) {
  return `${item.page}::${item.section}::${item.title}`.toLowerCase();
}

async function upsertPage(page, items) {
  const existing = await listCmsItems({ city: CITY, page }, { includeDrafts: true });
  const byKey = new Map(existing.map((item) => [keyOf(item), item]));

  let created = 0;
  let updated = 0;

  for (const item of items) {
    const payload = { city: CITY, page, status: "published", ...item };
    const key = keyOf(payload);
    const match = byKey.get(key);
    if (match) {
      await updateCmsItem(match.id, { ...payload, id: match.id });
      updated += 1;
    } else {
      await createCmsItem(payload);
      created += 1;
    }
  }

  const after = await listCmsItems({ city: CITY, page }, { includeDrafts: true });
  return { created, updated, total: after.length };
}

async function main() {
  const summary = {};
  for (const [page, items] of Object.entries(seeds)) {
    summary[page] = await upsertPage(page, items);
  }
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error("seed-cms-inner-pages failed:", error.message || error);
  process.exit(1);
});

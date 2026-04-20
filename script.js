const CITY_DATA = {
  davao: {
    cityLabel: "Davao",
    shortCode: "DVO",
    locale: {
      en: {
        welcomeEyebrow: "Welcome to Davao City",
        welcomeTitle: "Refined travel, grounded in Mindanawon culture",
        welcomeText:
          "Davao brings together island leisure, elevated food culture, and heritage-rich communities in one seamless itinerary. Use this guide to curate mornings in the highlands, afternoons in cultural districts, and evenings in vibrant food corridors.",
        newsletterTitle: "Davao Insider Brief",
        newsletterText: "Receive curated city intelligence, premium offers, and event priorities each week.",
        eatTitle: "Savor Davao"
      },
      fil: {
        welcomeEyebrow: "Maligayang pagdating sa Davao City",
        welcomeTitle: "Ligtas, makulay, at pusong Mindanawon",
        welcomeText:
          "Sa Davao, puwedeng pagsamahin ang nature escapes, food culture, at local heritage sa isang biyahe. Gamitin ang gabay na ito para sa sariling ritmo mo mula umaga hanggang gabi.",
        newsletterTitle: "Pinakabagong Kwento sa Davao",
        newsletterText: "Tumanggap ng stories, events, at promos bawat linggo.",
        eatTitle: "Tikman ang Davao"
      }
    },
    palette: {
      bg: "#f6f2e9",
      surface: "#fffaf1",
      ink: "#1f1b16",
      muted: "#665e55",
      primary: "#0f6b57",
      secondary: "#e56e1f",
      accent: "#f3be37"
    },
    heroStories: [
      {
        title: "Built by Baybay, Mountain and Market",
        text: "Start your Davao journey where dawn hikes meet night markets, and every neighborhood tells a different story.",
        cta: "Explore Highlights",
        image: "https://upload.wikimedia.org/wikipedia/commons/4/4f/2022-10-07_Davao-Samal_Bridge_002.jpg",
        alt: "Davao skyline at dusk"
      },
      {
        title: "Fruit Capital Energy, All Year",
        text: "Taste durian, pomelo and cacao in local routes designed for food-first travelers and curious families.",
        cta: "See Food Routes",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Fruit_market_in_Magsaysay_Davao_City.jpg/1920px-Fruit_market_in_Magsaysay_Davao_City.jpg",
        alt: "Fresh produce and tropical fruits"
      },
      {
        title: "From Samal Shores to High Ridge Trails",
        text: "Pair beach mornings and mountain sunsets in one seamless long weekend.",
        cta: "Plan Weekend",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Roxas_Ave_Night_Market_001.jpg/1920px-Roxas_Ave_Night_Market_001.jpg",
        alt: "Tropical shoreline near Davao"
      }
    ],
    districts: [
      {
        title: "Poblacion Core",
        text: "Museums, heritage roads and cafe alleys in the city's cultural heartbeat.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Roxas_Ave_Night_Market_002.jpg/1920px-Roxas_Ave_Night_Market_002.jpg"
      },
      {
        title: "Buhangin North",
        text: "Local parks, urban food parks and easy jump-off points for family itineraries.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Kadayawan_Festival.jpg/1920px-Kadayawan_Festival.jpg"
      },
      {
        title: "Toril South",
        text: "Community markets and gateway roads connecting city life to countryside escapes.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Celebrating_Kadayawan_Festival.jpg/1920px-Celebrating_Kadayawan_Festival.jpg"
      },
      {
        title: "Calinan & Uplands",
        text: "Coffee farms, cool-air viewpoints and slow mornings above the city grid.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Mount_Apo_Banner.JPG/1920px-Mount_Apo_Banner.JPG"
      }
    ],
    chips: ["All", "Culture", "Family", "Nature", "Nightlife", "Arts"],
    things: [
      {
        title: "People's Park Night Walk",
        text: "Lantern-lit paths, local art corners and nearby food crawls.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Mount_Apo_Rainforest.jpg/1920px-Mount_Apo_Rainforest.jpg",
        tags: ["Nature", "Family"]
      },
      {
        title: "Mt. Apo Gateway Experience",
        text: "Curated trail previews and highland eco-education for non-climbers.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Lake_Venado.jpg/1920px-Lake_Venado.jpg",
        tags: ["Nature", "Culture"]
      },
      {
        title: "Davao Riverfront Cycle Route",
        text: "Sunset bike lanes with safe stopovers for photos and snacks.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Decorative_Gongs_at_the_Davao_City_Museum.jpg/1920px-Decorative_Gongs_at_the_Davao_City_Museum.jpg",
        tags: ["Family", "Nightlife"]
      },
      {
        title: "Museo Dabawenyo Circuit",
        text: "Community-curated exhibits and heritage rooms for first-time visitors.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Cacao_beans_for_Davao_chocolates_at_the_Davao_City_Museum.jpg/1920px-Cacao_beans_for_Davao_chocolates_at_the_Davao_City_Museum.jpg",
        tags: ["Culture", "Arts"]
      },
      {
        title: "Aldevinco Craft Trail",
        text: "Textiles, beadwork, and locally made pieces from Mindanao creatives.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Davao_durian.jpg/1920px-Davao_durian.jpg",
        tags: ["Arts", "Culture"]
      },
      {
        title: "Roxas Night Bazaar Crawl",
        text: "Street food lines, live buskers and low-cost shopping after dark.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Mangosteen_in_Davao_City.jpg/1920px-Mangosteen_in_Davao_City.jpg",
        tags: ["Nightlife", "Family"]
      }
    ],
    guides: [
      {
        title: "3-Day First Timer Itinerary",
        text: "A balanced plan for nature, city culture, shopping and evening food districts.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Davao_skyline_at_Jackridge_Resort_and_Restaurant.jpg/1920px-Davao_skyline_at_Jackridge_Resort_and_Restaurant.jpg"
      },
      {
        title: "Family-Ready Davao Map",
        text: "Kid-friendly attractions, transport hubs and low-stress route bundles.",
        image: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Davao_City%2C_Toril.jpg"
      }
    ],
    events: [
      {
        title: "Araw ng Dabaw Weekend",
        text: "Parades, cultural showcases and night stages across the city core.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/2025-07-19_Bucana_Bridge_007.jpg/1920px-2025-07-19_Bucana_Bridge_007.jpg",
        meta: "March | Citywide"
      },
      {
        title: "Kadayawan Creative Fair",
        text: "Floral displays, indigenous performances and artisan popups.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Davao_City_skyline_at_night_01.jpg/1920px-Davao_City_skyline_at_night_01.jpg",
        meta: "August | Downtown"
      },
      {
        title: "Davao Sunset Runs",
        text: "Community running series with food stalls and local music.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Davao_Agdao_skyline_%28Davao_City%3B_04-22-2024%29.jpg/1920px-Davao_Agdao_skyline_%28Davao_City%3B_04-22-2024%29.jpg",
        meta: "Monthly | Coastal Road"
      }
    ],
    deals: [
      {
        title: "City + Samal Combo Pass",
        text: "Bundle transfers and attraction access for weekend travelers.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Davao_City_Coastal_Road.jpg/1920px-Davao_City_Coastal_Road.jpg",
        tag: "Best Seller"
      },
      {
        title: "Food Street Discovery Card",
        text: "Discounts across selected night market and cafe partners.",
        image: "https://upload.wikimedia.org/wikipedia/commons/0/04/2022-10-07_Davao-Samal_Bridge_001.jpg",
        tag: "Limited Time"
      },
      {
        title: "Family Museum Bundle",
        text: "One-pass entry to educational and heritage attractions.",
        image: "https://upload.wikimedia.org/wikipedia/commons/4/4f/2022-10-07_Davao-Samal_Bridge_002.jpg",
        tag: "Family"
      }
    ],
    eat: [
      {
        title: "Durian + Cacao Trail",
        text: "The city's bold flavors through chef tables, street stalls and weekend markets.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Fruit_market_in_Magsaysay_Davao_City.jpg/1920px-Fruit_market_in_Magsaysay_Davao_City.jpg"
      },
      {
        title: "Seafood Along Roxas",
        text: "Fresh catches, grilled sets and family-style feasts at sunset.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Roxas_Ave_Night_Market_001.jpg/1920px-Roxas_Ave_Night_Market_001.jpg"
      },
      {
        title: "Coffee Roasters of Davao",
        text: "Single-origin spots and tasting flights from local beans.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Roxas_Ave_Night_Market_002.jpg/1920px-Roxas_Ave_Night_Market_002.jpg"
      }
    ],
    stay: [
      {
        title: "Waterfront Resorts",
        text: "Easy day trips with private transfer support and family amenities.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Kadayawan_Festival.jpg/1920px-Kadayawan_Festival.jpg"
      },
      {
        title: "Urban Boutique Hotels",
        text: "City-center stays close to nightlife, culture hubs and transport links.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Celebrating_Kadayawan_Festival.jpg/1920px-Celebrating_Kadayawan_Festival.jpg"
      },
      {
        title: "Hillview Retreats",
        text: "Quiet spaces with cool mornings and panoramic mountain views.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Mount_Apo_Banner.JPG/1920px-Mount_Apo_Banner.JPG"
      }
    ],
    itineraries: {
      nature: [
        "Sunrise park walk + local breakfast",
        "Half-day mountain view route",
        "Late afternoon coastal stop",
        "Night market dinner"
      ],
      food: [
        "Morning cafe and tablea tasting",
        "Lunch at seafood strip",
        "Fruit market crawl",
        "Evening street food circuit"
      ],
      culture: [
        "Museum + heritage district walk",
        "Craft market visit",
        "Local art studio stop",
        "Community performance at night"
      ]
    }
  },
  cebu: {
    cityLabel: "Cebu",
    shortCode: "CEB",
    locale: {
      en: {
        welcomeEyebrow: "Welcome to Cebu City",
        welcomeTitle: "Island gateway with heritage rhythm",
        welcomeText: "Cebu blends old churches, modern waterfront energy and island access in one urban base.",
        newsletterTitle: "What’s Good in Cebu",
        newsletterText: "Get weekly city picks, events and travel drops.",
        eatTitle: "Savor Cebu"
      },
      fil: {
        welcomeEyebrow: "Maligayang pagdating sa Cebu City",
        welcomeTitle: "Pintuan ng isla na may makasaysayang tibok",
        welcomeText: "Pinagsasama ng Cebu ang kasaysayan, modernong lungsod, at island adventures.",
        newsletterTitle: "Pinakabagong Kwento sa Cebu",
        newsletterText: "Tanggapin ang weekly city picks, events at promos.",
        eatTitle: "Tikman ang Cebu"
      }
    },
    palette: {
      bg: "#eef6f9",
      surface: "#fafdff",
      ink: "#11212a",
      muted: "#53666d",
      primary: "#00778d",
      secondary: "#d06a1b",
      accent: "#ffc857"
    }
  },
  iloilo: {
    cityLabel: "Iloilo",
    shortCode: "ILO",
    locale: {
      en: {
        welcomeEyebrow: "Welcome to Iloilo City",
        welcomeTitle: "Heritage lanes and riverside calm",
        welcomeText: "Iloilo offers elegant heritage, food heritage, and relaxed waterfront moments.",
        newsletterTitle: "What’s Good in Iloilo",
        newsletterText: "Get the latest local stories and event alerts.",
        eatTitle: "Savor Iloilo"
      },
      fil: {
        welcomeEyebrow: "Maligayang pagdating sa Iloilo City",
        welcomeTitle: "Pamana, lasa, at maaliwalas na tabing-ilog",
        welcomeText: "Ang Iloilo ay kilala sa heritage streets, masarap na pagkain, at kalmadong city escapes.",
        newsletterTitle: "Pinakabagong Kwento sa Iloilo",
        newsletterText: "Tumanggap ng updates sa stories at events.",
        eatTitle: "Tikman ang Iloilo"
      }
    },
    palette: {
      bg: "#f8f3ea",
      surface: "#fffdf8",
      ink: "#2a1f15",
      muted: "#6f604f",
      primary: "#8d2f1f",
      secondary: "#1b7263",
      accent: "#f6c667"
    }
  }
};

let activeCity = "davao";
let activeLang = "en";
let activeChip = "All";
let heroIndex = 0;

const brandCity = document.getElementById("brandCity");
const heroTitle = document.getElementById("heroTitle");
const heroText = document.getElementById("heroText");
const heroCta = document.getElementById("heroCta");
const heroImage = document.getElementById("heroImage");
const heroStamp = document.getElementById("heroStamp");
const districtGrid = document.getElementById("districtGrid");
const eventGrid = document.getElementById("eventGrid");
const dealGrid = document.getElementById("dealGrid");
const thingsGrid = document.getElementById("thingsGrid");
const guidesGrid = document.getElementById("guidesGrid");
const eatGrid = document.getElementById("eatGrid");
const stayGrid = document.getElementById("stayGrid");
const thingsChips = document.getElementById("thingsChips");
const carouselToggle = document.getElementById("carouselToggle");
const citySwitch = document.getElementById("citySwitch");
const newsletterForm = document.getElementById("newsletterForm");
const plannerForm = document.getElementById("plannerForm");
const itineraryOutput = document.getElementById("itineraryOutput");
const langToggles = [...document.querySelectorAll(".lang-toggle")];
const searchPanel = document.getElementById("searchPanel");
const openSearch = document.getElementById("openSearch");
const closeSearch = document.getElementById("closeSearch");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const detailModal = document.getElementById("detailModal");
const closeDetail = document.getElementById("closeDetail");
const detailImage = document.getElementById("detailImage");
const detailType = document.getElementById("detailType");
const detailTitle = document.getElementById("detailTitle");
const detailText = document.getElementById("detailText");
const welcomeEyebrow = document.getElementById("welcomeEyebrow");
const welcomeTitle = document.getElementById("welcomeTitle");
const welcomeText = document.getElementById("welcomeText");
const newsletterTitle = document.getElementById("newsletterTitle");
const newsletterText = document.getElementById("newsletterText");
const eatTitle = document.getElementById("eatTitle");
const districtTitle = document.getElementById("districtTitle");
const chatWidget = document.getElementById("chatWidget");
const brandConsoleBtn = document.getElementById("brandConsoleBtn");
const mapHeading = document.getElementById("mapHeading");
const mapPrev = document.getElementById("mapPrev");
const mapNext = document.getElementById("mapNext");
const mapZoneTitle = document.getElementById("mapZoneTitle");
const mapZoneText = document.getElementById("mapZoneText");
const mapZoneTip = document.getElementById("mapZoneTip");
const mapZoneLink = document.getElementById("mapZoneLink");
const mapRegions = [...document.querySelectorAll(".map-region")];
const mapLabels = {
  davao_city: document.getElementById("mapLabel-davao_city"),
  davao_del_norte: document.getElementById("mapLabel-davao_del_norte"),
  davao_de_oro: document.getElementById("mapLabel-davao_de_oro"),
  davao_oriental: document.getElementById("mapLabel-davao_oriental"),
  davao_del_sur: document.getElementById("mapLabel-davao_del_sur"),
  davao_occidental: document.getElementById("mapLabel-davao_occidental")
};
let activeMapRegion = "davao_city";

const CITY_MAP_DATA = {
  davao: {
    heading: "Davao Region",
    order: ["davao_city", "davao_del_norte", "davao_de_oro", "davao_oriental", "davao_del_sur", "davao_occidental"],
    regions: {
      davao_city: {
        label: "Davao City",
        title: "Davao City Metro Core",
        text: "Major parts: Poblacion District, Buhangin, Toril, Calinan, and Marilog uplands. This is the main urban gateway with ports, museums, food corridors, and city-to-island transfers.",
        tip: "Start here for mixed culture, food, and transport-connected itineraries.",
        href: "districts.html#davao-city"
      },
      davao_del_norte: {
        label: "Davao del Norte",
        title: "Davao del Norte",
        text: "Major parts: Tagum City, Panabo City, Samal Island (IGaCoS), and Carmen coastal corridor. Great for beach links, agri-tour routes, and city-side resorts.",
        tip: "Best for Samal beach days and Tagum-based overnights.",
        href: "districts.html#davao-del-norte"
      },
      davao_de_oro: {
        label: "Davao de Oro",
        title: "Davao de Oro",
        text: "Major parts: Nabunturan, Monkayo, Maragusan, and Pantukan mountain-to-coast stretch. Known for waterfalls, inland nature loops, and highland road adventures.",
        tip: "Best for upland nature drives and eco-focused day circuits.",
        href: "districts.html#davao-de-oro"
      },
      davao_oriental: {
        label: "Davao Oriental",
        title: "Davao Oriental",
        text: "Major parts: Mati City, Cateel, Baganga, and Governor Generoso Pacific coastlines. Signature destination for surf, hidden coves, and sunrise beach routes.",
        tip: "Best for coastal adventures and surf-forward itineraries.",
        href: "districts.html#davao-oriental"
      },
      davao_del_sur: {
        label: "Davao del Sur",
        title: "Davao del Sur",
        text: "Major parts: Digos City, Hagonoy, Bansalan, and Matanao. A practical base for Mt. Apo gateway journeys, farm tourism, and countryside food trails.",
        tip: "Best for Mt. Apo gateway prep and heritage-town routes.",
        href: "districts.html#davao-del-sur"
      },
      davao_occidental: {
        label: "Davao Occidental",
        title: "Davao Occidental",
        text: "Major parts: Malita, Santa Maria, Don Marcelino, and Sarangani Island gateway. The southernmost arc with quiet coasts, marine biodiversity, and slow-travel escapes.",
        tip: "Best for remote coastal stays and marine-focused exploration.",
        href: "districts.html#davao-occidental"
      }
    }
  },
  cebu: {
    heading: "Cebu Region View",
    order: ["davao_city", "davao_del_norte", "davao_de_oro", "davao_oriental", "davao_del_sur", "davao_occidental"],
    regions: {
      davao_city: {
        label: "Metro Cebu",
        title: "Central Business Core",
        text: "Commercial center with premium hotels, malls, and business travel convenience.",
        tip: "Best for corporate travel and short premium stays.",
        href: "districts.html"
      },
      davao_del_norte: {
        label: "North Corridor",
        title: "North Urban Corridor",
        text: "Mixed-use district with city growth zones and new dining clusters.",
        tip: "Best for modern city exploration.",
        href: "districts.html"
      },
      davao_de_oro: {
        label: "South Heritage",
        title: "South Heritage Belt",
        text: "Gateway to heritage stops and cultural landmarks.",
        tip: "Best for history and architecture routes.",
        href: "districts.html"
      },
      davao_oriental: {
        label: "Coastal Access",
        title: "Coastal Access Zone",
        text: "Convenient jump-off for shoreline and island-linked activities.",
        tip: "Best for coast-focused itineraries.",
        href: "districts.html"
      },
      davao_del_sur: {
        label: "Highland Loop",
        title: "Highland Loop",
        text: "Mountain and inland loop for cooler climate routes and countryside drives.",
        tip: "Best for scenic routes and upland stays.",
        href: "districts.html"
      },
      davao_occidental: {
        label: "Island Link",
        title: "Island Link Zone",
        text: "Airport and island-facing access point for beach stays and marine activities.",
        tip: "Best for transfer-efficient resort itineraries.",
        href: "districts.html"
      }
    }
  },
  iloilo: {
    heading: "Iloilo Region View",
    order: ["davao_city", "davao_del_norte", "davao_de_oro", "davao_oriental", "davao_del_sur", "davao_occidental"],
    regions: {
      davao_city: {
        label: "Heritage Core",
        title: "Heritage Core",
        text: "Historic district with signature architecture and key cultural assets.",
        tip: "Best for heritage storytelling routes.",
        href: "districts.html"
      },
      davao_del_norte: {
        label: "Commercial North",
        title: "Commercial North",
        text: "Business and lifestyle zone with broad dining options.",
        tip: "Best for city convenience and modern stays.",
        href: "districts.html"
      },
      davao_de_oro: {
        label: "South Community",
        title: "South Community Strip",
        text: "Balanced local district with market access and residential charm.",
        tip: "Best for neighborhood food exploration.",
        href: "districts.html"
      },
      davao_oriental: {
        label: "Riverfront Arc",
        title: "Riverfront Arc",
        text: "Scenic corridor for leisure walks and relaxed urban pacing.",
        tip: "Best for slow-travel evenings.",
        href: "districts.html"
      },
      davao_del_sur: {
        label: "Upland Arc",
        title: "Upland Arc",
        text: "Inland route with farm landscapes, river systems, and local town stops.",
        tip: "Best for day-drive explorers and nature-focused stays.",
        href: "districts.html"
      },
      davao_occidental: {
        label: "Port Gateway",
        title: "Port Gateway Zone",
        text: "Water-linked district that supports ferry transfers and coastal day plans.",
        tip: "Best for waterfront transitions and island side trips.",
        href: "districts.html"
      }
    }
  }
};

function renderCards(target, items, type) {
  target.innerHTML = items
    .map(
      (item) => `
      <article class="card js-open-detail" data-type="${type}" data-title="${item.title}" data-text="${item.text}" data-image="${item.image}">
        <img src="${item.image}" alt="${item.title}" />
        <div class="card-body">
          <h3>${item.title}</h3>
          <p>${item.text}</p>
        </div>
      </article>
    `
    )
    .join("");
}

function renderDistricts(items) {
  districtGrid.innerHTML = items
    .map(
      (item) => `
      <article class="district js-open-detail" data-type="District" data-title="${item.title}" data-text="${item.text}" data-image="${item.image}">
        <img src="${item.image}" alt="${item.title}" />
        <div class="district-body">
          <h3>${item.title}</h3>
          <p>${item.text}</p>
        </div>
      </article>
    `
    )
    .join("");
}

function renderEvents(items) {
  eventGrid.innerHTML = items
    .map(
      (item) => `
      <article class="event-card js-open-detail" data-type="Event" data-title="${item.title}" data-text="${item.text}" data-image="${item.image}">
        <img src="${item.image}" alt="${item.title}" />
        <div class="event-body">
          <h3>${item.title}</h3>
          <p>${item.text}</p>
          <span class="event-meta">${item.meta}</span>
        </div>
      </article>
    `
    )
    .join("");
}

function renderDeals(items) {
  dealGrid.innerHTML = items
    .map(
      (item) => `
      <article class="deal-card js-open-detail" data-type="Deal" data-title="${item.title}" data-text="${item.text}" data-image="${item.image}">
        <img src="${item.image}" alt="${item.title}" />
        <div class="deal-body">
          <h3>${item.title}</h3>
          <p>${item.text}</p>
          <span class="deal-tag">${item.tag}</span>
        </div>
      </article>
    `
    )
    .join("");
}

function applyPalette(palette) {
  const root = document.documentElement;
  Object.entries(palette).forEach(([token, value]) => {
    root.style.setProperty(`--${token}`, value);
  });
}

function updateHero(story) {
  heroTitle.textContent = story.title;
  heroText.textContent = story.text;
  heroCta.textContent = story.cta;
  heroImage.src = story.image;
  heroImage.alt = story.alt;
}

function buildFallbackCity(base) {
  return {
    ...base,
    heroStories: [
      {
        title: `${base.cityLabel} Theme Preview`,
        text: "This city is ready for launch by swapping content into the same MVP structure.",
        cta: "Prepare Launch",
        image: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=1600&q=80",
        alt: `${base.cityLabel} skyline preview`
      }
    ],
    districts: [
      { title: `${base.cityLabel} Downtown`, text: "Anchor your core attractions and city intro experiences here.", image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?auto=format&fit=crop&w=1200&q=80" },
      { title: `${base.cityLabel} Waterfront`, text: "Use this district for coast, river, or sunset hubs.", image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80" },
      { title: `${base.cityLabel} Heritage Zone`, text: "Show heritage structures, museums, and craft markets.", image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1200&q=80" },
      { title: `${base.cityLabel} Uplands`, text: "Map out nature loops and mountain day routes.", image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80" }
    ],
    chips: ["All", "Culture", "Family", "Nature"],
    things: [
      { title: `${base.cityLabel} Signature Highlights`, text: "Drop in your city's curated experiences while preserving this layout system.", image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80", tags: ["Culture", "Family"] },
      { title: `${base.cityLabel} Food Stories`, text: "Reuse the same sections and cards with local culinary voice and destinations.", image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80", tags: ["Culture", "Nature"] },
      { title: `${base.cityLabel} Outdoor Circuit`, text: "Keep the conversion-friendly format and replace listing categories by city.", image: "https://images.unsplash.com/photo-1501556424050-d4816356b73e?auto=format&fit=crop&w=1200&q=80", tags: ["Nature", "Family"] }
    ],
    guides: [
      { title: `${base.cityLabel} Starter Guide`, text: "The fastest path to a complete first-time trip.", image: "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?auto=format&fit=crop&w=1200&q=80" },
      { title: `${base.cityLabel} Family Map`, text: "A practical map with transport anchors and attraction clusters.", image: "https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?auto=format&fit=crop&w=1200&q=80" }
    ],
    events: [
      { title: `${base.cityLabel} City Week`, text: "A featured event format aligned with local schedules.", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80", meta: "Seasonal | Downtown" },
      { title: `${base.cityLabel} Cultural Night`, text: "A flexible event block for heritage and performance highlights.", image: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?auto=format&fit=crop&w=1200&q=80", meta: "Monthly | City Center" },
      { title: `${base.cityLabel} Weekend Market`, text: "A repeatable event template for food and maker stalls.", image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1200&q=80", meta: "Weekly | Market Zone" }
    ],
    deals: [
      { title: `${base.cityLabel} All Access Pass`, text: "Template offer for attractions and transport bundles.", image: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1200&q=80", tag: "Bundle" },
      { title: `${base.cityLabel} Food Card`, text: "Template offer for local dining partner discounts.", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80", tag: "Dining" },
      { title: `${base.cityLabel} Family Pass`, text: "Template offer for family-focused attractions.", image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1200&q=80", tag: "Family" }
    ],
    eat: [
      { title: `${base.cityLabel} Signature Flavors`, text: "Add the city's most iconic dishes and tasting routes.", image: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80" },
      { title: `${base.cityLabel} Street Food Trail`, text: "Map late-night eats and casual local favorites.", image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=1200&q=80" },
      { title: `${base.cityLabel} Coffee Guide`, text: "Place your strongest coffee and bakery stories here.", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80" }
    ],
    stay: [
      { title: `${base.cityLabel} Urban Hotels`, text: "Template for city-center accommodations.", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80" },
      { title: `${base.cityLabel} Resort Escapes`, text: "Template for coast or nature resort options.", image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80" },
      { title: `${base.cityLabel} Boutique Stays`, text: "Template for design-forward accommodations.", image: "https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=1200&q=80" }
    ],
    itineraries: {
      nature: ["Morning scenic route", "Lunch stop", "Afternoon walk", "Evening market"],
      food: ["Breakfast cafe", "Lunch local specialty", "Snack trail", "Dinner district"],
      culture: ["Heritage site", "Museum or gallery", "Craft stop", "Night show"]
    }
  };
}

function getCityData(cityKey) {
  const city = CITY_DATA[cityKey];
  if (city.heroStories) return city;
  return buildFallbackCity(city);
}

function applyLocale(city) {
  const copy = city.locale[activeLang] || city.locale.en;
  welcomeEyebrow.textContent = copy.welcomeEyebrow;
  welcomeTitle.textContent = copy.welcomeTitle;
  welcomeText.textContent = copy.welcomeText;
  newsletterTitle.textContent = copy.newsletterTitle;
  newsletterText.textContent = copy.newsletterText;
  eatTitle.textContent = copy.eatTitle;
  districtTitle.textContent = `Explore ${city.cityLabel} by Area`;
}

function renderThings(city) {
  const filtered = activeChip === "All" ? city.things : city.things.filter((item) => item.tags && item.tags.includes(activeChip));
  renderCards(thingsGrid, filtered, "Thing To Do");

  thingsChips.innerHTML = city.chips
    .map((chip) => `<button class="chip ${chip === activeChip ? "active" : ""}" data-chip="${chip}">${chip}</button>`)
    .join("");
}

function renderCity(cityKey) {
  activeCity = cityKey;
  const city = getCityData(cityKey);
  applyPalette(city.palette);
  brandCity.textContent = city.cityLabel;
  heroStamp.textContent = city.shortCode;
  applyLocale(city);

  renderDistricts(city.districts);
  renderEvents(city.events);
  renderDeals(city.deals);
  renderCards(guidesGrid, city.guides, "Guide");
  renderCards(eatGrid, city.eat, "Food");
  renderCards(stayGrid, city.stay, "Stay");

  activeChip = "All";
  renderThings(city);
  renderMap(cityKey);

  heroIndex = 0;
  updateHero(city.heroStories[heroIndex]);
}

function setActiveMapRegion(regionKey) {
  const mapConfig = CITY_MAP_DATA[activeCity] || CITY_MAP_DATA.davao;
  const fallback = mapConfig.order[0];
  const selectedKey = mapConfig.regions[regionKey] ? regionKey : fallback;
  const region = mapConfig.regions[selectedKey];
  if (!region) return;

  activeMapRegion = selectedKey;
  mapZoneTitle.textContent = region.title;
  mapZoneText.textContent = region.text;
  mapZoneTip.textContent = `Tip: ${region.tip}`;
  mapZoneLink.href = region.href || "districts.html";

  mapRegions.forEach((node) => {
    node.classList.toggle("active", node.dataset.region === selectedKey);
  });
}

function renderMap(cityKey, defaultRegion) {
  const mapConfig = CITY_MAP_DATA[cityKey] || CITY_MAP_DATA.davao;
  mapHeading.textContent = mapConfig.heading;

  Object.entries(mapLabels).forEach(([key, labelNode]) => {
    if (!labelNode) return;
    const region = mapConfig.regions[key];
    if (!region) return;
    labelNode.textContent = region.label;
  });

  setActiveMapRegion(defaultRegion || mapConfig.order[0]);
}

function openDetailFromElement(el) {
  detailType.textContent = el.dataset.type;
  detailTitle.textContent = el.dataset.title;
  detailText.textContent = el.dataset.text;
  detailImage.src = el.dataset.image;
  detailImage.alt = el.dataset.title;
  detailModal.classList.add("open");
  detailModal.setAttribute("aria-hidden", "false");
}

function closeDetailModal() {
  detailModal.classList.remove("open");
  detailModal.setAttribute("aria-hidden", "true");
}

function collectSearchItems(city) {
  const groups = [city.things, city.guides, city.eat, city.stay, city.events, city.deals, city.districts];
  return groups.flat().map((item) => ({ ...item }));
}

function runSearch(query) {
  const city = getCityData(activeCity);
  const items = collectSearchItems(city);

  if (!query) {
    searchResults.innerHTML = "<p>Type a keyword to find attractions, food, events, and stays.</p>";
    return;
  }

  const normalized = query.toLowerCase();
  const results = items.filter((item) => item.title.toLowerCase().includes(normalized) || item.text.toLowerCase().includes(normalized));

  if (!results.length) {
    searchResults.innerHTML = `<p>No matches for \"${query}\" in ${city.cityLabel} yet.</p>`;
    return;
  }

  searchResults.innerHTML = results
    .slice(0, 10)
    .map((item) => `<article class="search-result"><h4>${item.title}</h4><p>${item.text}</p></article>`)
    .join("");
}

function openSearchPanel() {
  searchPanel.classList.add("open");
  searchPanel.setAttribute("aria-hidden", "false");
  searchInput.value = "";
  runSearch("");
  searchInput.focus();
}

function closeSearchPanel() {
  searchPanel.classList.remove("open");
  searchPanel.setAttribute("aria-hidden", "true");
}

function buildItinerary(mood, length) {
  const city = getCityData(activeCity);
  const route = city.itineraries[mood] || [];
  const days = Number(length);

  const blocks = Array.from({ length: days }).map((_, idx) => {
    const dayLabel = `<strong>Day ${idx + 1}:</strong>`;
    const picks = route.slice(0, 3 + (idx % 2)).join(" | ");
    return `${dayLabel} ${picks}`;
  });

  itineraryOutput.innerHTML = `<p>${blocks.join("<br>")}</p>`;
}

carouselToggle.addEventListener("click", () => {
  const stories = getCityData(activeCity).heroStories;
  heroIndex = (heroIndex + 1) % stories.length;
  updateHero(stories[heroIndex]);
});

citySwitch.addEventListener("change", (event) => {
  renderCity(event.target.value);
});

newsletterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const button = event.currentTarget.querySelector("button");
  button.textContent = activeLang === "fil" ? "Salamat!" : "Thank You!";
  setTimeout(() => {
    button.textContent = "Sign Up";
    event.currentTarget.reset();
  }, 1600);
});

plannerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const mood = document.getElementById("tripMood").value;
  const length = document.getElementById("tripLength").value;
  buildItinerary(mood, length);
});

langToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    activeLang = toggle.dataset.lang;
    langToggles.forEach((item) => item.classList.toggle("is-active", item === toggle));
    renderCity(activeCity);
  });
});

thingsChips.addEventListener("click", (event) => {
  const btn = event.target.closest(".chip");
  if (!btn) return;
  activeChip = btn.dataset.chip;
  renderThings(getCityData(activeCity));
});

mapRegions.forEach((region) => {
  region.addEventListener("click", () => {
    setActiveMapRegion(region.dataset.region);
  });
});

mapPrev.addEventListener("click", () => {
  const mapConfig = CITY_MAP_DATA[activeCity] || CITY_MAP_DATA.davao;
  const order = mapConfig.order || [];
  if (!order.length) return;
  const currentIndex = Math.max(order.indexOf(activeMapRegion), 0);
  const prevIndex = (currentIndex - 1 + order.length) % order.length;
  setActiveMapRegion(order[prevIndex]);
});

mapNext.addEventListener("click", () => {
  const mapConfig = CITY_MAP_DATA[activeCity] || CITY_MAP_DATA.davao;
  const order = mapConfig.order || [];
  if (!order.length) return;
  const currentIndex = Math.max(order.indexOf(activeMapRegion), 0);
  const nextIndex = (currentIndex + 1) % order.length;
  setActiveMapRegion(order[nextIndex]);
});

document.body.addEventListener("click", (event) => {
  const detailTarget = event.target.closest(".js-open-detail");
  if (detailTarget) openDetailFromElement(detailTarget);
});

openSearch.addEventListener("click", openSearchPanel);
closeSearch.addEventListener("click", closeSearchPanel);
searchInput.addEventListener("input", (event) => runSearch(event.target.value));
closeDetail.addEventListener("click", closeDetailModal);

searchPanel.addEventListener("click", (event) => {
  if (event.target === searchPanel) closeSearchPanel();
});

detailModal.addEventListener("click", (event) => {
  if (event.target === detailModal) closeDetailModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeSearchPanel();
    closeDetailModal();
    if (chatWidget) chatWidget.classList.remove("open");
  }
});

if (window.BookingApi && typeof window.BookingApi.attachChatWidget === "function") {
  window.BookingApi.attachChatWidget({
    cityResolver: () => getCityData(activeCity).cityLabel,
    bookingPath: "booking.html"
  });
}

renderCity("davao");
itineraryOutput.innerHTML = "<p>Choose your mood and trip length, then click Build Itinerary.</p>";

if (window.BookingApi && typeof window.BookingApi.initWhiteLabelAdmin === "function") {
  window.BookingApi.initWhiteLabelAdmin({
    cityResolver: () => activeCity,
    onCityChange: (cityKey) => {
      if (CITY_DATA[cityKey]) {
        citySwitch.value = cityKey;
        renderCity(cityKey);
      }
    }
  });
}

if (brandConsoleBtn) {
  brandConsoleBtn.addEventListener("click", () => {
    const launcher = document.getElementById("wlAdminLaunch");
    if (launcher) launcher.click();
  });
}

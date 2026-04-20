const AFFILIATE = {
  bookingAid: "YOUR_BOOKING_AID",
  label: "imaginephilippines",
  endpoints: {
    flights: "https://flights.booking.com/",
    hotels: "https://www.booking.com/searchresults.html",
    experiences: "https://www.booking.com/attractions/",
    cars: "https://www.booking.com/cars/index.html"
  }
};

const CITY_BOOKING = {
  davao: {
    cityLabel: "Davao",
    airport: "DVO",
    destination: "Davao City",
    heroImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Mount_Apo_Rainforest.jpg/1920px-Mount_Apo_Rainforest.jpg",
    popular: [
      { title: "Samal Island", text: "Most-booked island escape for weekend travelers.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Lake_Venado.jpg/1920px-Lake_Venado.jpg" },
      { title: "People's Park", text: "Top city-center stop for first-time visitors.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Decorative_Gongs_at_the_Davao_City_Museum.jpg/1920px-Decorative_Gongs_at_the_Davao_City_Museum.jpg" },
      { title: "Mt. Apo Gateway", text: "Most requested highland day-route base.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Cacao_beans_for_Davao_chocolates_at_the_Davao_City_Museum.jpg/1920px-Cacao_beans_for_Davao_chocolates_at_the_Davao_City_Museum.jpg" }
    ],
    offers: [
      { title: "Flight + Hotel Bundle", text: "Best for quick 3-day city escapes.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Davao_durian.jpg/1920px-Davao_durian.jpg" },
      { title: "Family Activity Combo", text: "Popular mix of tours and local attractions.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Mangosteen_in_Davao_City.jpg/1920px-Mangosteen_in_Davao_City.jpg" },
      { title: "Car + Experience Saver", text: "Great for flexible self-paced itineraries.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Davao_skyline_at_Jackridge_Resort_and_Restaurant.jpg/1920px-Davao_skyline_at_Jackridge_Resort_and_Restaurant.jpg" }
    ],
    discountedHotels: [
      { title: "Downtown Business Hotels", text: "Close to food districts and transport hubs.", image: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Davao_City%2C_Toril.jpg" },
      { title: "Resort Properties", text: "Waterfront stays with family-focused amenities.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/2025-07-19_Bucana_Bridge_007.jpg/1920px-2025-07-19_Bucana_Bridge_007.jpg" },
      { title: "Hillview Retreats", text: "Cool-weather boutique options outside the center.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Davao_City_skyline_at_night_01.jpg/1920px-Davao_City_skyline_at_night_01.jpg" }
    ]
  },
  cebu: {
    cityLabel: "Cebu",
    airport: "CEB",
    destination: "Cebu City",
    heroImage: "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1600&q=80",
    popular: [
      { title: "Cebu IT Park", text: "Urban district with high booking demand.", image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?auto=format&fit=crop&w=1200&q=80" },
      { title: "Mactan Shores", text: "Most booked coast route for short breaks.", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80" },
      { title: "Historic Core", text: "Heritage cluster and city walking route.", image: "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=1200&q=80" }
    ],
    offers: [
      { title: "Weekend Cebu Bundle", text: "Quick-turn package for metro + coast.", image: "https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=1200&q=80" },
      { title: "Island Hopping Offers", text: "Experiences and boat routes in one pass.", image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80" },
      { title: "Car Rental Saver", text: "Self-drive deal for south and north routes.", image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&q=80" }
    ],
    discountedHotels: [
      { title: "City Center Hotels", text: "Most booked work-and-leisure stays.", image: "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=1200&q=80" },
      { title: "Mactan Resorts", text: "Top options for beach-first travel.", image: "https://images.unsplash.com/photo-1495365200479-c4ed1d35e1aa?auto=format&fit=crop&w=1200&q=80" },
      { title: "Boutique Stays", text: "Smaller design-forward stays.", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80" }
    ]
  },
  iloilo: {
    cityLabel: "Iloilo",
    airport: "ILO",
    destination: "Iloilo City",
    heroImage: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1600&q=80",
    popular: [
      { title: "Esplanade", text: "Most visited riverside leisure corridor.", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80" },
      { title: "Heritage Strip", text: "High-demand history and architecture route.", image: "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=1200&q=80" },
      { title: "Food Markets", text: "Most-booked local culinary experience areas.", image: "https://images.unsplash.com/photo-1452960962994-acf4fd70b632?auto=format&fit=crop&w=1200&q=80" }
    ],
    offers: [
      { title: "City Heritage Package", text: "Popular pair of hotels and culture stops.", image: "https://images.unsplash.com/photo-1467348733814-f93fc480bec6?auto=format&fit=crop&w=1200&q=80" },
      { title: "Food Crawl Bundle", text: "Great for first-time culinary visitors.", image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80" },
      { title: "Weekend Road Trip Offer", text: "Car-first option for nearby province loops.", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80" }
    ],
    discountedHotels: [
      { title: "Riverside Hotels", text: "Most searched stay category in the city.", image: "https://images.unsplash.com/photo-1535827841776-24afc1e255ac?auto=format&fit=crop&w=1200&q=80" },
      { title: "Business Hotels", text: "Best for central city access and meetings.", image: "https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=1200&q=80" },
      { title: "Boutique Heritage Stays", text: "High-conversion niche for cultural trips.", image: "https://images.unsplash.com/photo-1474690455603-a369ec1293f9?auto=format&fit=crop&w=1200&q=80" }
    ]
  }
};

let activeCity = "davao";
let activeResults = [];

const tabRow = document.getElementById("tabRow");
const bookingResult = document.getElementById("bookingResult");
const citySwitch = document.getElementById("citySwitch");
const brandCity = document.getElementById("brandCity");
const heroImage = document.getElementById("heroImage");
const flightDestination = document.getElementById("flightDestination");
const hotelDestination = document.getElementById("hotelDestination");
const experienceCity = document.getElementById("experienceCity");
const carCity = document.getElementById("carCity");
const destinationsGrid = document.getElementById("destinationsGrid");
const offersGrid = document.getElementById("offersGrid");
const hotelsGrid = document.getElementById("hotelsGrid");
const resultsGrid = document.getElementById("resultsGrid");
const resultsTitle = document.getElementById("resultsTitle");
const resultsSummary = document.getElementById("resultsSummary");
const demoModeToggle = document.getElementById("demoModeToggle");
const demoResultsBtn = document.getElementById("demoResultsBtn");
const demoModeStatus = document.getElementById("demoModeStatus");
const scenarioButtons = [...document.querySelectorAll(".scenario-btn")];

const DEMO_MODE_KEY = "imaginephilippines_demo_mode";
const DEMO_SCENARIOS = {
  "weekend-escape": { tab: "flights", flights: { origin: "MNL", adults: "2" }, hotels: { adults: "2", rooms: "1" }, experiences: { interest: "island hopping" } },
  "family-leisure": { tab: "hotels", flights: { origin: "CEB", adults: "4" }, hotels: { adults: "4", rooms: "2" }, experiences: { interest: "family attractions" } },
  "food-culture": { tab: "experiences", flights: { origin: "CRK", adults: "2" }, hotels: { adults: "2", rooms: "1" }, experiences: { interest: "food and heritage tours" } },
  "business-quick": { tab: "cars", flights: { origin: "MNL", adults: "1" }, hotels: { adults: "1", rooms: "1" }, experiences: { interest: "executive city highlights" } }
};

function addAffiliateParams(url) {
  const parsed = new URL(url);
  if (AFFILIATE.bookingAid && AFFILIATE.bookingAid !== "YOUR_BOOKING_AID") parsed.searchParams.set("aid", AFFILIATE.bookingAid);
  if (AFFILIATE.label) parsed.searchParams.set("label", AFFILIATE.label);
  return parsed.toString();
}

function renderCards(target, items, linkType) {
  target.innerHTML = items.map((item) => `
      <article class="card">
        <img src="${item.image}" alt="${item.title}" />
        <div class="card-body">
          <h4>${item.title}</h4>
          <p>${item.text}</p>
          <a href="#" data-quick-book="${linkType}" data-title="${item.title}">Quick Search</a>
        </div>
      </article>
    `).join("");
}

function renderCity(cityKey) {
  activeCity = cityKey;
  const city = CITY_BOOKING[cityKey];
  brandCity.textContent = city.cityLabel;
  heroImage.src = city.heroImage;
  heroImage.alt = `${city.cityLabel} booking`;
  flightDestination.value = city.airport;
  hotelDestination.value = city.destination;
  experienceCity.value = city.cityLabel;
  carCity.value = city.cityLabel;
  renderCards(destinationsGrid, city.popular, "hotels");
  renderCards(offersGrid, city.offers, "experiences");
  renderCards(hotelsGrid, city.discountedHotels, "hotels");
}

function switchTab(tabName) {
  document.querySelectorAll(".tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.tab === tabName));
  document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.toggle("active", panel.dataset.panel === tabName));
}

function switchTabFromHash() {
  const hash = window.location.hash.replace("#", "");
  if (["flights", "hotels", "experiences", "cars"].includes(hash)) switchTab(hash);
}

function switchCityFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const cityValue = (params.get("city") || "").toLowerCase().trim();
  if (!cityValue) return;
  const matched = Object.keys(CITY_BOOKING).find((key) => key === cityValue || CITY_BOOKING[key].cityLabel.toLowerCase() === cityValue);
  if (matched) {
    citySwitch.value = matched;
    renderCity(matched);
  }
}

function isoDateFromToday(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

function setDemoMode(enabled) {
  localStorage.setItem(DEMO_MODE_KEY, enabled ? "1" : "0");
  demoModeToggle.classList.toggle("is-active", enabled);
  demoModeToggle.textContent = enabled ? "Disable Demo Mode" : "Enable Demo Mode";
  demoModeStatus.textContent = enabled ? "Demo mode is active. Scenario buttons instantly prefill forms." : "Demo mode is currently off.";
}

function readDemoMode() {
  return localStorage.getItem(DEMO_MODE_KEY) === "1";
}

function applyScenario(scenarioKey) {
  const scenario = DEMO_SCENARIOS[scenarioKey];
  if (!scenario) return;

  const baseDepart = isoDateFromToday(10);
  const baseReturn = isoDateFromToday(13);
  const checkin = isoDateFromToday(10);
  const checkout = isoDateFromToday(13);
  const activityDate = isoDateFromToday(11);
  const carPickup = isoDateFromToday(10);
  const carDropoff = isoDateFromToday(13);

  flightForm.origin.value = scenario.flights.origin;
  flightForm.destination.value = CITY_BOOKING[activeCity].airport;
  flightForm.depart.value = baseDepart;
  flightForm.return.value = baseReturn;
  flightForm.adults.value = scenario.flights.adults;

  hotelForm.destination.value = CITY_BOOKING[activeCity].destination;
  hotelForm.checkin.value = checkin;
  hotelForm.checkout.value = checkout;
  hotelForm.adults.value = scenario.hotels.adults;
  hotelForm.rooms.value = scenario.hotels.rooms;

  experienceForm.city.value = CITY_BOOKING[activeCity].cityLabel;
  experienceForm.interest.value = scenario.experiences.interest;
  experienceForm.date.value = activityDate;

  carForm.pickupCity.value = CITY_BOOKING[activeCity].cityLabel;
  carForm.pickupDate.value = carPickup;
  carForm.dropoffDate.value = carDropoff;

  switchTab(scenario.tab);
  bookingResult.innerHTML = `<p><strong>Demo Scenario Loaded:</strong> ${scenarioKey.replace("-", " ").toUpperCase()} for ${CITY_BOOKING[activeCity].cityLabel}. Submit the active form to display in-page results.</p>`;
}

function writeResult(message) {
  bookingResult.innerHTML = `<p>${message}</p>`;
}

function formatCurrency(amount, currency = "PHP") {
  try {
    return new Intl.NumberFormat("en-PH", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}

function buildLocalDemoResults(category, city, payload = {}) {
  const cityLabel = city || CITY_BOOKING[activeCity].cityLabel;
  const cityData = CITY_BOOKING[activeCity];
  const imagePool = {
    flights: cityData.offers.map((x) => x.image),
    hotels: cityData.discountedHotels.map((x) => x.image),
    experiences: cityData.popular.map((x) => x.image),
    cars: cityData.offers.map((x) => x.image)
  };
  const images = imagePool[category] || imagePool.hotels;

  if (category === "flights") {
    const origin = payload.origin || "MNL";
    const destination = payload.destination || cityData.airport;
    return Array.from({ length: 4 }).map((_, idx) => ({
      id: `demo-flight-${idx + 1}`,
      title: `${origin} to ${destination} • Demo Fare ${idx + 1}`,
      description: "Presentation dataset for route and fare visualization.",
      rating: (4.2 + idx * 0.1).toFixed(1),
      location: `${origin} → ${destination}`,
      price: 2600 + idx * 900,
      currency: "PHP",
      priceUnit: "per passenger",
      image: images[idx % images.length]
    }));
  }

  if (category === "experiences") {
    const interest = payload.interest || "city highlights";
    return Array.from({ length: 4 }).map((_, idx) => ({
      id: `demo-exp-${idx + 1}`,
      title: `${cityLabel} ${interest} • Demo ${idx + 1}`,
      description: "Presentation dataset for tours and activity merchandising.",
      rating: (4.4 + idx * 0.1).toFixed(1),
      location: cityLabel,
      price: 1200 + idx * 350,
      currency: "PHP",
      priceUnit: "per guest",
      image: images[idx % images.length]
    }));
  }

  if (category === "cars") {
    return Array.from({ length: 4 }).map((_, idx) => ({
      id: `demo-car-${idx + 1}`,
      title: `${cityLabel} Vehicle Class ${idx + 1}`,
      description: "Presentation dataset for mobility and transfer inventory.",
      rating: (4.1 + idx * 0.1).toFixed(1),
      location: cityLabel,
      price: 1700 + idx * 540,
      currency: "PHP",
      priceUnit: "per day",
      image: images[idx % images.length]
    }));
  }

  const destination = payload.destination || cityData.destination;
  return Array.from({ length: 4 }).map((_, idx) => ({
    id: `demo-hotel-${idx + 1}`,
    title: `${destination} Suite Collection ${idx + 1}`,
    description: "Presentation dataset for in-page hotel result rendering.",
    rating: (4.3 + idx * 0.1).toFixed(1),
    location: destination,
    price: 3200 + idx * 980,
    currency: "PHP",
    priceUnit: "per night",
    image: images[idx % images.length]
  }));
}

function renderSearchResults(category, results, context = {}) {
  activeResults = results;
  const cityName = CITY_BOOKING[activeCity].cityLabel;
  resultsTitle.textContent = `${results.length} ${category[0].toUpperCase()}${category.slice(1)} Options in ${cityName}`;
  resultsSummary.textContent = `Displaying curated ${category} options for ${cityName}. Refine by adjusting your search and resubmitting.`;

  if (!results.length) {
    resultsGrid.innerHTML = "<article class='result-card'><div class='result-body'><h4>No Results</h4><p>Try changing travel dates or destination filters.</p></div></article>";
    return;
  }

  resultsGrid.innerHTML = results
    .map((item) => `
      <article class="result-card">
        <img src="${item.image}" alt="${item.title}" />
        <div class="result-body">
          <h4>${item.title}</h4>
          <p class="result-meta">${item.description}</p>
          <p class="result-meta">Rating: ${item.rating} / 5 • ${item.location}</p>
          <p class="result-price">${formatCurrency(item.price, item.currency)} ${item.priceUnit || ""}</p>
          <div class="result-actions">
            <button type="button" data-action="details" data-id="${item.id}">View Details</button>
            <button type="button" class="primary" data-action="select" data-id="${item.id}" data-category="${category}">Select Option</button>
          </div>
        </div>
      </article>
    `)
    .join("");

  writeResult(`Search completed for ${category} in ${cityName}. ${results.length} options displayed below.`);
  document.getElementById("resultsPanel").scrollIntoView({ behavior: "smooth", block: "start" });
}

async function searchInPage(category, payload) {
  writeResult(`Searching ${category} options...`);
  try {
    const response = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, city: CITY_BOOKING[activeCity].cityLabel, payload })
    });
    if (!response.ok) throw new Error("Search failed");

    const data = await response.json();
    renderSearchResults(category, data.results || [], payload);
  } catch {
    const localResults = buildLocalDemoResults(category, CITY_BOOKING[activeCity].cityLabel, payload);
    renderSearchResults(category, localResults, payload);
    writeResult(`Demo dataset loaded for ${category}.`);
    resultsSummary.textContent = `Displaying demo ${category} options for presentation mode.`;
  }
}

async function runInstantDemoResults() {
  if (!readDemoMode()) setDemoMode(true);
  const activeTab = document.querySelector(".tab.active")?.dataset.tab || "hotels";
  let payload = {};
  if (activeTab === "flights") payload = getFormData(flightForm);
  if (activeTab === "hotels") payload = getFormData(hotelForm);
  if (activeTab === "experiences") payload = getFormData(experienceForm);
  if (activeTab === "cars") payload = getFormData(carForm);

  const localResults = buildLocalDemoResults(activeTab, CITY_BOOKING[activeCity].cityLabel, payload);
  renderSearchResults(activeTab, localResults, payload);
  writeResult(`Instant demo results rendered for ${activeTab}.`);
}

async function trackSelection(item, category) {
  const sourceUrl = addAffiliateParams(AFFILIATE.endpoints[category] || AFFILIATE.endpoints.hotels);
  if (window.BookingApi && typeof window.BookingApi.postTrackedBooking === "function") {
    await window.BookingApi.postTrackedBooking({
      url: sourceUrl,
      category,
      city: CITY_BOOKING[activeCity].cityLabel,
      payload: { selectedId: item.id, selectedTitle: item.title, price: item.price },
      title: `${category} selection`
    });
  }
}

function getFormData(form) {
  return Object.fromEntries(new FormData(form).entries());
}

tabRow.addEventListener("click", (event) => {
  const button = event.target.closest(".tab");
  if (!button) return;
  switchTab(button.dataset.tab);
});

citySwitch.addEventListener("change", (event) => renderCity(event.target.value));

const flightForm = document.getElementById("flightForm");
const hotelForm = document.getElementById("hotelForm");
const experienceForm = document.getElementById("experienceForm");
const carForm = document.getElementById("carForm");

flightForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await searchInPage("flights", getFormData(flightForm));
});

hotelForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await searchInPage("hotels", getFormData(hotelForm));
});

experienceForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await searchInPage("experiences", getFormData(experienceForm));
});

carForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await searchInPage("cars", getFormData(carForm));
});

document.body.addEventListener("click", async (event) => {
  const quick = event.target.closest("[data-quick-book]");
  if (quick) {
    event.preventDefault();
    const type = quick.dataset.quickBook;
    if (type === "hotels") {
      switchTab("hotels");
      hotelForm.destination.value = CITY_BOOKING[activeCity].destination;
      hotelForm.checkin.value = isoDateFromToday(10);
      hotelForm.checkout.value = isoDateFromToday(13);
      await searchInPage("hotels", getFormData(hotelForm));
    }

    if (type === "experiences") {
      switchTab("experiences");
      experienceForm.city.value = CITY_BOOKING[activeCity].cityLabel;
      experienceForm.interest.value = quick.dataset.title || "city highlights";
      experienceForm.date.value = isoDateFromToday(11);
      await searchInPage("experiences", getFormData(experienceForm));
    }
    return;
  }

  const actionButton = event.target.closest("[data-action]");
  if (!actionButton) return;

  const item = activeResults.find((result) => result.id === actionButton.dataset.id);
  if (!item) return;

  if (actionButton.dataset.action === "details") {
    writeResult(`<strong>${item.title}</strong>: ${item.description} • ${formatCurrency(item.price, item.currency)} ${item.priceUnit || ""}`);
  }

  if (actionButton.dataset.action === "select") {
    const category = actionButton.dataset.category || "hotels";
    await trackSelection(item, category);
    writeResult(`Selected <strong>${item.title}</strong>. This preference has been saved for concierge follow-up and booking confirmation.`);
  }
});

demoModeToggle.addEventListener("click", () => {
  const next = !readDemoMode();
  setDemoMode(next);
  if (next) applyScenario("weekend-escape");
});

scenarioButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!readDemoMode()) setDemoMode(true);
    applyScenario(button.dataset.scenario);
  });
});

demoResultsBtn.addEventListener("click", runInstantDemoResults);

if (window.BookingApi && typeof window.BookingApi.attachChatWidget === "function") {
  window.BookingApi.attachChatWidget({
    cityResolver: () => CITY_BOOKING[activeCity].cityLabel,
    bookingPath: "booking.html"
  });
}

renderCity("davao");
switchCityFromQuery();
switchTabFromHash();
setDemoMode(readDemoMode());
if (readDemoMode()) applyScenario("weekend-escape");

if (window.BookingApi && typeof window.BookingApi.initWhiteLabelAdmin === "function") {
  window.BookingApi.initWhiteLabelAdmin({
    cityResolver: () => activeCity,
    onCityChange: (cityKey) => {
      if (CITY_BOOKING[cityKey]) {
        citySwitch.value = cityKey;
        renderCity(cityKey);
      }
    }
  });
}

window.addEventListener("hashchange", switchTabFromHash);

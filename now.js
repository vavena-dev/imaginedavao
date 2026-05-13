(function initNowPage() {
  const city = (new URLSearchParams(window.location.search).get("city") || "davao").toLowerCase();

  const heroKicker = document.getElementById("eventsHeroKicker");
  const heroTitle = document.getElementById("eventsHeroTitle");
  const heroText = document.getElementById("eventsHeroText");
  const heroImage = document.querySelector(".events-hero img");
  const heroPrimaryCta = document.getElementById("eventsHeroPrimaryCta");
  const heroSecondaryCta = document.getElementById("eventsHeroSecondaryCta");

  const curationKicker = document.getElementById("eventsCurationKicker");
  const curationTitle = document.getElementById("eventsCurationTitle");
  const curationText = document.getElementById("eventsCurationText");
  const statsGrid = document.getElementById("eventsStatsGrid");

  const featuredGrid = document.getElementById("eventsFeaturedGrid");
  const planningTitle = document.getElementById("eventsPlanningTitle");
  const planningGrid = document.getElementById("eventsPlanningGrid");

  const fallback = {
    hero: {
      meta: "City Calendar + Signature Festivals",
      title: "Experience Davao Through Its Events",
      text: "From major cultural festivals to curated weekend experiences, discover what is happening across the city and book your place in minutes.",
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1920&q=80",
      ctaLabel: "Explore Events",
      ctaUrl: "#eventsFeaturedGrid",
      bookingInfo: "Book Event Plans",
      bookingType: "experiences"
    },
    curation: {
      meta: "Curation Notes",
      title: "Built for travelers who want culture, rhythm, and easy planning.",
      text: "Each featured event includes atmosphere details, ideal timing, and direct booking access so you can plan with confidence around your Davao itinerary."
    },
    stats: [
      { title: "Featured Events", text: "5" },
      { title: "District Zones", text: "4" },
      { title: "Booking Path", text: "1" }
    ],
    events: [
      {
        tag: "Signature Festival",
        title: "Kadayawan Grand Parade",
        text: "The city's biggest cultural celebration with floral floats, street performances, and region-wide creative showcases.",
        meta: "Downtown Davao | August Program",
        image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1400&q=80",
        tags: ["Full-day parade route", "Traditional dance showcases", "Best for first-time visitors"],
        ctaLabel: "Learn more",
        ctaUrl: "event-kadayawan-grand-parade.html",
        bookingInfo: "booking.html#experiences"
      },
      {
        tag: "Night Culture",
        title: "Lanterns on the Gulf",
        text: "A waterfront evening event with live music, illuminated art installations, and curated local food stations.",
        meta: "Coastal Davao Gulf | Friday Evenings",
        image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1400&q=80",
        tags: ["Sunset-to-night schedule", "Family-friendly route", "Easy transfer options"],
        ctaLabel: "Learn more",
        ctaUrl: "event-lanterns-on-the-gulf.html",
        bookingInfo: "booking.html#experiences"
      },
      {
        tag: "Music + Food Weekend",
        title: "Mindanao Coffee & Music Social",
        text: "An open-air weekend social featuring regional coffee roasters, acoustic sets, and local artisan pop-up stalls.",
        meta: "Poblacion District | Weekend Mornings",
        image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1400&q=80",
        tags: ["Small-stage local artists", "Coffee tasting lanes", "Strong for groups and couples"],
        ctaLabel: "Learn more",
        ctaUrl: "event-mindanao-coffee-music-social.html",
        bookingInfo: "booking.html#experiences"
      },
      {
        tag: "Active City Series",
        title: "Davao River Night Run",
        text: "A guided evening run featuring lit route markers, hydration points, and post-run local snacks by the river.",
        meta: "Riverside Zone | Monthly Edition",
        image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1400&q=80",
        tags: ["Timed and non-timed tracks", "Community run format", "Beginner-friendly pacing"],
        ctaLabel: "Learn more",
        ctaUrl: "event-davao-river-night-run.html",
        bookingInfo: "booking.html#experiences"
      },
      {
        tag: "Neighborhood Culture",
        title: "Poblacion Food & Culture Walk",
        text: "A hosted evening trail through heritage lanes, tasting stops, and storytelling points led by local guides.",
        meta: "Poblacion Core | Tuesday and Saturday",
        image: "https://images.unsplash.com/photo-1523451190197-94e8f8ce2f76?auto=format&fit=crop&w=1400&q=80",
        tags: ["Guided bilingual hosts", "Local heritage narration", "Includes tasting credits"],
        ctaLabel: "Learn more",
        ctaUrl: "event-poblacion-food-culture-walk.html",
        bookingInfo: "booking.html#experiences"
      }
    ],
    planning: {
      title: "Plan A Stronger Events Weekend",
      items: [
        {
          title: "Mix Major + Local Picks",
          text: "Pair one large festival moment with one neighborhood-led event for a fuller view of Davao culture."
        },
        {
          title: "Book Before Peak Hours",
          text: "Popular evening slots and festival access windows fill quickly, especially during long weekends."
        },
        {
          title: "Bundle With Transport",
          text: "After selecting your events, secure transfer options in the same booking flow for smoother city movement."
        }
      ]
    }
  };

  function sortItems(items) {
    return items.slice().sort((a, b) => {
      const left = Number.isFinite(Number(a.sortOrder)) ? Number(a.sortOrder) : 0;
      const right = Number.isFinite(Number(b.sortOrder)) ? Number(b.sortOrder) : 0;
      return left - right;
    });
  }

  function normalizeItems(data) {
    const source = Array.isArray(data?.items) ? data.items : [];
    const sections = {
      hero: [],
      curation: [],
      stats: [],
      events: [],
      planning: []
    };
    source.forEach((item) => {
      const section = String(item.section || "").toLowerCase();
      if (section === "hero") sections.hero.push(item);
      if (section === "curation") sections.curation.push(item);
      if (section === "stats") sections.stats.push(item);
      if (section === "events") sections.events.push(item);
      if (section === "planning") sections.planning.push(item);
    });

    return {
      hero: sortItems(sections.hero),
      curation: sortItems(sections.curation),
      stats: sortItems(sections.stats),
      events: sortItems(sections.events),
      planning: sortItems(sections.planning)
    };
  }

  function renderHero(item) {
    const source = item || fallback.hero;
    heroKicker.textContent = source.meta || fallback.hero.meta;
    heroTitle.textContent = source.title || fallback.hero.title;
    heroText.textContent = source.text || fallback.hero.text;
    heroImage.src = source.image || fallback.hero.image;
    heroImage.alt = source.title || fallback.hero.title;

    heroPrimaryCta.textContent = source.ctaLabel || fallback.hero.ctaLabel;
    heroPrimaryCta.href = source.ctaUrl || fallback.hero.ctaUrl;

    const bookingType = String(source.bookingType || fallback.hero.bookingType || "experiences").toLowerCase();
    heroSecondaryCta.textContent = source.bookingInfo || fallback.hero.bookingInfo;
    heroSecondaryCta.href = `booking.html#${bookingType}`;
  }

  function renderCuration(item) {
    const source = item || fallback.curation;
    curationKicker.textContent = source.meta || fallback.curation.meta;
    curationTitle.textContent = source.title || fallback.curation.title;
    curationText.textContent = source.text || fallback.curation.text;
  }

  function renderStats(items) {
    const source = items.length ? items : fallback.stats;
    statsGrid.innerHTML = source
      .map((item) => {
        const label = item.title || "Metric";
        const value = item.text || "0";
        return `<div><dt>${value}</dt><dd>${label}</dd></div>`;
      })
      .join("");
  }

  function renderEvents(items) {
    const source = items.length ? items : fallback.events;
    featuredGrid.innerHTML = source
      .map((item) => {
        const highlights = Array.isArray(item.tags) ? item.tags : [];
        const learnLabel = item.ctaLabel || "Learn more";
        const learnUrl = item.ctaUrl || "#";
        const bookUrl = item.bookingInfo || "booking.html#experiences";
        return `
          <article class="events-card">
            <img
              class="events-card-image"
              src="${item.image || "assets/fallback-travel.svg"}"
              alt="${item.title || "Event"}"
              width="1400"
              height="933"
              loading="lazy"
              decoding="async"
            />
            <div class="events-card-body">
              <p class="events-card-type">${item.tag || "Featured Event"}</p>
              <h3 class="events-card-title">${item.title || "Untitled"}</h3>
              <p class="events-card-text">${item.text || ""}</p>
              <p class="events-card-meta">${item.meta || ""}</p>
              <ul class="events-card-highlights">
                ${highlights.map((highlight) => `<li>${highlight}</li>`).join("")}
              </ul>
              <div class="events-card-actions">
                <a class="events-btn" href="${learnUrl}" aria-label="${learnLabel} ${item.title || "event"}">${learnLabel}</a>
                <a class="events-btn book" href="${bookUrl}" aria-label="Book ${item.title || "event"}">Book</a>
              </div>
            </div>
          </article>
        `;
      })
      .join("");
  }

  function renderPlanning(items) {
    const useItems = items.length
      ? items
      : fallback.planning.items.map((item, index) => ({ ...item, sortOrder: index + 1 }));

    if (!items.length) {
      planningTitle.textContent = fallback.planning.title;
    }

    planningGrid.innerHTML = useItems
      .map((item) => `
        <article>
          <h3>${item.title || "Plan Better"}</h3>
          <p>${item.text || ""}</p>
        </article>
      `)
      .join("");
  }

  async function loadCms() {
    const response = await fetch(`/api/cms/content?city=${encodeURIComponent(city)}&page=now`);
    if (!response.ok) throw new Error("Failed to load now page content");
    return response.json();
  }

  async function init() {
    try {
      const data = await loadCms();
      const sections = normalizeItems(data);
      renderHero(sections.hero[0]);
      renderCuration(sections.curation[0]);
      renderStats(sections.stats);
      renderEvents(sections.events);
      renderPlanning(sections.planning);
    } catch {
      renderHero(null);
      renderCuration(null);
      renderStats([]);
      renderEvents([]);
      renderPlanning([]);
    }
  }

  init();
})();

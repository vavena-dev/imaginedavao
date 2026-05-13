(function initEatPage() {
  const city = (new URLSearchParams(window.location.search).get("city") || "davao").toLowerCase();

  const heroKicker = document.getElementById("eatHeroKicker");
  const heroTitle = document.getElementById("eatHeroTitle");
  const heroText = document.getElementById("eatHeroText");
  const heroImage = document.querySelector(".eat-hero img");
  const heroPrimaryCta = document.getElementById("eatHeroPrimaryCta");
  const heroSecondaryCta = document.getElementById("eatHeroSecondaryCta");

  const curationKicker = document.getElementById("eatCurationKicker");
  const curationTitle = document.getElementById("eatCurationTitle");
  const curationText = document.getElementById("eatCurationText");
  const statsGrid = document.getElementById("eatStatsGrid");

  const featuredGrid = document.getElementById("eatFeaturedGrid");
  const planningTitle = document.getElementById("eatPlanningTitle");
  const planningGrid = document.getElementById("eatPlanningGrid");

  const fallback = {
    hero: {
      meta: "Eat + Drink in Davao",
      title: "Explore Davao Through Its Tables, Markets, and Night Kitchens",
      text: "From heritage cooking houses to modern rooftop grills, this guide helps you map where to dine, what to order, and how to book your next meal-led city experience.",
      image: "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?auto=format&fit=crop&w=1980&q=80",
      ctaLabel: "Discover Places",
      ctaUrl: "#eatFeaturedGrid",
      bookingInfo: "Book Dining Experiences",
      bookingType: "experiences"
    }
  };

  function sortItems(items) {
    return items.slice().sort((a, b) => {
      const left = Number.isFinite(Number(a.sortOrder)) ? Number(a.sortOrder) : 0;
      const right = Number.isFinite(Number(b.sortOrder)) ? Number(b.sortOrder) : 0;
      return left - right;
    });
  }

  function group(items) {
    const grouped = { hero: [], curation: [], stats: [], cards: [], planning: [] };
    items.forEach((item) => {
      const section = String(item.section || "").toLowerCase();
      if (section === "events") grouped.cards.push(item);
      if (grouped[section]) grouped[section].push(item);
    });
    Object.keys(grouped).forEach((key) => {
      grouped[key] = sortItems(grouped[key]);
    });
    return grouped;
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
    if (!item) return;
    curationKicker.textContent = item.meta || curationKicker.textContent;
    curationTitle.textContent = item.title || curationTitle.textContent;
    curationText.textContent = item.text || curationText.textContent;
  }

  function renderStats(items) {
    const source = items.length ? items : [
      { title: "Featured Places", text: "6" },
      { title: "Dining Districts", text: "4" },
      { title: "Booking Hub", text: "1" }
    ];
    statsGrid.innerHTML = source.map((item) => `<div><dt>${item.text || "0"}</dt><dd>${item.title || "Metric"}</dd></div>`).join("");
  }

  function renderCards(items) {
    featuredGrid.innerHTML = items
      .map((item) => {
        const learnLabel = item.ctaLabel || "Learn more";
        const learnUrl = item.ctaUrl || "#";
        const bookUrl = item.bookingInfo || `booking.html#${item.bookingType || "experiences"}`;
        return `
          <article class="eat-card">
            <img src="${item.image || "assets/fallback-travel.svg"}" alt="${item.title || "Place"}" loading="lazy" decoding="async" />
            <div class="eat-card-body">
              <p class="eat-card-type">${item.tag || "Featured"}</p>
              <h3>${item.title || "Untitled"}</h3>
              <p>${item.text || ""}</p>
              <p class="eat-card-meta">${item.meta || ""}</p>
              <div class="eat-card-actions">
                <a class="eat-card-link" href="${learnUrl}">${learnLabel}</a>
                <a class="eat-card-link book" href="${bookUrl}">Book</a>
              </div>
            </div>
          </article>
        `;
      })
      .join("");
  }

  function renderPlanning(items) {
    if (!items.length) return;
    if (items[0].meta) planningTitle.textContent = items[0].meta;
    planningGrid.innerHTML = items
      .map((item) => `<article><h3>${item.title || "Plan Better"}</h3><p>${item.text || ""}</p></article>`)
      .join("");
  }

  async function loadCms() {
    const response = await fetch(`/api/cms/content?city=${encodeURIComponent(city)}&page=eat`);
    if (!response.ok) throw new Error("Failed to load eat content");
    const data = await response.json();
    return Array.isArray(data.items) ? data.items : [];
  }

  async function init() {
    try {
      const sections = group(await loadCms());
      renderHero(sections.hero[0]);
      renderCuration(sections.curation[0]);
      renderStats(sections.stats);
      renderCards(sections.cards);
      renderPlanning(sections.planning);
    } catch {
      renderHero(null);
      renderStats([]);
      renderCards([]);
      renderPlanning([]);
    }
  }

  init();
})();

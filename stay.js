(function initStayPage() {
  const city = (new URLSearchParams(window.location.search).get("city") || "davao").toLowerCase();

  const heroKicker = document.getElementById("stayHeroKicker");
  const heroTitle = document.getElementById("stayHeroTitle");
  const heroText = document.getElementById("stayHeroText");
  const heroImage = document.querySelector(".stay-hero img");
  const heroPrimaryCta = document.getElementById("stayHeroPrimaryCta");
  const heroSecondaryCta = document.getElementById("stayHeroSecondaryCta");

  const introKicker = document.getElementById("stayIntroKicker");
  const introTitle = document.getElementById("stayIntroTitle");
  const introText = document.getElementById("stayIntroText");
  const zoneChips = document.getElementById("stayZoneChips");

  const curationKicker = document.getElementById("stayCurationKicker");
  const curationTitle = document.getElementById("stayCurationTitle");
  const curationText = document.getElementById("stayCurationText");
  const statsGrid = document.getElementById("stayStatsGrid");

  const hotelGrid = document.getElementById("stayHotelGrid");
  const planningTitle = document.getElementById("stayPlanningTitle");
  const planningGrid = document.getElementById("stayPlanningGrid");

  function sortItems(items) {
    return items.slice().sort((a, b) => {
      const left = Number.isFinite(Number(a.sortOrder)) ? Number(a.sortOrder) : 0;
      const right = Number.isFinite(Number(b.sortOrder)) ? Number(b.sortOrder) : 0;
      return left - right;
    });
  }

  function group(items) {
    const grouped = {
      hero: [], intro: [], zones: [], curation: [], stats: [], cards: [], planning: []
    };
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
    if (!item) return;
    heroKicker.textContent = item.meta || heroKicker.textContent;
    heroTitle.textContent = item.title || heroTitle.textContent;
    heroText.textContent = item.text || heroText.textContent;
    heroImage.src = item.image || heroImage.src;
    heroImage.alt = item.title || heroImage.alt;
    heroPrimaryCta.textContent = item.ctaLabel || "Explore Hotels";
    heroPrimaryCta.href = item.ctaUrl || "#stayHotelGrid";
    const bookingType = String(item.bookingType || "hotels").toLowerCase();
    heroSecondaryCta.textContent = item.bookingInfo || "Book Your Stay";
    heroSecondaryCta.href = `booking#${bookingType}`;
  }

  function renderIntro(item) {
    if (!item) return;
    introKicker.textContent = item.meta || introKicker.textContent;
    introTitle.textContent = item.title || introTitle.textContent;
    introText.textContent = item.text || introText.textContent;
  }

  function renderZones(items) {
    zoneChips.innerHTML = items
      .map((item) => `<a href="${item.ctaUrl || "#stayHotelGrid"}">${item.title || "Zone"}</a>`)
      .join("");
  }

  function renderCuration(item) {
    if (!item) return;
    curationKicker.textContent = item.meta || curationKicker.textContent;
    curationTitle.textContent = item.title || curationTitle.textContent;
    curationText.textContent = item.text || curationText.textContent;
  }

  function renderStats(items) {
    statsGrid.innerHTML = items
      .map((item) => `<div><dt>${item.text || "0"}</dt><dd>${item.title || "Metric"}</dd></div>`)
      .join("");
  }

  function renderCards(items) {
    hotelGrid.innerHTML = items
      .map((hotel) => {
        const highlights = Array.isArray(hotel.tags) ? hotel.tags : [];
        const learnUrl = hotel.ctaUrl || "#";
        const bookUrl = hotel.bookingInfo || `booking#${hotel.bookingType || "hotels"}`;
        return `
          <article class="stay-card">
            <img class="stay-card-image" src="${hotel.image || "assets/fallback-davao.svg"}" alt="${hotel.title || "Stay"}" width="1400" height="933" loading="lazy" decoding="async" />
            <div class="stay-card-body">
              <p class="stay-card-location">${hotel.meta || "Davao"}</p>
              <h3 class="stay-card-title">${hotel.title || "Untitled"}</h3>
              <p class="stay-card-text">${hotel.text || ""}</p>
              <ul class="stay-card-highlights">
                ${highlights.map((highlight) => `<li>${highlight}</li>`).join("")}
              </ul>
              <div class="stay-card-actions">
                <a class="stay-btn" href="${learnUrl}">Learn More</a>
                <a class="stay-btn book" href="${bookUrl}">Book</a>
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
    const response = await fetch(`/api/cms/content?city=${encodeURIComponent(city)}&page=stay`);
    if (!response.ok) throw new Error("Failed to load stay content");
    const data = await response.json();
    return Array.isArray(data.items) ? data.items : [];
  }

  async function init() {
    try {
      const sections = group(await loadCms());
      renderHero(sections.hero[0]);
      renderIntro(sections.intro[0]);
      renderZones(sections.zones);
      renderCuration(sections.curation[0]);
      renderStats(sections.stats);
      renderCards(sections.cards);
      renderPlanning(sections.planning);
    } catch {
      hotelGrid.innerHTML = '<article class="stay-card-empty"><p>No featured stays are available right now. Please check back shortly.</p></article>';
    }
  }

  init();
})();

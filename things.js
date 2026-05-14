(function initThingsPage() {
  const city = (new URLSearchParams(window.location.search).get("city") || "davao").toLowerCase();

  const heroKicker = document.getElementById("thingsHeroKicker");
  const heroTitle = document.getElementById("thingsHeroTitle");
  const heroText = document.getElementById("thingsHeroText");
  const heroImage = document.querySelector(".things-hero img");
  const heroCredit = document.getElementById("thingsHeroCredit");

  const spotlightEyebrow = document.getElementById("thingsSpotlightEyebrow");
  const spotlightTitle = document.getElementById("spotlightTitle");
  const spotlightText = document.getElementById("thingsSpotlightText");
  const spotlightLink = document.getElementById("thingsSpotlightLink");

  const newsletterHeading = document.getElementById("newsletterHeading");
  const newsletterText = document.getElementById("thingsNewsletterText");

  const topicsNav = document.getElementById("thingsTopicsNav");
  const thingsGrid = document.getElementById("thingsGrid");

  const fallback = {
    hero: {
      meta: "Things to Do",
      title: "Discover the Best Things to Do in Davao",
      text: "From island escapes and mountain routes to chocolate farms and culture-rich neighborhoods, build a Davao itinerary that feels personal, local and unforgettable.",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Roxas_Ave_Night_Market_001.jpg/1920px-Roxas_Ave_Night_Market_001.jpg",
      tag: "Photo: Roxas Ave Night Market (Wikimedia Commons)"
    },
    spotlight: {
      meta: "Seasonal Highlight",
      title: "Kadayawan Cultural Week Routes",
      text: "Plan your week around floral floats, indigenous weaving showcases and curated food stops across downtown Davao.",
      ctaLabel: "Learn more",
      ctaUrl: "activity-kadayawan-culture-walk"
    },
    newsletter: {
      title: "Trip Updates",
      text: "Receive curated guides on festivals, outdoor activities and weekend-ready itineraries in Davao."
    }
  };

  function slug(input) {
    return String(input || "item")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "item";
  }

  function sortItems(items) {
    return items.slice().sort((a, b) => {
      const left = Number.isFinite(Number(a.sortOrder)) ? Number(a.sortOrder) : 0;
      const right = Number.isFinite(Number(b.sortOrder)) ? Number(b.sortOrder) : 0;
      return left - right;
    });
  }

  function group(items) {
    const grouped = { hero: [], spotlight: [], newsletter: [], topics: [], cards: [] };
    items.forEach((item) => {
      const section = String(item.section || "").toLowerCase();
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
    heroCredit.textContent = source.tag || fallback.hero.tag;
  }

  function renderSpotlight(item) {
    const source = item || fallback.spotlight;
    spotlightEyebrow.textContent = source.meta || fallback.spotlight.meta;
    spotlightTitle.textContent = source.title || fallback.spotlight.title;
    spotlightText.textContent = source.text || fallback.spotlight.text;
    spotlightLink.textContent = source.ctaLabel || fallback.spotlight.ctaLabel;
    spotlightLink.href = source.ctaUrl || fallback.spotlight.ctaUrl;
  }

  function renderNewsletter(item) {
    const source = item || fallback.newsletter;
    newsletterHeading.textContent = source.title || fallback.newsletter.title;
    newsletterText.textContent = source.text || fallback.newsletter.text;
  }

  function renderTopics(items, cards) {
    const topics = items.length
      ? items
      : cards.map((card) => ({ title: card.tag || card.title, ctaUrl: `#${slug(card.tag || card.title)}` }));

    topicsNav.innerHTML = topics
      .map((item) => `<a href="${item.ctaUrl || "#thingsGrid"}">${item.title || "Category"}</a>`)
      .join("");
  }

  function renderCards(items) {
    if (!items.length) {
      thingsGrid.innerHTML = '<article class="things-card"><div class="things-card-body"><h3>No activities configured yet.</h3><p>Add cards from Admin CMS.</p></div></article>';
      return;
    }

    thingsGrid.innerHTML = items
      .map((item) => {
        const anchorId = slug(item.meta || item.tag || item.title);
        const learnLabel = item.ctaLabel || "Learn more";
        const learnUrl = item.ctaUrl || "#";
        const bookUrl = item.bookingInfo || `booking#${item.bookingType || "experiences"}`;
        return `
          <article class="things-card" id="${anchorId}">
            <img src="${item.image || "assets/fallback-davao.svg"}" alt="${item.title || "Activity"}" width="1280" height="760" loading="lazy" decoding="async" />
            <div class="things-card-body">
              <p class="things-card-tag">${item.tag || "Featured"}</p>
              <h3>${item.title || "Untitled"}</h3>
              <p>${item.text || ""}</p>
              <div class="things-card-actions">
                <a href="${learnUrl}">${learnLabel}</a>
                <a class="book-link" href="${bookUrl}">Book</a>
              </div>
            </div>
          </article>
        `;
      })
      .join("");
  }

  async function loadCms() {
    const response = await fetch(`/api/cms/content?city=${encodeURIComponent(city)}&page=things`);
    if (!response.ok) throw new Error("Failed to load things content");
    const data = await response.json();
    return Array.isArray(data.items) ? data.items : [];
  }

  async function init() {
    try {
      const sections = group(await loadCms());
      renderHero(sections.hero[0]);
      renderSpotlight(sections.spotlight[0]);
      renderNewsletter(sections.newsletter[0]);
      renderTopics(sections.topics, sections.cards);
      renderCards(sections.cards);
    } catch {
      renderHero(null);
      renderSpotlight(null);
      renderNewsletter(null);
      renderTopics([], []);
      renderCards([]);
    }
  }

  init();
})();

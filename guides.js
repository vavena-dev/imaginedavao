(function initGuidesPage() {
  const city = (new URLSearchParams(window.location.search).get("city") || "davao").toLowerCase();

  const heroKicker = document.getElementById("guidesHeroKicker");
  const heroTitle = document.getElementById("guidesHeroTitle");
  const heroText = document.getElementById("guidesHeroText");
  const heroImage = document.querySelector(".guides-hero img");
  const heroCredit = document.getElementById("guidesHeroCredit");

  const spotlightEyebrow = document.getElementById("guidesSpotlightEyebrow");
  const spotlightTitle = document.getElementById("guideSpotlightTitle");
  const spotlightText = document.getElementById("guidesSpotlightText");
  const spotlightLink = document.getElementById("guidesSpotlightLink");

  const newsletterHeading = document.getElementById("guidesNewsletterHeading");
  const newsletterText = document.getElementById("guidesNewsletterText");

  const topicsNav = document.getElementById("guidesTopicsNav");
  const guidesGrid = document.getElementById("guidesGrid");

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
    if (!item) return;
    heroKicker.textContent = item.meta || heroKicker.textContent;
    heroTitle.textContent = item.title || heroTitle.textContent;
    heroText.textContent = item.text || heroText.textContent;
    heroImage.src = item.image || heroImage.src;
    heroImage.alt = item.title || heroImage.alt;
    heroCredit.textContent = item.tag || heroCredit.textContent;
  }

  function renderSpotlight(item) {
    if (!item) return;
    spotlightEyebrow.textContent = item.meta || spotlightEyebrow.textContent;
    spotlightTitle.textContent = item.title || spotlightTitle.textContent;
    spotlightText.textContent = item.text || spotlightText.textContent;
    spotlightLink.textContent = item.ctaLabel || "Learn more";
    spotlightLink.href = item.ctaUrl || spotlightLink.href;
  }

  function renderNewsletter(item) {
    if (!item) return;
    newsletterHeading.textContent = item.title || newsletterHeading.textContent;
    newsletterText.textContent = item.text || newsletterText.textContent;
  }

  function renderTopics(items, cards) {
    const source = items.length
      ? items
      : cards.map((item) => ({ title: item.tag || item.title, ctaUrl: `#${slug(item.tag || item.title)}` }));

    topicsNav.innerHTML = source
      .map((item) => `<a href="${item.ctaUrl || "#guidesGrid"}">${item.title || "Category"}</a>`)
      .join("");
  }

  function renderCards(items) {
    guidesGrid.innerHTML = items
      .map((item) => {
        const anchorId = slug(item.meta || item.tag || item.title);
        const learnLabel = item.ctaLabel || "Learn more";
        const learnUrl = item.ctaUrl || "#";
        const bookUrl = item.bookingInfo || `booking#${item.bookingType || "experiences"}`;
        return `
          <article class="guide-card" id="${anchorId}">
            <img src="${item.image || "assets/fallback-davao.svg"}" alt="${item.title || "Guide"}" width="1400" height="900" loading="lazy" decoding="async" />
            <div class="guide-card-body">
              <p class="guide-card-tag">${item.tag || "Guide"}</p>
              <h3>${item.title || "Untitled"}</h3>
              <p>${item.text || ""}</p>
              <div class="guide-card-actions">
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
    const response = await fetch(`/api/cms/content?city=${encodeURIComponent(city)}&page=guides`);
    if (!response.ok) throw new Error("Failed to load guides content");
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
      renderTopics([], []);
      renderCards([]);
    }
  }

  init();
})();

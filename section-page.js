(async function initSectionPage() {
  const root = document.body;
  const page = root.dataset.page || "things";
  const section = root.dataset.section || page;
  const city = (new URLSearchParams(window.location.search).get("city") || "davao").toLowerCase();

  const heroTitle = document.getElementById("heroTitle");
  const heroText = document.getElementById("heroText");
  const heroImage = document.getElementById("heroImage");
  const cardsGrid = document.getElementById("cardsGrid");

  const fallbacks = {
    things: {
      title: "Do More in Davao",
      text: "Nature loops, cultural spots, and night adventures.",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Lake_Venado.jpg/1920px-Lake_Venado.jpg"
    },
    events: {
      title: "Events in Davao",
      text: "Festival highlights, weekend calendars, and city happenings.",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Kadayawan_Festival.jpg/1920px-Kadayawan_Festival.jpg"
    },
    eat: {
      title: "Savor Davao",
      text: "Food routes, market picks, and dining experiences.",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Fruit_market_in_Magsaysay_Davao_City.jpg/1920px-Fruit_market_in_Magsaysay_Davao_City.jpg"
    },
    stay: {
      title: "Stay in Davao",
      text: "Hotels, resorts, and boutique accommodations.",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Davao_City_skyline_at_night_01.jpg/1920px-Davao_City_skyline_at_night_01.jpg"
    },
    guides: {
      title: "Maps & Guides",
      text: "Planning resources and practical route templates.",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Celebrating_Kadayawan_Festival.jpg/1920px-Celebrating_Kadayawan_Festival.jpg"
    }
  };

  function actionMarkup(item) {
    if (item.bookingMode === "book") {
      const tab = item.bookingType || (section === "stay" ? "hotels" : "experiences");
      return `<p><a class="card-link-btn" href="${item.ctaUrl || `booking#${tab}`}">${item.ctaLabel || "Open Booking"}</a></p>`;
    }
    if (item.bookingMode === "provider") {
      return `<p><a class="card-link-btn" href="${item.ctaUrl || "#"}" target="_blank" rel="noopener">${item.ctaLabel || "Open Booking"}</a></p>`;
    }
    if (item.bookingMode === "info" && item.bookingInfo) {
      return `<p class="book-info">${item.bookingInfo}</p>`;
    }
    return "";
  }

  async function fetchCms(targetPage) {
    const response = await fetch(`/api/cms/content?city=${encodeURIComponent(city)}&page=${encodeURIComponent(targetPage)}&section=${encodeURIComponent(section)}`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.items || [];
  }

  let items = [];
  try {
    items = await fetchCms(page);
    if (!items.length && page !== "index") {
      items = await fetchCms("index");
    }
  } catch {
    items = [];
  }

  const fallback = fallbacks[section] || fallbacks.things;
  const heroSource = items[0] || fallback;
  heroTitle.textContent = heroSource.title || fallback.title;
  heroText.textContent = heroSource.text || fallback.text;
  heroImage.src = heroSource.image || fallback.image;
  heroImage.alt = heroSource.title || fallback.title;

  if (!items.length) {
    cardsGrid.innerHTML = `<article class="card"><img src="${fallback.image}" alt="${fallback.title}" loading="lazy" decoding="async" /><div class="body"><h3>${fallback.title}</h3><p>${fallback.text}</p></div></article>`;
    return;
  }

  cardsGrid.innerHTML = items
    .map(
      (item) => `
      <article class="card">
        <img src="${item.image || "assets/fallback-davao.svg"}" alt="${item.title || "Item"}" loading="lazy" decoding="async" />
        <div class="body">
          <h3>${item.title || "Untitled"}</h3>
          <p>${item.text || ""}</p>
          ${item.meta ? `<p class="card-meta">${item.meta}</p>` : ""}
          ${actionMarkup(item)}
        </div>
      </article>
    `
    )
    .join("");
})();

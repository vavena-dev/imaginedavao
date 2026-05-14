(function () {
  const MAIN_FOOTER_PAGES = new Set([
    "/",
    "booking",
    "now",
    "things",
    "eat",
    "stay",
    "guides",
    "districts",
    "deals",
    "partner"
  ]);

  function currentPage() {
    const pathname = String(window.location.pathname || "").toLowerCase();
    const segments = pathname.split("/").filter(Boolean);
    return segments.length ? segments[segments.length - 1] : "/";
  }

  function buildFooterMarkup(isIndexPage) {
    const controlsMarkup = isIndexPage
      ? `
        <div class="imagine-main-footer__controls">
          <label for="citySwitch">City Theme</label>
          <div class="imagine-main-footer__controls-row">
            <select id="citySwitch" aria-label="City theme">
              <option value="davao" selected>Davao</option>
              <option value="cebu">Cebu</option>
              <option value="iloilo">Iloilo</option>
            </select>
            <button type="button" id="brandConsoleBtn">Brand Console</button>
          </div>
        </div>
      `
      : "";

    return `
      <section class="imagine-main-footer__newsletter" aria-labelledby="footerNewsletterTitle">
        <div>
          <h2 id="footerNewsletterTitle">Davao Insider Brief</h2>
          <p>Weekly city updates on festivals, food routes, stay offers, and smart itinerary tips across ImagineDavao.</p>
        </div>
        <form class="imagine-main-footer__form" id="mainFooterNewsletterForm" novalidate>
          <label for="mainFooterEmail">Email</label>
          <div class="imagine-main-footer__form-row">
            <input id="mainFooterEmail" name="email" type="email" autocomplete="email" placeholder="you@example.com" required />
            <button type="submit">Sign Up</button>
          </div>
          <p class="imagine-main-footer__status" id="mainFooterStatus" aria-live="polite"></p>
        </form>
      </section>
      <hr class="imagine-main-footer__divider" />
      <section class="imagine-main-footer__bottom" aria-label="Footer links and city resources">
        <div class="imagine-main-footer__brand">
          <p class="imagine-main-footer__parent">Imagine Davao Network</p>
          <p class="imagine-main-footer__city">ImagineDavao</p>
          <p class="imagine-main-footer__tagline">Client-ready city guide built for discovery, planning, and booking in one polished flow.</p>
          ${controlsMarkup}
        </div>
        <div class="imagine-main-footer__nav">
          <nav class="imagine-main-footer__col" aria-label="Explore Davao">
            <h3>Explore Davao</h3>
            <ul>
              <li><a href="things">Things To Do</a></li>
              <li><a href="eat">Eat & Drink</a></li>
              <li><a href="stay">Where to Stay</a></li>
              <li><a href="now">Now in City</a></li>
            </ul>
          </nav>
          <nav class="imagine-main-footer__col" aria-label="Plan Your Trip">
            <h3>Plan Your Trip</h3>
            <ul>
              <li><a href="booking">Book Flights & Hotels</a></li>
              <li><a href="guides">Maps & Guides</a></li>
              <li><a href="districts">Districts</a></li>
              <li><a href="deals">Deals & Passes</a></li>
            </ul>
          </nav>
          <nav class="imagine-main-footer__col" aria-label="About and Partnerships">
            <h3>About & Partners</h3>
            <ul>
              <li><a href="partner">Partner With Tourism</a></li>
              <li><a href="/#planner">Trip Planner</a></li>
              <li><a href="/#events">Event Calendar</a></li>
              <li><a href="/#map">Region Map</a></li>
            </ul>
          </nav>
        </div>
      </section>
      <section class="imagine-main-footer__legal" aria-label="Legal and social links">
        <p>© <span id="mainFooterYear"></span> ImagineDavao · Imagine Davao. All rights reserved.</p>
        <div class="imagine-main-footer__social">
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="ImagineDavao on Instagram">Instagram</a>
          <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="ImagineDavao on Facebook">Facebook</a>
          <a href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer" aria-label="ImagineDavao on TikTok">TikTok</a>
          <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="ImagineDavao on YouTube">YouTube</a>
        </div>
      </section>
    `;
  }

  function initFooterInteractions(footer) {
    const yearEl = footer.querySelector("#mainFooterYear");
    if (yearEl) {
      yearEl.textContent = String(new Date().getFullYear());
    }

    const form = footer.querySelector("#mainFooterNewsletterForm");
    const status = footer.querySelector("#mainFooterStatus");
    if (!form || !status) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const emailInput = footer.querySelector("#mainFooterEmail");
      if (!emailInput) return;

      if (!emailInput.value || !emailInput.checkValidity()) {
        status.textContent = "Please enter a valid email address.";
        return;
      }

      status.textContent = "Thanks. You are on the Davao Insider Brief list.";
      form.reset();
    });
  }

  function mountFooter() {
    const page = currentPage();
    if (!MAIN_FOOTER_PAGES.has(page)) return;
    if (document.querySelector("[data-imagine-footer='main']")) return;

    const footer = document.createElement("footer");
    footer.className = "imagine-main-footer";
    footer.setAttribute("data-imagine-footer", "main");
    footer.innerHTML = buildFooterMarkup(page === "/");

    const chatWidget = document.querySelector(".chat-widget");
    if (chatWidget && chatWidget.parentNode) {
      chatWidget.parentNode.insertBefore(footer, chatWidget);
    } else {
      document.body.appendChild(footer);
    }

    initFooterInteractions(footer);
  }

  mountFooter();
})();

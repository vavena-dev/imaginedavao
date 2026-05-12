const SHARED_NAV_LINKS = [
  { href: "now.html", label: "Now in City" },
  { href: "booking.html", label: "Book" },
  { href: "things.html", label: "Things To Do" },
  { href: "events.html", label: "Events" },
  { href: "eat.html", label: "Eat & Drink" },
  { href: "stay.html", label: "Where to Stay" },
  { href: "guides.html", label: "Maps & Guides" }
];

function currentPageName() {
  const pathname = String(window.location.pathname || "");
  const parts = pathname.split("/");
  return (parts[parts.length - 1] || "").toLowerCase();
}

function navListMarkup() {
  const current = currentPageName();
  return SHARED_NAV_LINKS.map((item) => {
    const isActive = current === item.href.toLowerCase();
    return `<li><a href="${item.href}" class="${isActive ? "is-active" : ""}"${isActive ? ' aria-current="page"' : ""}>${item.label}</a></li>`;
  }).join("");
}

function closeInnerNav(drawer, backdrop, trigger) {
  if (!drawer || !backdrop || !trigger) return;
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
  backdrop.hidden = true;
  trigger.setAttribute("aria-expanded", "false");
  document.body.classList.remove("inner-nav-open");
}

function openInnerNav(drawer, backdrop, trigger) {
  if (!drawer || !backdrop || !trigger) return;
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  backdrop.hidden = false;
  trigger.setAttribute("aria-expanded", "true");
  document.body.classList.add("inner-nav-open");
}

function initSharedInnerNav() {
  const topbar = document.querySelector(".topbar");
  if (!topbar || topbar.dataset.navReady === "true") return;
  topbar.dataset.navReady = "true";

  const backLink = topbar.querySelector(".back");
  if (backLink) backLink.remove();

  const nav = document.createElement("nav");
  nav.className = "inner-main-nav";
  nav.setAttribute("aria-label", "Main");
  nav.innerHTML = `<ul>${navListMarkup()}</ul>`;

  const topbarRight = document.createElement("div");
  topbarRight.className = "topbar-right";

  const utilityRow = document.createElement("div");
  utilityRow.className = "inner-utility";
  utilityRow.innerHTML = `
    <label class="inner-lang" for="innerLangSelect" aria-label="Language">
      <span class="inner-lang-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
          <circle cx="12" cy="12" r="9"></circle>
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"></path>
        </svg>
      </span>
      <select id="innerLangSelect">
        <option value="en">EN</option>
        <option value="fil">FIL</option>
      </select>
      <span class="inner-lang-caret" aria-hidden="true">▾</span>
    </label>
    <div class="utility-meta" id="innerUtilityMeta"></div>
  `;

  const menuBtn = document.createElement("button");
  menuBtn.type = "button";
  menuBtn.className = "inner-menu-btn";
  menuBtn.id = "innerMenuBtn";
  menuBtn.setAttribute("aria-controls", "innerNavDrawer");
  menuBtn.setAttribute("aria-expanded", "false");
  menuBtn.setAttribute("aria-label", "Open menu");
  menuBtn.innerHTML = '<span></span><span></span><span></span>';

  const backdrop = document.createElement("div");
  backdrop.className = "inner-nav-backdrop";
  backdrop.id = "innerNavBackdrop";
  backdrop.hidden = true;

  const drawer = document.createElement("aside");
  drawer.className = "inner-nav-drawer";
  drawer.id = "innerNavDrawer";
  drawer.setAttribute("aria-hidden", "true");
  drawer.innerHTML = `
    <div class="inner-nav-head">
      <button type="button" class="inner-nav-close" id="innerNavClose" aria-label="Close menu">×</button>
    </div>
    <nav class="inner-nav-list" aria-label="Mobile Main">
      ${SHARED_NAV_LINKS.map((item) => `<a href="${item.href}"><span>${item.label}</span><strong>›</strong></a>`).join("")}
    </nav>
  `;

  topbarRight.append(utilityRow, nav);
  topbar.append(topbarRight, menuBtn);
  document.body.append(backdrop, drawer);

  const closeBtn = drawer.querySelector("#innerNavClose");
  const langSelect = utilityRow.querySelector("#innerLangSelect");
  const storedLang = localStorage.getItem("imagineph_lang") || "en";
  langSelect.value = storedLang === "fil" ? "fil" : "en";
  document.documentElement.lang = langSelect.value === "fil" ? "fil" : "en";
  langSelect.addEventListener("change", () => {
    const next = langSelect.value === "fil" ? "fil" : "en";
    localStorage.setItem("imagineph_lang", next);
    document.documentElement.lang = next;
  });

  menuBtn.addEventListener("click", () => {
    const isOpen = drawer.classList.contains("open");
    if (isOpen) {
      closeInnerNav(drawer, backdrop, menuBtn);
    } else {
      openInnerNav(drawer, backdrop, menuBtn);
    }
  });

  closeBtn?.addEventListener("click", () => closeInnerNav(drawer, backdrop, menuBtn));
  backdrop.addEventListener("click", () => closeInnerNav(drawer, backdrop, menuBtn));
  drawer.addEventListener("click", (event) => {
    const anchor = event.target.closest("a");
    if (anchor) closeInnerNav(drawer, backdrop, menuBtn);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeInnerNav(drawer, backdrop, menuBtn);
  });
}

initSharedInnerNav();

if (window.BookingApi && typeof window.BookingApi.attachChatWidget === "function") {
  window.BookingApi.attachChatWidget({
    cityResolver: () => "Davao",
    bookingPath: "booking.html"
  });
}

if (window.BookingApi && typeof window.BookingApi.initWhiteLabelAdmin === "function") {
  window.BookingApi.initWhiteLabelAdmin();
}

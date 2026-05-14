const SHARED_NAV_LINKS = [
  { href: "now", label: "Now in City" },
  { href: "booking", label: "Book" },
  { href: "things", label: "Things To Do" },
  { href: "eat", label: "Eat & Drink" },
  { href: "stay", label: "Where to Stay" },
  { href: "guides", label: "Maps & Guides" }
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

  const navRow = document.createElement("div");
  navRow.className = "inner-nav-row";
  navRow.innerHTML = `
    <a class="inner-search-btn" href="/#search" aria-label="Search">
      <svg class="search-icon" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
        <circle cx="11" cy="11" r="7"></circle>
        <path d="M16.5 16.5L21 21"></path>
      </svg>
    </a>
  `;
  navRow.prepend(nav);

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

  topbarRight.append(utilityRow, navRow);
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
  makePickerFullyClickable(utilityRow.querySelector(".inner-lang"), langSelect);

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

function openSelectDropdown(selectEl) {
  if (!selectEl) return;
  if (typeof selectEl.showPicker === "function") {
    selectEl.showPicker();
    return;
  }
  selectEl.focus();
  selectEl.click();
  selectEl.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
}

function makePickerFullyClickable(wrapper, selectEl) {
  if (!wrapper || !selectEl) return;
  wrapper.addEventListener("click", (event) => {
    if (event.target === selectEl) return;
    event.preventDefault();
    openSelectDropdown(selectEl);
  });
  wrapper.addEventListener("keydown", (event) => {
    if (event.key === " " || event.key === "Enter" || event.key === "ArrowDown") {
      event.preventDefault();
      openSelectDropdown(selectEl);
    }
  });
}

function initSectionMobileMenu() {
  const siteHeader = document.querySelector(".site-header");
  const nav = siteHeader?.querySelector(".main-nav");
  const navList = nav?.querySelector("ul");
  if (!siteHeader || !nav || !navList || document.getElementById("sectionMenuBtn")) return;

  const links = [...navList.querySelectorAll("a")].map((anchor) => ({
    href: anchor.getAttribute("href") || "#",
    label: anchor.textContent ? anchor.textContent.trim() : ""
  }));
  const current = (window.location.pathname.split("/").pop() || "/").toLowerCase();

  const menuBtn = document.createElement("button");
  menuBtn.type = "button";
  menuBtn.className = "section-menu-btn";
  menuBtn.id = "sectionMenuBtn";
  menuBtn.setAttribute("aria-controls", "sectionNavDrawer");
  menuBtn.setAttribute("aria-expanded", "false");
  menuBtn.setAttribute("aria-label", "Open main menu");
  menuBtn.innerHTML = "<span></span><span></span><span></span>";
  nav.appendChild(menuBtn);

  const backdrop = document.createElement("div");
  backdrop.className = "section-nav-backdrop";
  backdrop.id = "sectionNavBackdrop";
  backdrop.hidden = true;

  const drawer = document.createElement("aside");
  drawer.className = "section-nav-drawer";
  drawer.id = "sectionNavDrawer";
  drawer.setAttribute("aria-hidden", "true");
  drawer.innerHTML = `
    <div class="section-nav-drawer-head">
      <button type="button" class="section-nav-close" id="sectionNavClose" aria-label="Close menu">×</button>
    </div>
    <nav class="section-nav-drawer-list" aria-label="Mobile Main">
      ${links
        .map((item) => {
          const isActive = current === item.href.toLowerCase();
          return `<a href="${item.href}" class="${isActive ? "is-active" : ""}"${isActive ? ' aria-current="page"' : ""}><span>${item.label}</span><strong>›</strong></a>`;
        })
        .join("")}
    </nav>
  `;

  document.body.append(backdrop, drawer);
  const closeBtn = drawer.querySelector("#sectionNavClose");

  const closeMenu = () => {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    backdrop.hidden = true;
    menuBtn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("section-nav-open");
  };

  const openMenu = () => {
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    backdrop.hidden = false;
    menuBtn.setAttribute("aria-expanded", "true");
    document.body.classList.add("section-nav-open");
  };

  menuBtn.addEventListener("click", () => {
    if (drawer.classList.contains("open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });
  closeBtn?.addEventListener("click", closeMenu);
  backdrop.addEventListener("click", closeMenu);
  drawer.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

function initSectionHeaderLanguage() {
  const selectEl = document.getElementById("sectionLangSelect");
  if (!selectEl) return;
  const stored = localStorage.getItem("imagineph_lang");
  const next = stored === "fil" ? "fil" : "en";
  selectEl.value = next;
  document.documentElement.lang = next;
  makePickerFullyClickable(document.querySelector(".site-header .lang-select"), selectEl);
  selectEl.addEventListener("change", () => {
    const selected = selectEl.value === "fil" ? "fil" : "en";
    localStorage.setItem("imagineph_lang", selected);
    document.documentElement.lang = selected;
  });
}

function normalizeBrandingText() {
  document.querySelectorAll(".brand-kicker").forEach((node) => {
    const text = String(node.textContent || "").trim();
    if (/imagine\s*philippines/i.test(text)) node.textContent = "Imagine";
  });

  document.querySelectorAll(".brand-city").forEach((node) => {
    const text = String(node.textContent || "").trim();
    if (!text || /philippines/i.test(text)) node.textContent = "Davao";
  });
}

normalizeBrandingText();
initSectionHeaderLanguage();
initSectionMobileMenu();
initSharedInnerNav();

if (window.BookingApi && typeof window.BookingApi.attachChatWidget === "function") {
  window.BookingApi.attachChatWidget({
    cityResolver: () => "Davao",
    bookingPath: "booking"
  });
}

if (window.BookingApi && typeof window.BookingApi.initWhiteLabelAdmin === "function") {
  window.BookingApi.initWhiteLabelAdmin();
}

const filterCity = document.getElementById("filterCity");
const filterPage = document.getElementById("filterPage");
const filterSection = document.getElementById("filterSection");
const reloadBtn = document.getElementById("reloadBtn");
const createItemBtn = document.getElementById("createItemBtn");
const itemEditorPanel = document.getElementById("itemEditorPanel");
const closeEditorBtn = document.getElementById("closeEditorBtn");
const itemsGrid = document.getElementById("itemsGrid");
const itemsCountEl = document.getElementById("itemsCount");
const statusEl = document.getElementById("status");
const itemForm = document.getElementById("itemForm");
const formTitle = document.getElementById("formTitle");
const formContextHint = document.getElementById("formContextHint");
const resetBtn = document.getElementById("resetBtn");

const bookingItemsGrid = document.getElementById("bookingItemsGrid");
const bookingStatusEl = document.getElementById("bookingStatusMsg");
const bookingForm = document.getElementById("bookingForm");
const bookingFormTitle = document.getElementById("bookingFormTitle");
const bookingResetBtn = document.getElementById("bookingResetBtn");

const fields = {
  id: document.getElementById("itemId"),
  title: document.getElementById("title"),
  image: document.getElementById("image"),
  text: document.getElementById("text"),
  meta: document.getElementById("meta"),
  tag: document.getElementById("tag"),
  tags: document.getElementById("tags"),
  sortOrder: document.getElementById("sortOrder"),
  sourceMode: document.getElementById("sourceMode"),
  sourcePage: document.getElementById("sourcePage"),
  sourceItemId: document.getElementById("sourceItemId"),
  bookingMode: document.getElementById("bookingMode"),
  bookingType: document.getElementById("bookingType"),
  ctaLabel: document.getElementById("ctaLabel"),
  ctaUrl: document.getElementById("ctaUrl"),
  bookingInfo: document.getElementById("bookingInfo")
};

const bookingFields = {
  id: document.getElementById("bookingItemId"),
  category: document.getElementById("bookingCategory"),
  providerName: document.getElementById("bookingProviderName"),
  title: document.getElementById("bookingTitle"),
  description: document.getElementById("bookingDescription"),
  locationLabel: document.getElementById("bookingLocationLabel"),
  priceAmount: document.getElementById("bookingPriceAmount"),
  priceCurrency: document.getElementById("bookingPriceCurrency"),
  priceUnit: document.getElementById("bookingPriceUnit"),
  rating: document.getElementById("bookingRating"),
  reviewCount: document.getElementById("bookingReviewCount"),
  thumbnailUrl: document.getElementById("bookingThumbnailUrl"),
  affiliateUrl: document.getElementById("bookingAffiliateUrl"),
  status: document.getElementById("bookingStatus"),
  sortOrder: document.getElementById("bookingSortOrder")
};

let currentItems = [];
let bookingItems = [];

const ADMIN_TOKEN_KEY = "imagineph_admin_token";
const ADMIN_REQUIRED_MESSAGE =
  "Admin access required. Sign in with an admin account in signin.html or set a valid ADMIN_TOKEN in this browser.";

const PAGE_SECTION_OPTIONS = {
  index: ["things", "events", "eat", "stay", "guides", "districts", "deals"],
  now: ["hero", "curation", "stats", "events", "planning"],
  things: ["hero", "spotlight", "newsletter", "topics", "cards"],
  eat: ["hero", "curation", "stats", "cards", "planning"],
  guides: ["hero", "spotlight", "newsletter", "topics", "cards"],
  stay: ["hero", "intro", "zones", "curation", "stats", "cards", "planning"],
  events: ["events"]
};

const SECTION_LABELS = {
  hero: "Hero",
  spotlight: "Spotlight",
  newsletter: "Newsletter",
  intro: "Intro",
  curation: "Curation",
  stats: "Stats",
  topics: "Topics",
  zones: "Zones",
  cards: "Cards",
  planning: "Planning",
  events: "Events",
  things: "Things To Do",
  eat: "Eat & Drink",
  stay: "Where to Stay",
  guides: "Maps & Guides",
  districts: "Districts",
  deals: "Deals"
};

const DEFAULT_FIELD_LABELS = {
  title: "Title",
  image: "Image URL",
  text: "Text",
  meta: "Meta",
  tag: "Tag",
  tags: "Tags (one per line or comma-separated)",
  sortOrder: "Sort Order",
  sourceMode: "Content Source",
  sourcePage: "Source Page",
  sourceItemId: "Linked Item",
  bookingMode: "Booking Mode",
  bookingType: "Booking Type",
  ctaLabel: "CTA Label",
  ctaUrl: "CTA URL",
  bookingInfo: "Booking Info"
};

const DEFAULT_FIELD_PROFILE = {
  visible: ["title", "image", "text", "meta", "tag", "tags", "sortOrder", "bookingMode", "bookingType", "ctaLabel", "ctaUrl", "bookingInfo"],
  required: ["title", "text"],
  labels: DEFAULT_FIELD_LABELS,
  hint: "Create and edit content for this section."
};

const FIELD_PROFILES = {
  "index:things": {
    visible: ["title", "image", "text", "meta", "tag", "tags", "sortOrder", "sourceMode", "sourcePage", "sourceItemId", "bookingMode", "bookingType", "ctaLabel", "ctaUrl", "bookingInfo"],
    required: [],
    labels: { ...DEFAULT_FIELD_LABELS, meta: "Anchor/Slug", tag: "Category", tags: "Badges (one per line)" },
    hint: "Homepage cards can be linked from Things page or customized."
  },
  "index:events": {
    visible: ["title", "image", "text", "meta", "tag", "tags", "sortOrder", "sourceMode", "sourcePage", "sourceItemId", "bookingMode", "bookingType", "ctaLabel", "ctaUrl", "bookingInfo"],
    required: [],
    labels: { ...DEFAULT_FIELD_LABELS, tag: "Event Type", meta: "Location / Program", tags: "Why Join (one point per line)", bookingInfo: "Best Timing (one point per line)", bookingType: "Suggested Pairing (Booking tab)", ctaLabel: "Primary Button Label", ctaUrl: "Detail Page URL" },
    hint: "Link from Now in City events and optionally override event details."
  },
  "index:eat": { ...DEFAULT_FIELD_PROFILE, visible: [...DEFAULT_FIELD_PROFILE.visible, "sourceMode", "sourcePage", "sourceItemId"], required: [], hint: "Link from Eat page cards or create custom homepage-only cards." },
  "index:stay": { ...DEFAULT_FIELD_PROFILE, visible: [...DEFAULT_FIELD_PROFILE.visible, "sourceMode", "sourcePage", "sourceItemId"], required: [], hint: "Link from Stay cards or keep custom homepage cards." },
  "index:guides": { ...DEFAULT_FIELD_PROFILE, visible: [...DEFAULT_FIELD_PROFILE.visible, "sourceMode", "sourcePage", "sourceItemId"], required: [], hint: "Link from Guides cards or keep custom homepage cards." },
  "index:districts": { ...DEFAULT_FIELD_PROFILE, hint: "Homepage district cards." },
  "index:deals": { ...DEFAULT_FIELD_PROFILE, hint: "Homepage promo/deals cards." },
  "now:hero": {
    visible: ["title", "image", "text", "meta", "tag", "sortOrder", "ctaLabel", "ctaUrl", "bookingInfo", "bookingType"],
    required: ["title", "text"],
    labels: { ...DEFAULT_FIELD_LABELS, meta: "Kicker", tag: "Credit", ctaLabel: "Primary CTA Label", ctaUrl: "Primary CTA URL", bookingInfo: "Secondary CTA Label", bookingType: "Secondary CTA Booking Tab" },
    hint: "Controls the now.html hero block."
  },
  "now:curation": { visible: ["title", "text", "meta", "sortOrder"], required: ["title", "text"], labels: { ...DEFAULT_FIELD_LABELS, meta: "Kicker" }, hint: "Controls curation title and paragraph." },
  "now:stats": { visible: ["title", "text", "sortOrder"], required: ["title", "text"], labels: { ...DEFAULT_FIELD_LABELS, title: "Stat Label", text: "Stat Value" }, hint: "One row per stat tile." },
  "now:events": {
    visible: ["title", "image", "text", "meta", "tag", "tags", "sortOrder", "ctaLabel", "ctaUrl", "bookingInfo", "bookingType"],
    required: ["title", "text"],
    labels: { ...DEFAULT_FIELD_LABELS, tag: "Event Type", meta: "Location / Program", tags: "Why Join (one point per line)", bookingInfo: "Best Timing (one point per line)", bookingType: "Suggested Pairing (Booking tab)", ctaLabel: "Primary Button Label", ctaUrl: "Detail Page URL" },
    hint: "Event cards support Why Join, Best Timing, and Suggested Pairing."
  },
  "now:planning": { visible: ["title", "text", "meta", "sortOrder"], required: ["title", "text"], labels: { ...DEFAULT_FIELD_LABELS, meta: "Section Title" }, hint: "One row per planning tip." },
  "things:hero": { visible: ["title", "image", "text", "meta", "tag", "sortOrder"], required: ["title", "text"], labels: { ...DEFAULT_FIELD_LABELS, meta: "Kicker", tag: "Photo Credit" }, hint: "Controls things page hero content." },
  "things:spotlight": { visible: ["title", "text", "meta", "ctaLabel", "ctaUrl", "sortOrder"], required: ["title", "text"], labels: { ...DEFAULT_FIELD_LABELS, meta: "Eyebrow" }, hint: "Seasonal spotlight card." },
  "things:newsletter": { visible: ["title", "text", "sortOrder"], required: ["title", "text"], labels: DEFAULT_FIELD_LABELS, hint: "Newsletter card content." },
  "things:topics": { visible: ["title", "ctaUrl", "sortOrder"], required: ["title"], labels: { ...DEFAULT_FIELD_LABELS, title: "Topic Label", ctaUrl: "Anchor URL (e.g. #adventure)" }, hint: "Navigation chips for activity categories." },
  "things:cards": { ...DEFAULT_FIELD_PROFILE, labels: { ...DEFAULT_FIELD_LABELS, tag: "Category", meta: "Anchor/Slug", tags: "Highlights (one per line)", ctaUrl: "Learn More URL", bookingInfo: "Book URL" }, hint: "Activity cards." },
  "eat:hero": { visible: ["title", "image", "text", "meta", "sortOrder", "ctaLabel", "ctaUrl", "bookingInfo", "bookingType"], required: ["title", "text"], labels: { ...DEFAULT_FIELD_LABELS, meta: "Kicker", bookingInfo: "Secondary CTA Label", bookingType: "Secondary CTA Booking Tab" }, hint: "Eat page hero section." },
  "eat:curation": { visible: ["title", "text", "meta", "sortOrder"], required: ["title", "text"], labels: { ...DEFAULT_FIELD_LABELS, meta: "Kicker" }, hint: "Curation content block." },
  "eat:stats": { visible: ["title", "text", "sortOrder"], required: ["title", "text"], labels: { ...DEFAULT_FIELD_LABELS, title: "Stat Label", text: "Stat Value" }, hint: "One row per stat tile." },
  "eat:cards": { ...DEFAULT_FIELD_PROFILE, labels: { ...DEFAULT_FIELD_LABELS, tag: "Place Type", meta: "District / Location", ctaUrl: "Learn More URL", bookingInfo: "Book URL" }, hint: "Featured places cards." },
  "eat:planning": { visible: ["title", "text", "meta", "sortOrder"], required: ["title", "text"], labels: { ...DEFAULT_FIELD_LABELS, meta: "Section Title" }, hint: "Planning tips rows." },
  "guides:hero": { visible: ["title", "image", "text", "meta", "tag", "sortOrder"], required: ["title", "text"], labels: { ...DEFAULT_FIELD_LABELS, meta: "Kicker", tag: "Photo Credit" }, hint: "Guides hero section." },
  "guides:spotlight": { visible: ["title", "text", "meta", "ctaLabel", "ctaUrl", "sortOrder"], required: ["title", "text"], labels: { ...DEFAULT_FIELD_LABELS, meta: "Eyebrow" }, hint: "Featured route card." },
  "guides:newsletter": { visible: ["title", "text", "sortOrder"], required: ["title", "text"], labels: DEFAULT_FIELD_LABELS, hint: "Newsletter card content." },
  "guides:topics": { visible: ["title", "ctaUrl", "sortOrder"], required: ["title"], labels: { ...DEFAULT_FIELD_LABELS, title: "Topic Label", ctaUrl: "Anchor URL (e.g. #weekend)" }, hint: "Topic chips across guides page." },
  "guides:cards": { ...DEFAULT_FIELD_PROFILE, labels: { ...DEFAULT_FIELD_LABELS, tag: "Guide Type", meta: "Anchor/Slug", ctaUrl: "Learn More URL", bookingInfo: "Book URL" }, hint: "Guide cards." },
  "stay:hero": { visible: ["title", "image", "text", "meta", "sortOrder", "ctaLabel", "ctaUrl", "bookingInfo", "bookingType"], required: ["title", "text"], labels: { ...DEFAULT_FIELD_LABELS, meta: "Kicker / Credit", bookingInfo: "Secondary CTA Label", bookingType: "Secondary CTA Booking Tab" }, hint: "Stay page hero section." },
  "stay:intro": { visible: ["title", "text", "meta", "sortOrder"], required: ["title", "text"], labels: { ...DEFAULT_FIELD_LABELS, meta: "Kicker" }, hint: "Intro heading and paragraph." },
  "stay:zones": { visible: ["title", "ctaUrl", "sortOrder"], required: ["title"], labels: { ...DEFAULT_FIELD_LABELS, title: "Zone Label", ctaUrl: "Anchor URL" }, hint: "Zone chips under intro." },
  "stay:curation": { visible: ["title", "text", "meta", "sortOrder"], required: ["title", "text"], labels: { ...DEFAULT_FIELD_LABELS, meta: "Kicker" }, hint: "Curation block." },
  "stay:stats": { visible: ["title", "text", "sortOrder"], required: ["title", "text"], labels: { ...DEFAULT_FIELD_LABELS, title: "Stat Label", text: "Stat Value" }, hint: "One row per stat tile." },
  "stay:cards": { ...DEFAULT_FIELD_PROFILE, labels: { ...DEFAULT_FIELD_LABELS, meta: "Location", tags: "Highlights (one per line)", ctaUrl: "Learn More URL", bookingInfo: "Book URL", bookingType: "Booking Tab" }, hint: "Hotel cards." },
  "stay:planning": { visible: ["title", "text", "meta", "sortOrder"], required: ["title", "text"], labels: { ...DEFAULT_FIELD_LABELS, meta: "Section Title" }, hint: "Planning tips rows." },
  "events:events": {
    visible: ["title", "image", "text", "meta", "tag", "tags", "sortOrder", "ctaLabel", "ctaUrl", "bookingInfo", "bookingType"],
    required: ["title", "text"],
    labels: { ...DEFAULT_FIELD_LABELS, tag: "Event Type", meta: "Location / Program", tags: "Why Join (one point per line)", bookingInfo: "Best Timing (one point per line)", bookingType: "Suggested Pairing (Booking tab)", ctaLabel: "Primary Button Label", ctaUrl: "Detail Page URL" },
    hint: "Standalone events page cards."
  }
};

let editorOpen = false;
const sourceOptionsCache = new Map();

const LINKABLE_INDEX_SOURCE_PAGE_BY_SECTION = {
  things: "things",
  events: "now",
  eat: "eat",
  stay: "stay",
  guides: "guides"
};

const SOURCE_ITEM_SECTIONS_BY_PAGE = {
  things: ["cards"],
  now: ["events"],
  eat: ["cards"],
  stay: ["cards"],
  guides: ["cards"],
  events: ["events"]
};

const SYSTEM_TAG_PREFIX = "@sys.";

function defaultSourcePageForSection(section) {
  return LINKABLE_INDEX_SOURCE_PAGE_BY_SECTION[String(section || "").toLowerCase()] || "things";
}

function isLinkableIndexSection(page, section) {
  return String(page || "").toLowerCase() === "index" &&
    Boolean(LINKABLE_INDEX_SOURCE_PAGE_BY_SECTION[String(section || "").toLowerCase()]);
}

function parseCmsTags(tags = []) {
  const userTags = [];
  const system = {};
  (Array.isArray(tags) ? tags : []).forEach((entry) => {
    const token = String(entry || "").trim();
    if (!token.startsWith(SYSTEM_TAG_PREFIX)) {
      if (token) userTags.push(token);
      return;
    }
    const body = token.slice(SYSTEM_TAG_PREFIX.length);
    const [key, ...rest] = body.split("=");
    const value = rest.join("=").trim();
    if (!key || !value) return;
    system[key.trim()] = value;
  });
  return { userTags, system };
}

function buildCmsTags(userTags = [], system = {}) {
  const out = (Array.isArray(userTags) ? userTags : []).filter(Boolean);
  Object.entries(system).forEach(([key, value]) => {
    if (!value) return;
    out.push(`${SYSTEM_TAG_PREFIX}${key}=${String(value).trim()}`);
  });
  return out;
}

function allowedSectionsForPage(page) {
  const key = String(page || "").toLowerCase();
  if (Array.isArray(PAGE_SECTION_OPTIONS[key]) && PAGE_SECTION_OPTIONS[key].length) {
    return PAGE_SECTION_OPTIONS[key];
  }
  return PAGE_SECTION_OPTIONS.index.slice();
}

function syncSectionOptions(preferredSection = "") {
  const allowed = allowedSectionsForPage(filterPage.value);
  const current = String(preferredSection || filterSection.value || "").toLowerCase();
  const nextValue = allowed.includes(current) ? current : allowed[0];

  filterSection.innerHTML = allowed
    .map((section) => `<option value="${section}">${SECTION_LABELS[section] || section}</option>`)
    .join("");
  filterSection.value = nextValue;
}

function profileKey(page, section) {
  return `${String(page || "").toLowerCase()}:${String(section || "").toLowerCase()}`;
}

function resolveFieldProfile() {
  const key = profileKey(filterPage.value, filterSection.value);
  return FIELD_PROFILES[key] || DEFAULT_FIELD_PROFILE;
}

function applyFieldProfile() {
  const profile = resolveFieldProfile();
  const visible = new Set(profile.visible || []);
  const required = new Set(profile.required || []);
  const labels = profile.labels || DEFAULT_FIELD_LABELS;

  Object.entries(fields).forEach(([key, input]) => {
    const labelNode = input.closest("label");
    if (!labelNode) return;
    const textNode = labelNode.querySelector(".field-label");
    const isVisible = visible.has(key);
    labelNode.classList.toggle("field-hidden", !isVisible);
    if (textNode) textNode.textContent = labels[key] || DEFAULT_FIELD_LABELS[key] || key;

    const mustRequire = isVisible && required.has(key);
    if ("required" in input) input.required = mustRequire;
  });

  formContextHint.textContent = profile.hint || DEFAULT_FIELD_PROFILE.hint;
  updateSourceFieldState();
}

function setFieldHidden(fieldKey, hidden) {
  const input = fields[fieldKey];
  if (!input) return;
  const labelNode = input.closest("label");
  if (!labelNode) return;
  labelNode.classList.toggle("field-hidden", hidden);
}

function allowedSourcePageOptions() {
  const section = String(filterSection.value || "").toLowerCase();
  const defaultPage = defaultSourcePageForSection(section);
  if (!isLinkableIndexSection(filterPage.value, section)) return [];
  const preferred = [defaultPage];
  const extras = ["things", "now", "eat", "stay", "guides"];
  return [...new Set([...preferred, ...extras])];
}

function syncSourcePageOptions() {
  const allowed = allowedSourcePageOptions();
  if (!allowed.length) return;
  const current = fields.sourcePage.value;
  const next = allowed.includes(current) ? current : allowed[0];
  fields.sourcePage.innerHTML = allowed
    .map((page) => `<option value="${page}">${SECTION_LABELS[page] || page}</option>`)
    .join("");
  fields.sourcePage.value = next;
}

async function loadSourceItemsForPage(page) {
  const city = filterCity.value;
  const key = `${city}:${page}`;
  if (sourceOptionsCache.has(key)) return sourceOptionsCache.get(key);

  const response = await fetch(`/api/cms/content?city=${encodeURIComponent(city)}&page=${encodeURIComponent(page)}`, {
    headers: getAuthHeaders()
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(apiErrorMessage(response, data, "Failed to load linked source items"));
  const sections = SOURCE_ITEM_SECTIONS_BY_PAGE[page] || [];
  const items = (data.items || []).filter((item) => !sections.length || sections.includes(String(item.section || "").toLowerCase()));
  sourceOptionsCache.set(key, items);
  return items;
}

async function populateSourceItemOptions(selectedId = "") {
  const page = fields.sourcePage.value;
  if (!page) return;

  const previous = selectedId || fields.sourceItemId.value || "";
  try {
    const items = await loadSourceItemsForPage(page);
    fields.sourceItemId.innerHTML = [
      '<option value="">Select a source item…</option>',
      ...items.map((item) => `<option value="${item.id}">${item.title || "Untitled"} • ${SECTION_LABELS[item.section] || item.section}</option>`)
    ].join("");
    if (previous && items.some((item) => item.id === previous)) {
      fields.sourceItemId.value = previous;
    }
  } catch (error) {
    fields.sourceItemId.innerHTML = '<option value="">Unable to load source items</option>';
    setStatus(error.message, true);
  }
}

function updateSourceFieldState() {
  const canLink = isLinkableIndexSection(filterPage.value, filterSection.value);
  if (!canLink) {
    fields.sourceMode.value = "custom";
    setFieldHidden("sourceMode", true);
    setFieldHidden("sourcePage", true);
    setFieldHidden("sourceItemId", true);
    fields.sourceItemId.required = false;
    return;
  }

  setFieldHidden("sourceMode", false);
  syncSourcePageOptions();
  const linked = fields.sourceMode.value === "linked";
  setFieldHidden("sourcePage", !linked);
  setFieldHidden("sourceItemId", !linked);
  fields.sourceItemId.required = linked;
  if (linked) {
    populateSourceItemOptions();
  } else {
    fields.sourceItemId.value = "";
  }
}

function showEditor(mode = "create") {
  editorOpen = true;
  itemEditorPanel.classList.remove("is-hidden");
  formTitle.textContent = mode === "edit" ? "Edit Item" : "Create Item";
  applyFieldProfile();
}

function hideEditor() {
  editorOpen = false;
  itemEditorPanel.classList.add("is-hidden");
}

function setItemsIdleState(message = "Choose filters and click Reload to load items.") {
  currentItems = [];
  itemsGrid.innerHTML = `<p>${message}</p>`;
  itemsCountEl.textContent = "0 items loaded";
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  window.setTimeout(() => {
    toast.remove();
  }, 2300);
}

function getAuthHeaders() {
  const headers = { "Content-Type": "application/json" };
  try {
    const rawSession = localStorage.getItem("imagineph_auth_session");
    if (rawSession) {
      const session = JSON.parse(rawSession);
      if (session?.accessToken) {
        headers.Authorization = `Bearer ${session.accessToken}`;
      }
    }
  } catch {
    // ignore session parse issues
  }

  const adminToken = localStorage.getItem(ADMIN_TOKEN_KEY);
  if (adminToken) {
    headers["x-admin-token"] = adminToken;
  }
  return headers;
}

function ensureAdminTokenIfNeeded() {
  if (localStorage.getItem(ADMIN_TOKEN_KEY)) return;
  const typed = window.prompt("Optional: Enter ADMIN_TOKEN for legacy admin mode. Leave blank if using signed-in admin account.");
  if (typed && typed.trim()) {
    localStorage.setItem(ADMIN_TOKEN_KEY, typed.trim());
  }
}

function apiErrorMessage(response, data, fallback) {
  if (response.status === 401) return ADMIN_REQUIRED_MESSAGE;
  return data?.error || fallback;
}

function readSession() {
  try {
    const raw = localStorage.getItem("imagineph_auth_session");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function isAdminRole(user) {
  return String(user?.role || "").toLowerCase() === "admin";
}

async function guardAdminAccess() {
  const adminToken = localStorage.getItem(ADMIN_TOKEN_KEY);
  if (adminToken) return true;

  const session = readSession();
  const token = session?.accessToken || "";
  if (!token) {
    const returnTo = encodeURIComponent(window.location.pathname + window.location.search + window.location.hash);
    window.location.href = `signin.html?returnTo=${returnTo}`;
    return false;
  }

  try {
    const response = await fetch("/api/auth/profile", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json().catch(() => ({}));
    const user = data?.user || data?.profile || null;
    if (!response.ok || !isAdminRole(user)) {
      alert("Admin access is required to open the CMS.");
      window.location.href = "index.html";
      return false;
    }
    localStorage.setItem("imagineph_auth_session", JSON.stringify({ ...session, user: { ...(session?.user || {}), ...user } }));
    return true;
  } catch {
    alert("Unable to verify admin session right now.");
    window.location.href = "index.html";
    return false;
  }
}

function setStatus(text, isError = false) {
  statusEl.textContent = text;
  statusEl.style.color = isError ? "#a12626" : "#665e55";
}

function setBookingStatus(text, isError = false) {
  bookingStatusEl.textContent = text;
  bookingStatusEl.style.color = isError ? "#a12626" : "#665e55";
}

function getContext() {
  return {
    city: filterCity.value,
    page: filterPage.value,
    section: filterSection.value
  };
}

function toPayload() {
  const userTags = fields.tags.value
    .split(/[\n,]/)
    .map((x) => x.trim())
    .filter(Boolean);
  const canLink = isLinkableIndexSection(filterPage.value, filterSection.value);
  const sourceMode = canLink ? (fields.sourceMode.value === "linked" ? "linked" : "custom") : "custom";

  if (canLink && sourceMode === "linked" && !fields.sourceItemId.value) {
    throw new Error("Select a linked source item or switch Content Source to Custom.");
  }
  if (canLink && sourceMode === "custom" && !fields.title.value.trim()) {
    throw new Error("Custom homepage items require a title.");
  }

  const tags = buildCmsTags(userTags, canLink
    ? {
        sourceMode,
        sourcePage: sourceMode === "linked" ? fields.sourcePage.value : "",
        sourceId: sourceMode === "linked" ? fields.sourceItemId.value : ""
      }
    : {});

  return {
    id: fields.id.value.trim() || undefined,
    ...getContext(),
    title: fields.title.value.trim(),
    image: fields.image.value.trim(),
    text: fields.text.value.trim(),
    meta: fields.meta.value.trim(),
    tag: fields.tag.value.trim(),
    tags,
    sortOrder: Number(fields.sortOrder.value || 0),
    bookingMode: fields.bookingMode.value,
    bookingType: fields.bookingType.value,
    ctaLabel: fields.ctaLabel.value.trim(),
    ctaUrl: fields.ctaUrl.value.trim(),
    bookingInfo: fields.bookingInfo.value.trim()
  };
}

function toBookingPayload() {
  return {
    id: bookingFields.id.value.trim() || undefined,
    city: filterCity.value,
    category: bookingFields.category.value,
    providerName: bookingFields.providerName.value.trim(),
    title: bookingFields.title.value.trim(),
    description: bookingFields.description.value.trim(),
    locationLabel: bookingFields.locationLabel.value.trim(),
    priceAmount: Number(bookingFields.priceAmount.value || 0),
    priceCurrency: bookingFields.priceCurrency.value.trim() || "PHP",
    priceUnit: bookingFields.priceUnit.value.trim(),
    rating: Number(bookingFields.rating.value || 0),
    reviewCount: Number(bookingFields.reviewCount.value || 0),
    thumbnailUrl: bookingFields.thumbnailUrl.value.trim(),
    affiliateUrl: bookingFields.affiliateUrl.value.trim(),
    status: bookingFields.status.value,
    sortOrder: Number(bookingFields.sortOrder.value || 0)
  };
}

function fillForm(item) {
  const parsedTags = parseCmsTags(item.tags || []);
  fields.id.value = item.id || "";
  fields.title.value = item.title || "";
  fields.image.value = item.image || "";
  fields.text.value = item.text || "";
  fields.meta.value = item.meta || "";
  fields.tag.value = item.tag || "";
  fields.tags.value = parsedTags.userTags.join("\n");
  fields.sortOrder.value = String(item.sortOrder || 0);
  fields.sourceMode.value = parsedTags.system.sourceMode === "linked" ? "linked" : "custom";
  fields.sourcePage.value = parsedTags.system.sourcePage || defaultSourcePageForSection(filterSection.value);
  fields.bookingMode.value = item.bookingMode || "none";
  fields.bookingType.value = item.bookingType || "experiences";
  fields.ctaLabel.value = item.ctaLabel || "";
  fields.ctaUrl.value = item.ctaUrl || "";
  fields.bookingInfo.value = item.bookingInfo || "";
  applyFieldProfile();
  if (fields.sourceMode.value === "linked") {
    populateSourceItemOptions(parsedTags.system.sourceId || "");
  }
  showEditor("edit");
}

function fillBookingForm(item) {
  bookingFields.id.value = item.id || "";
  bookingFields.category.value = item.category || "hotels";
  bookingFields.providerName.value = item.providerName || "";
  bookingFields.title.value = item.title || "";
  bookingFields.description.value = item.description || "";
  bookingFields.locationLabel.value = item.locationLabel || "";
  bookingFields.priceAmount.value = String(item.priceAmount || 0);
  bookingFields.priceCurrency.value = item.priceCurrency || "PHP";
  bookingFields.priceUnit.value = item.priceUnit || "";
  bookingFields.rating.value = String(item.rating || 4.5);
  bookingFields.reviewCount.value = String(item.reviewCount || 0);
  bookingFields.thumbnailUrl.value = item.thumbnailUrl || "";
  bookingFields.affiliateUrl.value = item.affiliateUrl || "";
  bookingFields.status.value = item.status || "published";
  bookingFields.sortOrder.value = String(item.sortOrder || 0);
  bookingFormTitle.textContent = "Update Booking Row";
}

function clearForm() {
  fields.id.value = "";
  itemForm.reset();
  fields.sortOrder.value = "1";
  fields.sourceMode.value = "custom";
  fields.sourcePage.value = defaultSourcePageForSection(filterSection.value);
  fields.sourceItemId.innerHTML = '<option value="">Select a source item…</option>';
  fields.bookingMode.value = "none";
  fields.bookingType.value = "experiences";
  formTitle.textContent = "Create Item";
  applyFieldProfile();
}

function clearBookingForm() {
  bookingFields.id.value = "";
  bookingForm.reset();
  bookingFields.priceAmount.value = "0";
  bookingFields.priceCurrency.value = "PHP";
  bookingFields.rating.value = "4.5";
  bookingFields.reviewCount.value = "0";
  bookingFields.sortOrder.value = "1";
  bookingFields.status.value = "published";
  bookingFields.category.value = "flights";
  bookingFormTitle.textContent = "Booking Inventory (Affiliate Rows)";
}

async function loadItems() {
  const ctx = getContext();
  const qs = new URLSearchParams(ctx);
  const response = await fetch(`/api/cms/items?${qs.toString()}`, { headers: getAuthHeaders() });
  const data = await response.json();
  if (!response.ok) throw new Error(apiErrorMessage(response, data, "Failed to load items"));
  currentItems = data.items || [];
  itemsCountEl.textContent = `${currentItems.length} item${currentItems.length === 1 ? "" : "s"} loaded`;
  renderItems();
}

async function loadBookingItems() {
  const qs = new URLSearchParams({ city: filterCity.value });
  const response = await fetch(`/api/admin/booking-inventory?${qs.toString()}`, { headers: getAuthHeaders() });
  const data = await response.json();
  if (!response.ok) throw new Error(apiErrorMessage(response, data, "Failed to load booking inventory"));
  bookingItems = data.items || [];
  renderBookingItems();
}

function renderItems() {
  if (!currentItems.length) {
    itemsGrid.innerHTML = "<p>No items found for this page and section yet.</p>";
    return;
  }

  itemsGrid.innerHTML = currentItems
    .map(
      (item) => `
      <article class="item">
        <img src="${item.image || "assets/fallback-travel.svg"}" alt="${item.title || "Item"}" />
        <div class="item-body">
          <h3>${item.title || "Untitled"}</h3>
          <p>${item.text || ""}</p>
          <div class="meta">
            <span class="pill">${item.section}</span>
            <span class="pill">${item.page}</span>
            <span class="pill">${item.bookingMode || "none"}</span>
          </div>
          <div class="item-actions">
            <button class="btn ghost js-edit" data-id="${item.id}">Edit</button>
            <button class="btn ghost js-delete" data-id="${item.id}">Delete</button>
          </div>
        </div>
      </article>
    `
    )
    .join("");
}

function renderBookingItems() {
  if (!bookingItems.length) {
    bookingItemsGrid.innerHTML = "<p>No booking inventory rows for this city yet.</p>";
    return;
  }

  bookingItemsGrid.innerHTML = bookingItems
    .slice()
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    .map(
      (item) => `
      <article class="item">
        <img src="${item.thumbnailUrl || "assets/fallback-travel.svg"}" alt="${item.title || "Booking item"}" />
        <div class="item-body">
          <h3>${item.title || "Untitled"}</h3>
          <p>${item.description || ""}</p>
          <div class="meta">
            <span class="pill">${item.category || "unknown"}</span>
            <span class="pill">${item.providerName || "Provider"}</span>
            <span class="pill">${item.status || "published"}</span>
          </div>
          <div class="item-actions">
            <button class="btn ghost js-booking-edit" data-id="${item.id}">Edit</button>
            <button class="btn ghost js-booking-delete" data-id="${item.id}">Delete</button>
          </div>
        </div>
      </article>
    `
    )
    .join("");
}

async function saveItem(event) {
  event.preventDefault();
  const payload = toPayload();
  const isUpdate = Boolean(payload.id);
  const response = await fetch("/api/cms/items", {
    method: isUpdate ? "PUT" : "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(apiErrorMessage(response, data, "Failed to save item"));
  const message = isUpdate ? "Item updated successfully." : "Item created successfully.";
  setStatus(message);
  clearForm();
  hideEditor();
  showToast(message);
  await loadItems();
}

async function saveBookingItem(event) {
  event.preventDefault();
  const payload = toBookingPayload();
  const isUpdate = Boolean(payload.id);
  const response = await fetch("/api/admin/booking-inventory", {
    method: isUpdate ? "PUT" : "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(apiErrorMessage(response, data, "Failed to save booking inventory item"));
  setBookingStatus(isUpdate ? "Booking row updated." : "Booking row created.");
  clearBookingForm();
  await loadBookingItems();
}

async function deleteItem(id) {
  const response = await fetch(`/api/cms/items?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });
  const data = await response.json();
  if (!response.ok) throw new Error(apiErrorMessage(response, data, "Failed to delete item"));
  setStatus("Item deleted.");
  await loadItems();
}

async function deleteBookingItem(id) {
  const response = await fetch(`/api/admin/booking-inventory?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });
  const data = await response.json();
  if (!response.ok) throw new Error(apiErrorMessage(response, data, "Failed to delete booking row"));
  setBookingStatus("Booking row deleted.");
  await loadBookingItems();
}

itemsGrid.addEventListener("click", async (event) => {
  const editBtn = event.target.closest(".js-edit");
  if (editBtn) {
    const found = currentItems.find((item) => item.id === editBtn.dataset.id);
    if (found) fillForm(found);
    return;
  }

  const deleteBtn = event.target.closest(".js-delete");
  if (deleteBtn) {
    const ok = window.confirm("Delete this item?");
    if (!ok) return;
    try {
      await deleteItem(deleteBtn.dataset.id);
    } catch (error) {
      setStatus(error.message, true);
    }
  }
});

bookingItemsGrid.addEventListener("click", async (event) => {
  const editBtn = event.target.closest(".js-booking-edit");
  if (editBtn) {
    const found = bookingItems.find((item) => item.id === editBtn.dataset.id);
    if (found) fillBookingForm(found);
    return;
  }

  const deleteBtn = event.target.closest(".js-booking-delete");
  if (deleteBtn) {
    const ok = window.confirm("Delete this booking row?");
    if (!ok) return;
    try {
      await deleteBookingItem(deleteBtn.dataset.id);
    } catch (error) {
      setBookingStatus(error.message, true);
    }
  }
});

reloadBtn.addEventListener("click", async () => {
  try {
    await Promise.all([loadItems(), loadBookingItems()]);
    setStatus("Items loaded.");
    setBookingStatus("Booking rows loaded.");
    hideEditor();
  } catch (error) {
    setStatus(error.message, true);
    setBookingStatus(error.message, true);
  }
});

resetBtn.addEventListener("click", () => {
  clearForm();
  setStatus("Form reset.");
});

fields.sourceMode.addEventListener("change", () => {
  updateSourceFieldState();
});

fields.sourcePage.addEventListener("change", () => {
  populateSourceItemOptions();
});

createItemBtn.addEventListener("click", () => {
  clearForm();
  showEditor("create");
  setStatus("");
});

closeEditorBtn.addEventListener("click", () => {
  hideEditor();
  clearForm();
  setStatus("Editor closed.");
});

bookingResetBtn.addEventListener("click", () => {
  clearBookingForm();
  setBookingStatus("Booking form reset.");
});

itemForm.addEventListener("submit", async (event) => {
  try {
    await saveItem(event);
  } catch (error) {
    setStatus(error.message, true);
  }
});

bookingForm.addEventListener("submit", async (event) => {
  try {
    await saveBookingItem(event);
  } catch (error) {
    setBookingStatus(error.message, true);
  }
});

[filterCity, filterSection].forEach((node) => {
  node.addEventListener("change", () => {
    clearForm();
    applyFieldProfile();
    hideEditor();
    setItemsIdleState();
    clearBookingForm();
    loadBookingItems().catch((error) => setBookingStatus(error.message, true));
  });
});

filterPage.addEventListener("change", () => {
  syncSectionOptions();
  clearForm();
  applyFieldProfile();
  hideEditor();
  setItemsIdleState();
  clearBookingForm();
  loadBookingItems().catch((error) => setBookingStatus(error.message, true));
});

async function initAdminPage() {
  const allowed = await guardAdminAccess();
  if (!allowed) return;

  syncSectionOptions(filterSection.value);
  applyFieldProfile();
  hideEditor();
  setItemsIdleState();
  loadBookingItems().then(
    () => setBookingStatus("Booking rows loaded."),
    (error) => setBookingStatus(error.message, true)
  );
  setStatus("Select Page/Section, then click Reload to view items.");
}

initAdminPage();

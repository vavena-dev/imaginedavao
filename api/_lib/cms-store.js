const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
const { hasSupabaseConfig, isSupabaseBackendEnabled, supabaseRestRequest } = require("./supabase-rest");

const STORE_FILE = path.join(process.cwd(), "data", "cms_content.json");

function nowIso() {
  return new Date().toISOString();
}

async function ensureStore() {
  try {
    await fs.access(STORE_FILE);
  } catch {
    await fs.mkdir(path.dirname(STORE_FILE), { recursive: true });
    await fs.writeFile(STORE_FILE, JSON.stringify({ items: [] }, null, 2), "utf8");
  }
}

async function readStore() {
  if (isSupabaseBackendEnabled() && hasSupabaseConfig()) {
    const items = await listCmsItems({}, { includeDrafts: true });
    return { items };
  }
  await ensureStore();
  const raw = await fs.readFile(STORE_FILE, "utf8");
  const parsed = JSON.parse(raw || "{}");
  if (!Array.isArray(parsed.items)) parsed.items = [];
  return parsed;
}

async function writeStore(store) {
  await fs.mkdir(path.dirname(STORE_FILE), { recursive: true });
  await fs.writeFile(STORE_FILE, JSON.stringify(store, null, 2), "utf8");
}

function normalizeMode(mode) {
  const value = String(mode || "none").toLowerCase();
  if (["book", "provider", "info", "none"].includes(value)) return value;
  return "none";
}

function normalizeItem(input, existing = {}) {
  const section = String(input.section || existing.section || "").trim();
  const page = String(input.page || existing.page || "index").trim();
  const city = String(input.city || existing.city || "davao").trim().toLowerCase();

  if (!section) {
    throw new Error("section is required");
  }

  const item = {
    id: existing.id || crypto.randomUUID(),
    city,
    page,
    section,
    title: String(input.title || existing.title || "").trim(),
    text: String(input.text || existing.text || "").trim(),
    image: String(input.image || existing.image || "").trim(),
    meta: String(input.meta || existing.meta || "").trim(),
    tag: String(input.tag || existing.tag || "").trim(),
    tags: Array.isArray(input.tags)
      ? input.tags.map((x) => String(x).trim()).filter(Boolean)
      : Array.isArray(existing.tags)
      ? existing.tags
      : [],
    ctaLabel: String(input.ctaLabel || existing.ctaLabel || "").trim(),
    ctaUrl: String(input.ctaUrl || existing.ctaUrl || "").trim(),
    bookingMode: normalizeMode(input.bookingMode || existing.bookingMode),
    bookingType: String(input.bookingType || existing.bookingType || "").trim(), // hotels, experiences, flights, cars
    bookingInfo: String(input.bookingInfo || existing.bookingInfo || "").trim(),
    status: String(input.status || existing.status || "published").trim().toLowerCase(),
    sortOrder: Number.isFinite(Number(input.sortOrder)) ? Number(input.sortOrder) : Number(existing.sortOrder || 0),
    createdAt: existing.createdAt || nowIso(),
    updatedAt: nowIso()
  };

  if (!["draft", "published"].includes(item.status)) {
    item.status = "published";
  }

  return item;
}

function filterItems(items, query = {}) {
  return items.filter((item) => {
    if (query.city && item.city !== String(query.city).toLowerCase()) return false;
    if (query.page && item.page !== String(query.page)) return false;
    if (query.section && item.section !== String(query.section)) return false;
    return true;
  });
}

function groupBySection(items) {
  const grouped = {};
  items
    .slice()
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0) || a.title.localeCompare(b.title))
    .forEach((item) => {
      if (!grouped[item.section]) grouped[item.section] = [];
      grouped[item.section].push(item);
    });
  return grouped;
}

function mapSupabaseRowToCmsItem(row) {
  return {
    id: row.id,
    city: String(row.city || "davao").toLowerCase(),
    page: String(row.page || "index"),
    section: String(row.section || ""),
    title: String(row.title || ""),
    text: String(row.body || ""),
    image: String(row.image_url || row.storage_path || ""),
    meta: String(row.meta || ""),
    tag: String(row.tag || ""),
    tags: Array.isArray(row.tags) ? row.tags.map((x) => String(x)) : [],
    ctaLabel: String(row.cta_label || ""),
    ctaUrl: String(row.cta_url || ""),
    bookingMode: normalizeMode(row.booking_mode || "none"),
    bookingType: String(row.booking_type || ""),
    bookingInfo: String(row.booking_info || ""),
    status: String(row.status || "published"),
    sortOrder: Number.isFinite(Number(row.sort_order)) ? Number(row.sort_order) : 0,
    createdAt: row.created_at || nowIso(),
    updatedAt: row.updated_at || nowIso()
  };
}

function mapCmsItemToSupabaseRow(item, existing = null) {
  const normalized = normalizeItem(item, existing || {});
  return {
    city: normalized.city,
    page: normalized.page,
    section: normalized.section,
    title: normalized.title,
    body: normalized.text,
    image_mode: "url",
    image_url: normalized.image,
    meta: normalized.meta,
    tag: normalized.tag,
    tags: normalized.tags,
    cta_label: normalized.ctaLabel,
    cta_url: normalized.ctaUrl,
    booking_mode: normalized.bookingMode,
    booking_type: normalized.bookingType || null,
    booking_info: normalized.bookingInfo || null,
    status: normalized.status,
    sort_order: normalized.sortOrder
  };
}

async function listCmsItems(query = {}, options = {}) {
  if (!(isSupabaseBackendEnabled() && hasSupabaseConfig())) {
    const store = await readStore();
    return filterItems(store.items, query).sort(
      (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0) || a.title.localeCompare(b.title)
    );
  }

  const params = {
    select: "*",
    order: "sort_order.asc,title.asc"
  };
  if (query.city) params.city = `eq.${String(query.city).toLowerCase()}`;
  if (query.page) params.page = `eq.${String(query.page)}`;
  if (query.section) params.section = `eq.${String(query.section)}`;
  if (!options.includeDrafts) params.status = "eq.published";

  const rows = await supabaseRestRequest("content_blocks", { query: params });
  return Array.isArray(rows) ? rows.map(mapSupabaseRowToCmsItem) : [];
}

async function createCmsItem(payload) {
  if (!(isSupabaseBackendEnabled() && hasSupabaseConfig())) {
    const store = await readStore();
    const next = normalizeItem(payload);
    store.items.push(next);
    await writeStore(store);
    return next;
  }

  const rowPayload = mapCmsItemToSupabaseRow(payload);
  const rows = await supabaseRestRequest("content_blocks", {
    method: "POST",
    preferRepresentation: true,
    body: rowPayload
  });
  if (!Array.isArray(rows) || !rows[0]) throw new Error("Failed to create item");
  return mapSupabaseRowToCmsItem(rows[0]);
}

async function updateCmsItem(id, payload) {
  if (!id) throw new Error("id is required");

  if (!(isSupabaseBackendEnabled() && hasSupabaseConfig())) {
    const store = await readStore();
    const idx = store.items.findIndex((item) => item.id === id);
    if (idx === -1) throw new Error("Item not found");
    const updated = normalizeItem(payload, store.items[idx]);
    store.items[idx] = updated;
    await writeStore(store);
    return updated;
  }

  const existingRows = await supabaseRestRequest("content_blocks", {
    query: { select: "*", id: `eq.${id}`, limit: 1 }
  });
  const existing = Array.isArray(existingRows) ? existingRows[0] : null;
  if (!existing) throw new Error("Item not found");

  const rowPayload = mapCmsItemToSupabaseRow(payload, mapSupabaseRowToCmsItem(existing));
  const rows = await supabaseRestRequest("content_blocks", {
    method: "PATCH",
    query: { id: `eq.${id}` },
    preferRepresentation: true,
    body: rowPayload
  });
  if (!Array.isArray(rows) || !rows[0]) throw new Error("Failed to update item");
  return mapSupabaseRowToCmsItem(rows[0]);
}

async function deleteCmsItem(id) {
  if (!id) throw new Error("id is required");

  if (!(isSupabaseBackendEnabled() && hasSupabaseConfig())) {
    const store = await readStore();
    const idx = store.items.findIndex((item) => item.id === id);
    if (idx === -1) throw new Error("Item not found");
    const [removed] = store.items.splice(idx, 1);
    await writeStore(store);
    return removed;
  }

  const rows = await supabaseRestRequest("content_blocks", {
    method: "DELETE",
    query: { id: `eq.${id}` },
    preferRepresentation: true
  });
  if (!Array.isArray(rows) || !rows[0]) throw new Error("Item not found");
  return mapSupabaseRowToCmsItem(rows[0]);
}

module.exports = {
  createCmsItem,
  deleteCmsItem,
  filterItems,
  groupBySection,
  listCmsItems,
  normalizeItem,
  readStore,
  updateCmsItem,
  writeStore
};

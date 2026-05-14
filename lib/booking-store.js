const { isSupabaseBackendEnabled, hasSupabaseConfig, supabaseRestRequest } = require("./supabase-rest");

function normalizeCity(city) {
  return String(city || "davao").trim().toLowerCase();
}

function normalizeCategory(category) {
  return String(category || "hotels").trim().toLowerCase();
}

function mapRowToInventoryItem(row) {
  return {
    id: row.id,
    city: normalizeCity(row.city),
    category: normalizeCategory(row.category),
    providerName: String(row.provider_name || ""),
    title: String(row.title || ""),
    description: String(row.description || ""),
    locationLabel: String(row.location_label || ""),
    priceAmount: Number.isFinite(Number(row.price_amount)) ? Number(row.price_amount) : 0,
    priceCurrency: String(row.price_currency || "PHP"),
    priceUnit: String(row.price_unit || ""),
    rating: Number.isFinite(Number(row.rating)) ? Number(row.rating) : null,
    reviewCount: Number.isFinite(Number(row.review_count)) ? Number(row.review_count) : null,
    thumbnailMode: String(row.thumbnail_mode || "url"),
    thumbnailUrl: String(row.thumbnail_url || row.thumbnail_storage_path || ""),
    affiliateUrl: String(row.affiliate_url || ""),
    bookable: row.bookable !== false,
    status: String(row.status || "published"),
    sortOrder: Number.isFinite(Number(row.sort_order)) ? Number(row.sort_order) : 0,
    createdAt: row.created_at || "",
    updatedAt: row.updated_at || ""
  };
}

function mapPayloadToRow(payload, existing = {}) {
  const category = normalizeCategory(payload.category || existing.category || "hotels");
  if (!["flights", "hotels", "experiences", "cars"].includes(category)) {
    throw new Error("Unsupported category");
  }

  const title = String(payload.title || existing.title || "").trim();
  const description = String(payload.description || existing.description || "").trim();
  if (!title) throw new Error("title is required");
  if (!description) throw new Error("description is required");

  const status = String(payload.status || existing.status || "published").toLowerCase();
  if (!["draft", "published"].includes(status)) throw new Error("status must be draft or published");

  return {
    city: normalizeCity(payload.city || existing.city || "davao"),
    category,
    provider_name: String(payload.providerName || existing.providerName || "").trim(),
    title,
    description,
    location_label: String(payload.locationLabel || existing.locationLabel || "").trim() || null,
    price_amount: Number.isFinite(Number(payload.priceAmount)) ? Number(payload.priceAmount) : Number(existing.priceAmount || 0),
    price_currency: String(payload.priceCurrency || existing.priceCurrency || "PHP").trim() || "PHP",
    price_unit: String(payload.priceUnit || existing.priceUnit || "").trim() || null,
    rating: Number.isFinite(Number(payload.rating)) ? Number(payload.rating) : existing.rating ?? null,
    review_count: Number.isFinite(Number(payload.reviewCount)) ? Number(payload.reviewCount) : existing.reviewCount ?? null,
    thumbnail_mode: "url",
    thumbnail_url: String(payload.thumbnailUrl || existing.thumbnailUrl || "").trim(),
    affiliate_url: String(payload.affiliateUrl || existing.affiliateUrl || "").trim() || null,
    bookable: payload.bookable === undefined ? existing.bookable !== false : Boolean(payload.bookable),
    status,
    sort_order: Number.isFinite(Number(payload.sortOrder)) ? Number(payload.sortOrder) : Number(existing.sortOrder || 0)
  };
}

function mapInventoryToSearchResult(item, cityLabel) {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    rating: item.rating ? item.rating.toFixed(1) : "4.5",
    location: item.locationLabel || cityLabel,
    price: item.priceAmount || 0,
    currency: item.priceCurrency || "PHP",
    priceUnit: item.priceUnit || "",
    image: item.thumbnailUrl || "assets/fallback-davao.svg",
    providerName: item.providerName || "",
    bookable: item.bookable !== false,
    affiliateUrl: item.affiliateUrl || ""
  };
}

async function listBookingInventory(query = {}, options = {}) {
  if (!(isSupabaseBackendEnabled() && hasSupabaseConfig())) {
    return [];
  }

  const params = {
    select: "*",
    order: "sort_order.asc,title.asc"
  };
  if (query.city) params.city = `eq.${normalizeCity(query.city)}`;
  if (query.category) params.category = `eq.${normalizeCategory(query.category)}`;
  if (!options.includeDrafts) params.status = "eq.published";

  const rows = await supabaseRestRequest("booking_inventory", { query: params });
  return Array.isArray(rows) ? rows.map(mapRowToInventoryItem) : [];
}

async function createBookingInventoryItem(payload) {
  if (!(isSupabaseBackendEnabled() && hasSupabaseConfig())) {
    throw new Error("Supabase backend is not enabled");
  }
  const row = mapPayloadToRow(payload);
  const rows = await supabaseRestRequest("booking_inventory", {
    method: "POST",
    preferRepresentation: true,
    body: row
  });
  if (!Array.isArray(rows) || !rows[0]) throw new Error("Failed to create booking inventory item");
  return mapRowToInventoryItem(rows[0]);
}

async function updateBookingInventoryItem(id, payload) {
  if (!id) throw new Error("id is required");
  if (!(isSupabaseBackendEnabled() && hasSupabaseConfig())) {
    throw new Error("Supabase backend is not enabled");
  }

  const existingRows = await supabaseRestRequest("booking_inventory", {
    query: { select: "*", id: `eq.${id}`, limit: 1 }
  });
  const existing = Array.isArray(existingRows) ? existingRows[0] : null;
  if (!existing) throw new Error("Item not found");

  const mappedExisting = mapRowToInventoryItem(existing);
  const row = mapPayloadToRow(payload, mappedExisting);
  const rows = await supabaseRestRequest("booking_inventory", {
    method: "PATCH",
    query: { id: `eq.${id}` },
    preferRepresentation: true,
    body: row
  });
  if (!Array.isArray(rows) || !rows[0]) throw new Error("Failed to update booking inventory item");
  return mapRowToInventoryItem(rows[0]);
}

async function deleteBookingInventoryItem(id) {
  if (!id) throw new Error("id is required");
  if (!(isSupabaseBackendEnabled() && hasSupabaseConfig())) {
    throw new Error("Supabase backend is not enabled");
  }

  const rows = await supabaseRestRequest("booking_inventory", {
    method: "DELETE",
    query: { id: `eq.${id}` },
    preferRepresentation: true
  });
  if (!Array.isArray(rows) || !rows[0]) throw new Error("Item not found");
  return mapRowToInventoryItem(rows[0]);
}

module.exports = {
  createBookingInventoryItem,
  deleteBookingInventoryItem,
  listBookingInventory,
  mapInventoryToSearchResult,
  updateBookingInventoryItem
};

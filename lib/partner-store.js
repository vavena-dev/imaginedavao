const fs = require("fs");
const path = require("path");
const { hasSupabaseConfig, isSupabaseBackendEnabled, supabaseRestRequest } = require("./supabase-rest");

const FALLBACK_FILE = path.join(process.cwd(), "data", "partner_programs.json");
const VALID_BILLING_MODELS = new Set(["monthly", "campaign", "commission", "lead_fee", "hybrid"]);

function normalizeCity(city) {
  return String(city || "davao").trim().toLowerCase();
}

function normalizeBillingModel(value) {
  const model = String(value || "monthly").trim().toLowerCase();
  return VALID_BILLING_MODELS.has(model) ? model : "monthly";
}

function toNumber(value, fallback = 0) {
  const next = Number(value);
  return Number.isFinite(next) ? next : fallback;
}

function normalizeBenefits(value) {
  if (Array.isArray(value)) return value.map((item) => String(item || "").trim()).filter(Boolean);
  if (typeof value === "string" && value.trim()) {
    return value.split(/\n|,/).map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

function mapRowToPartnerProgram(row = {}) {
  return {
    id: String(row.id || row.slug || ""),
    city: normalizeCity(row.city),
    slug: String(row.slug || row.id || "").trim(),
    title: String(row.title || "").trim(),
    category: String(row.category || "visibility").trim(),
    partnerType: String(row.partner_type || row.partnerType || "").trim(),
    placementType: String(row.placement_type || row.placementType || "").trim(),
    billingModel: normalizeBillingModel(row.billing_model || row.billingModel),
    priceAmount: toNumber(row.price_amount ?? row.priceAmount),
    priceCurrency: String(row.price_currency || row.priceCurrency || "PHP").trim() || "PHP",
    commissionRate: toNumber(row.commission_rate ?? row.commissionRate),
    leadFeeAmount: toNumber(row.lead_fee_amount ?? row.leadFeeAmount),
    featuredSlots: toNumber(row.featured_slots ?? row.featuredSlots),
    summary: String(row.summary || "").trim(),
    benefits: normalizeBenefits(row.benefits),
    status: String(row.status || "published").trim().toLowerCase(),
    sortOrder: toNumber(row.sort_order ?? row.sortOrder),
    createdAt: row.created_at || row.createdAt || "",
    updatedAt: row.updated_at || row.updatedAt || ""
  };
}

function readFallbackPrograms() {
  try {
    const raw = fs.readFileSync(FALLBACK_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(mapRowToPartnerProgram) : [];
  } catch {
    return [];
  }
}

async function listPartnerPrograms(query = {}, options = {}) {
  const city = normalizeCity(query.city);
  const includeDrafts = Boolean(options.includeDrafts);

  if (isSupabaseBackendEnabled() && hasSupabaseConfig()) {
    const params = {
      select: "*",
      city: `eq.${city}`,
      order: "sort_order.asc,title.asc"
    };
    if (!includeDrafts) params.status = "eq.published";
    if (query.category) params.category = `eq.${String(query.category).trim().toLowerCase()}`;

    try {
      const rows = await supabaseRestRequest("partner_programs", { query: params });
      return Array.isArray(rows) ? rows.map(mapRowToPartnerProgram) : [];
    } catch (error) {
      const message = String(error.message || "");
      if (!/partner_programs|schema cache|does not exist/i.test(message)) throw error;
    }
  }

  return readFallbackPrograms()
    .filter((program) => program.city === city)
    .filter((program) => includeDrafts || program.status === "published")
    .filter((program) => !query.category || program.category === String(query.category).trim().toLowerCase())
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0) || a.title.localeCompare(b.title));
}

module.exports = {
  listPartnerPrograms,
  mapRowToPartnerProgram
};

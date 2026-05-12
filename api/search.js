const { buildResultSet, readJsonBody, sendJson } = require("../lib/common");
const { listBookingInventory, mapInventoryToSearchResult } = require("../lib/booking-store");

function normalizeCity(city) {
  return String(city || "davao").trim().toLowerCase();
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  try {
    const body = await readJsonBody(req);
    const category = String(body.category || "hotels").toLowerCase();
    const city = String(body.city || "Davao");
    const payload = body.payload && typeof body.payload === "object" ? body.payload : {};

    if (!["flights", "hotels", "experiences", "cars"].includes(category)) {
      return sendJson(res, 400, { error: "Unsupported category" });
    }

    try {
      const inventory = await listBookingInventory({ city: normalizeCity(city), category }, { includeDrafts: false });
      if (inventory.length) {
        const mapped = inventory.map((item) => mapInventoryToSearchResult(item, city));
        return sendJson(res, 200, { category, city, source: "supabase", results: mapped });
      }
    } catch {
      // Fall through to demo generator to keep UX resilient.
    }

    const results = buildResultSet(category, city, payload);
    return sendJson(res, 200, { category, city, source: "demo", results });
  } catch (error) {
    return sendJson(res, 500, { error: error.message || "Failed to generate results" });
  }
};

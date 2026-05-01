const { sendJson } = require("../_lib/common");
const { listBookingInventory } = require("../_lib/booking-store");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  try {
    const url = new URL(req.url, "http://localhost");
    const city = url.searchParams.get("city") || "davao";
    const category = url.searchParams.get("category");
    const items = await listBookingInventory({ city, category: category || undefined }, { includeDrafts: false });
    return sendJson(res, 200, { city, category: category || null, items });
  } catch (error) {
    return sendJson(res, 500, { error: error.message || "Failed to fetch booking inventory" });
  }
};

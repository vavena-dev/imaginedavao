const { readJsonBody, sendJson } = require("../_lib/common");
const {
  createBookingInventoryItem,
  deleteBookingInventoryItem,
  listBookingInventory,
  updateBookingInventoryItem
} = require("../_lib/booking-store");
const { resolveAuthContext } = require("../_lib/auth");

async function hasAdminAccess(req) {
  const required = process.env.ADMIN_TOKEN;
  if (!required) {
    const auth = await resolveAuthContext(req);
    return auth.isAdmin;
  }
  const given = req.headers["x-admin-token"] || req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (Boolean(given) && given === required) return true;
  const auth = await resolveAuthContext(req);
  return auth.isAdmin;
}

module.exports = async function handler(req, res) {
  if (!(await hasAdminAccess(req))) {
    return sendJson(res, 401, { error: "Unauthorized" });
  }

  if (req.method === "GET") {
    try {
      const url = new URL(req.url, "http://localhost");
      const city = url.searchParams.get("city");
      const category = url.searchParams.get("category");
      const items = await listBookingInventory(
        { city: city || undefined, category: category || undefined },
        { includeDrafts: true }
      );
      return sendJson(res, 200, { items });
    } catch (error) {
      return sendJson(res, 500, { error: error.message || "Failed to list booking inventory" });
    }
  }

  if (req.method === "POST") {
    try {
      const payload = await readJsonBody(req);
      const item = await createBookingInventoryItem(payload);
      return sendJson(res, 201, { item });
    } catch (error) {
      return sendJson(res, 400, { error: error.message || "Failed to create booking inventory item" });
    }
  }

  if (req.method === "PUT") {
    try {
      const payload = await readJsonBody(req);
      const id = String(payload.id || "").trim();
      if (!id) return sendJson(res, 400, { error: "id is required" });
      const item = await updateBookingInventoryItem(id, payload);
      return sendJson(res, 200, { item });
    } catch (error) {
      if (String(error.message).toLowerCase().includes("not found")) {
        return sendJson(res, 404, { error: "Item not found" });
      }
      return sendJson(res, 400, { error: error.message || "Failed to update booking inventory item" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const url = new URL(req.url, "http://localhost");
      const id = String(url.searchParams.get("id") || "").trim();
      if (!id) return sendJson(res, 400, { error: "id is required" });
      const removed = await deleteBookingInventoryItem(id);
      return sendJson(res, 200, { removed });
    } catch (error) {
      if (String(error.message).toLowerCase().includes("not found")) {
        return sendJson(res, 404, { error: "Item not found" });
      }
      return sendJson(res, 500, { error: error.message || "Failed to delete booking inventory item" });
    }
  }

  return sendJson(res, 405, { error: "Method not allowed" });
};

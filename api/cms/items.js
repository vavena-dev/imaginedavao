const { readJsonBody, sendJson } = require("../../lib/common");
const { createCmsItem, deleteCmsItem, listCmsItems, updateCmsItem } = require("../../lib/cms-store");
const { resolveAuthContext } = require("../../lib/auth");

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
  if (req.method === "GET") {
    try {
      const url = new URL(req.url, "http://localhost");
      const city = url.searchParams.get("city");
      const page = url.searchParams.get("page");
      const section = url.searchParams.get("section");
      const items = await listCmsItems({
        city: city || undefined,
        page: page || undefined,
        section: section || undefined
      }, { includeDrafts: true });
      return sendJson(res, 200, { items });
    } catch (error) {
      return sendJson(res, 500, { error: error.message || "Failed to list items" });
    }
  }

  if (!(await hasAdminAccess(req))) {
    return sendJson(res, 401, { error: "Unauthorized" });
  }

  if (req.method === "POST") {
    try {
      const payload = await readJsonBody(req);
      const next = await createCmsItem(payload);
      return sendJson(res, 201, { item: next });
    } catch (error) {
      return sendJson(res, 400, { error: error.message || "Failed to create item" });
    }
  }

  if (req.method === "PUT") {
    try {
      const payload = await readJsonBody(req);
      const id = String(payload.id || "").trim();
      if (!id) return sendJson(res, 400, { error: "id is required" });

      const updated = await updateCmsItem(id, payload);
      return sendJson(res, 200, { item: updated });
    } catch (error) {
      if (String(error.message).toLowerCase().includes("not found")) {
        return sendJson(res, 404, { error: "Item not found" });
      }
      return sendJson(res, 400, { error: error.message || "Failed to update item" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const url = new URL(req.url, "http://localhost");
      const id = String(url.searchParams.get("id") || "").trim();
      if (!id) return sendJson(res, 400, { error: "id is required" });

      const removed = await deleteCmsItem(id);
      return sendJson(res, 200, { removed });
    } catch (error) {
      if (String(error.message).toLowerCase().includes("not found")) {
        return sendJson(res, 404, { error: "Item not found" });
      }
      return sendJson(res, 500, { error: error.message || "Failed to delete item" });
    }
  }

  return sendJson(res, 405, { error: "Method not allowed" });
};

const { readJsonBody, sendJson } = require("../_lib/common");
const { groupBySection, listCmsItems } = require("../_lib/cms-store");

module.exports = async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const url = new URL(req.url, "http://localhost");
      const city = url.searchParams.get("city") || "davao";
      const page = url.searchParams.get("page") || "index";
      const section = url.searchParams.get("section");
      const scoped = await listCmsItems({ city, page, section: section || undefined }, { includeDrafts: false });
      return sendJson(res, 200, {
        city,
        page,
        section: section || null,
        grouped: groupBySection(scoped),
        items: scoped
      });
    } catch (error) {
      return sendJson(res, 500, { error: error.message || "Failed to fetch content" });
    }
  }

  if (req.method === "POST") {
    // Convenience endpoint for client calls with JSON filter payload.
    try {
      const body = await readJsonBody(req);
      const city = body.city || "davao";
      const page = body.page || "index";
      const section = body.section;
      const scoped = await listCmsItems({ city, page, section: section || undefined }, { includeDrafts: false });
      return sendJson(res, 200, {
        city,
        page,
        section: section || null,
        grouped: groupBySection(scoped),
        items: scoped
      });
    } catch (error) {
      return sendJson(res, 500, { error: error.message || "Failed to fetch content" });
    }
  }

  return sendJson(res, 405, { error: "Method not allowed" });
};

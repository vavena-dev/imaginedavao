const {
  appendClickLog,
  buildTrackedUrl,
  getIp,
  makeTrackId,
  readJsonBody,
  sendJson
} = require("./_lib/common");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  try {
    const body = await readJsonBody(req);
    const { url, category = "unknown", city = "unknown", payload = {}, source = "web", title = "" } = body;

    if (!url || typeof url !== "string") {
      return sendJson(res, 400, { error: "Missing booking URL" });
    }

    const trackId = makeTrackId();
    const trackedUrl = buildTrackedUrl(url, trackId);

    try {
      await appendClickLog({
        trackId,
        timestamp: new Date().toISOString(),
        category,
        city,
        source,
        title,
        url,
        trackedUrl,
        payload,
        userAgent: req.headers["user-agent"] || "",
        referer: req.headers.referer || "",
        ip: getIp(req)
      });
    } catch {
      // Logging is best-effort in serverless; response should still succeed.
    }

    return sendJson(res, 200, { trackId, trackedUrl });
  } catch (error) {
    return sendJson(res, 500, { error: error.message || "Failed to create booking link" });
  }
};

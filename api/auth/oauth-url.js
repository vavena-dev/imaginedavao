const { buildOAuthAuthorizeUrl } = require("../_lib/auth");

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

module.exports = async function oauthUrlHandler(req, res) {
  try {
    const reqUrl = new URL(req.url, `http://${req.headers.host || "127.0.0.1"}`);
    const provider = String(reqUrl.searchParams.get("provider") || "google").trim().toLowerCase();
    const redirectTo = String(reqUrl.searchParams.get("redirectTo") || "").trim();

    const url = buildOAuthAuthorizeUrl(provider, redirectTo);
    sendJson(res, 200, { url });
  } catch (error) {
    sendJson(res, 400, { error: error.message || "Unable to build OAuth URL" });
  }
};

const { readJsonBody, sendJson } = require("../_lib/common");
const { hasSupabaseAuthConfig, parseBearerToken, signoutToken } = require("../_lib/auth");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return sendJson(res, 405, { error: "Method not allowed" });
  if (!hasSupabaseAuthConfig()) return sendJson(res, 500, { error: "Supabase auth is not configured" });

  try {
    const tokenFromHeader = parseBearerToken(req);
    let token = tokenFromHeader;
    if (!token) {
      const body = await readJsonBody(req);
      token = String(body.accessToken || "").trim();
    }
    if (token) await signoutToken(token);
    return sendJson(res, 200, { success: true });
  } catch {
    return sendJson(res, 200, { success: true });
  }
};

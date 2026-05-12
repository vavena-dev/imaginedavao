const { readJsonBody, sendJson } = require("../../lib/common");
const { hasSupabaseAuthConfig, resetPasswordWithAccessToken } = require("../../lib/auth");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return sendJson(res, 405, { error: "Method not allowed" });
  if (!hasSupabaseAuthConfig()) return sendJson(res, 500, { error: "Supabase auth is not configured" });

  try {
    const body = await readJsonBody(req);
    const accessToken = String(body.accessToken || "").trim();
    const password = String(body.password || "");

    if (!accessToken) return sendJson(res, 400, { error: "accessToken is required" });
    if (!password || password.length < 8) {
      return sendJson(res, 400, { error: "Password must be at least 8 characters." });
    }

    await resetPasswordWithAccessToken(accessToken, password);
    return sendJson(res, 200, { ok: true, message: "Password updated successfully." });
  } catch (error) {
    return sendJson(res, 400, { error: error.message || "Unable to reset password" });
  }
};

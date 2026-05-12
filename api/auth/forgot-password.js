const { readJsonBody, sendJson } = require("../../lib/common");
const { hasSupabaseAuthConfig, requestPasswordReset } = require("../../lib/auth");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return sendJson(res, 405, { error: "Method not allowed" });
  if (!hasSupabaseAuthConfig()) return sendJson(res, 500, { error: "Supabase auth is not configured" });

  try {
    const body = await readJsonBody(req);
    const email = String(body.email || "").trim().toLowerCase();
    const redirectTo = String(body.redirectTo || "").trim();
    if (!email) return sendJson(res, 400, { error: "email is required" });

    await requestPasswordReset(email, redirectTo);
    return sendJson(res, 200, {
      ok: true,
      message: "If this account exists, a password reset email has been sent."
    });
  } catch (error) {
    return sendJson(res, 400, { error: error.message || "Unable to request password reset" });
  }
};

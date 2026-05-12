const { readJsonBody, sendJson } = require("../_lib/common");
const { hasSupabaseAuthConfig, recoverUserEmails } = require("../_lib/auth");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return sendJson(res, 405, { error: "Method not allowed" });
  if (!hasSupabaseAuthConfig()) return sendJson(res, 500, { error: "Supabase auth is not configured" });

  try {
    const body = await readJsonBody(req);
    const fullName = String(body.fullName || "").trim();
    const phone = String(body.phone || "").trim();
    if (!fullName || !phone) {
      return sendJson(res, 400, { error: "fullName and phone are required" });
    }

    const emails = await recoverUserEmails({ fullName, phone });
    return sendJson(res, 200, {
      ok: true,
      emails,
      message: emails.length
        ? "Matching accounts found."
        : "No matching account was found with the details provided."
    });
  } catch (error) {
    return sendJson(res, 400, { error: error.message || "Unable to recover user account" });
  }
};

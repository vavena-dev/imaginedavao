const { sendJson } = require("../_lib/common");
const { hasSupabaseAuthConfig, resolveAuthContext } = require("../_lib/auth");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") return sendJson(res, 405, { error: "Method not allowed" });
  if (!hasSupabaseAuthConfig()) return sendJson(res, 500, { error: "Supabase auth is not configured" });

  try {
    const auth = await resolveAuthContext(req);
    if (!auth.authenticated || !auth.user) return sendJson(res, 401, { error: "Unauthorized" });

    return sendJson(res, 200, {
      user: {
        id: auth.user.id,
        email: auth.user.email || auth.profile?.email || "",
        role: auth.profile?.role || "user",
        fullName: auth.profile?.full_name || "",
        phone: auth.profile?.phone || "",
        avatarUrl: auth.profile?.avatar_url || ""
      }
    });
  } catch (error) {
    return sendJson(res, 401, { error: error.message || "Unauthorized" });
  }
};

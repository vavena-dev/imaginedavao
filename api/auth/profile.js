const { readJsonBody, sendJson } = require("../../lib/common");
const { hasSupabaseAuthConfig, resolveAuthContext, updateProfileById } = require("../../lib/auth");

module.exports = async function handler(req, res) {
  if (!hasSupabaseAuthConfig()) return sendJson(res, 500, { error: "Supabase auth is not configured" });

  const auth = await resolveAuthContext(req);
  if (!auth.authenticated || !auth.user) return sendJson(res, 401, { error: "Unauthorized" });

  if (req.method === "GET") {
    return sendJson(res, 200, {
      profile: {
        id: auth.user.id,
        email: auth.user.email || auth.profile?.email || "",
        role: auth.profile?.role || "user",
        fullName: auth.profile?.full_name || "",
        phone: auth.profile?.phone || "",
        avatarUrl: auth.profile?.avatar_url || ""
      }
    });
  }

  if (req.method === "PUT") {
    try {
      const body = await readJsonBody(req);
      const updated = await updateProfileById(auth.user.id, {
        email: body.email,
        full_name: body.fullName,
        phone: body.phone,
        avatar_url: body.avatarUrl
      });
      return sendJson(res, 200, {
        profile: {
          id: auth.user.id,
          email: updated?.email || auth.user.email || "",
          role: updated?.role || auth.profile?.role || "user",
          fullName: updated?.full_name || "",
          phone: updated?.phone || "",
          avatarUrl: updated?.avatar_url || ""
        }
      });
    } catch (error) {
      return sendJson(res, 400, { error: error.message || "Failed to update profile" });
    }
  }

  return sendJson(res, 405, { error: "Method not allowed" });
};

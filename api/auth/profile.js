const { readJsonBody, sendJson } = require("../../lib/common");
const { hasSupabaseAuthConfig, resolveAuthContext, updateProfileById } = require("../../lib/auth");
const { buildAccessSummary } = require("../../lib/access-control");

function profilePayload(auth, profile = auth.profile) {
  const role = profile?.role || "partner";
  return {
    id: auth.user.id,
    email: auth.user.email || profile?.email || "",
    role,
    fullName: profile?.full_name || "",
    phone: profile?.phone || "",
    avatarUrl: profile?.avatar_url || "",
    access: buildAccessSummary({ role })
  };
}

module.exports = async function handler(req, res) {
  if (!hasSupabaseAuthConfig()) return sendJson(res, 500, { error: "Supabase auth is not configured" });

  const auth = await resolveAuthContext(req);
  if (!auth.authenticated || !auth.user) return sendJson(res, 401, { error: "Unauthorized" });

  if (req.method === "GET") {
    return sendJson(res, 200, {
      profile: profilePayload(auth)
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
      const mergedProfile = {
        ...(auth.profile || {}),
        ...(updated || {}),
        role: updated?.role || auth.profile?.role || "partner"
      };
      return sendJson(res, 200, {
        profile: profilePayload(auth, mergedProfile)
      });
    } catch (error) {
      return sendJson(res, 400, { error: error.message || "Failed to update profile" });
    }
  }

  return sendJson(res, 405, { error: "Method not allowed" });
};

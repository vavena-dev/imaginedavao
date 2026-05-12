const { readJsonBody, sendJson } = require("../../lib/common");
const { ensureProfileForUser, loginWithPassword, hasSupabaseAuthConfig } = require("../../lib/auth");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return sendJson(res, 405, { error: "Method not allowed" });
  if (!hasSupabaseAuthConfig()) return sendJson(res, 500, { error: "Supabase auth is not configured" });

  try {
    const body = await readJsonBody(req);
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    if (!email || !password) return sendJson(res, 400, { error: "email and password are required" });

    const session = await loginWithPassword(email, password);
    const user = session?.user || null;
    if (!user) return sendJson(res, 401, { error: "Invalid credentials" });

    const profile = await ensureProfileForUser(user, "user");
    return sendJson(res, 200, {
      accessToken: session.access_token || "",
      refreshToken: session.refresh_token || "",
      user: {
        id: user.id,
        email: user.email || email,
        role: profile?.role || "user",
        fullName: profile?.full_name || "",
        phone: profile?.phone || "",
        avatarUrl: profile?.avatar_url || ""
      }
    });
  } catch (error) {
    return sendJson(res, 401, { error: error.message || "Login failed" });
  }
};

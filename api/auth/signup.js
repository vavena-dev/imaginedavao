const { readJsonBody, sendJson } = require("../../lib/common");
const { ensureProfileForUser, hasSupabaseAuthConfig, signupWithPassword } = require("../../lib/auth");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return sendJson(res, 405, { error: "Method not allowed" });
  if (!hasSupabaseAuthConfig()) return sendJson(res, 500, { error: "Supabase auth is not configured" });

  try {
    const body = await readJsonBody(req);
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    if (!email || !password) return sendJson(res, 400, { error: "email and password are required" });
    if (password.length < 8) return sendJson(res, 400, { error: "password must be at least 8 characters" });

    const result = await signupWithPassword(email, password);
    const user = result?.user || null;
    if (user) {
      await ensureProfileForUser(user, "user");
    }

    return sendJson(res, 200, {
      accessToken: result?.access_token || "",
      refreshToken: result?.refresh_token || "",
      needsEmailConfirmation: !result?.access_token,
      user: user
        ? {
            id: user.id,
            email: user.email || email,
            role: "user",
            fullName: "",
            phone: "",
            avatarUrl: ""
          }
        : null
    });
  } catch (error) {
    return sendJson(res, 400, { error: error.message || "Signup failed" });
  }
};

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const { buildAccessSummary, isAdminRole } = require("./access-control");

function hasSupabaseAuthConfig() {
  return Boolean(SUPABASE_URL && (SUPABASE_ANON_KEY || SUPABASE_SERVICE_ROLE_KEY));
}

function authApiKey() {
  return SUPABASE_ANON_KEY || SUPABASE_SERVICE_ROLE_KEY;
}

function serviceRoleKey() {
  return SUPABASE_SERVICE_ROLE_KEY;
}

function parseBearerToken(req) {
  const header = req.headers.authorization || "";
  const match = /^Bearer\s+(.+)$/i.exec(header);
  return match ? match[1].trim() : "";
}

async function supabaseAuthRequest(pathname, options = {}) {
  if (!hasSupabaseAuthConfig()) {
    throw new Error("Supabase auth environment variables are not configured");
  }

  const url = new URL(`/auth/v1/${pathname}`, SUPABASE_URL);
  const headers = {
    apikey: authApiKey(),
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  const response = await fetch(url, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const message =
      (data && (data.msg || data.error_description || data.error || data.message)) ||
      `Auth request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
}

async function loginWithPassword(email, password) {
  return supabaseAuthRequest("token?grant_type=password", {
    method: "POST",
    body: { email, password }
  });
}

async function signupWithPassword(email, password) {
  return supabaseAuthRequest("signup", {
    method: "POST",
    body: { email, password }
  });
}

function buildOAuthAuthorizeUrl(provider = "google", redirectTo = "") {
  if (!hasSupabaseAuthConfig()) {
    throw new Error("Supabase auth environment variables are not configured");
  }

  const safeProvider = String(provider || "").trim().toLowerCase();
  if (!["google"].includes(safeProvider)) {
    throw new Error("Unsupported OAuth provider");
  }

  const url = new URL("/auth/v1/authorize", SUPABASE_URL);
  url.searchParams.set("provider", safeProvider);

  const safeRedirectTo = String(redirectTo || "").trim();
  if (safeRedirectTo) {
    url.searchParams.set("redirect_to", safeRedirectTo);
  }

  return url.toString();
}

async function requestPasswordReset(email, redirectTo = "") {
  const safeEmail = String(email || "").trim().toLowerCase();
  if (!safeEmail) throw new Error("email is required");
  const redirect = String(redirectTo || "").trim();
  const path = redirect ? `recover?redirect_to=${encodeURIComponent(redirect)}` : "recover";
  return supabaseAuthRequest(path, {
    method: "POST",
    body: { email: safeEmail }
  });
}

async function resetPasswordWithAccessToken(accessToken, nextPassword) {
  const token = String(accessToken || "").trim();
  const password = String(nextPassword || "");
  if (!token) throw new Error("access token is required");
  if (!password) throw new Error("password is required");

  return supabaseAuthRequest("user", {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: { password }
  });
}

async function signoutToken(accessToken) {
  if (!accessToken) return null;
  return supabaseAuthRequest("logout", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` }
  });
}

async function getUserFromAccessToken(accessToken) {
  if (!accessToken) return null;
  return supabaseAuthRequest("user", {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` }
  });
}

async function restRequest(pathname, options = {}) {
  if (!(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY)) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
  }

  const url = new URL(`/rest/v1/${pathname}`, SUPABASE_URL);
  const query = options.query || {};
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    url.searchParams.append(key, String(value));
  });

  const headers = {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  const response = await fetch(url, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const message =
      (data && (data.message || data.error_description || data.error)) ||
      `Supabase REST request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
}

async function getProfileById(userId) {
  if (!userId) return null;
  const rows = await restRequest("profiles", {
    query: {
      select: "id,email,role,full_name,phone,avatar_url,updated_at,created_at",
      id: `eq.${userId}`,
      limit: 1
    }
  });
  return Array.isArray(rows) && rows[0] ? rows[0] : null;
}

async function ensureProfileForUser(user, role = "partner") {
  if (!user || !user.id) return null;
  const existing = await getProfileById(user.id);
  if (existing) {
    const rows = await restRequest("profiles", {
      method: "PATCH",
      query: { id: `eq.${user.id}` },
      headers: { Prefer: "return=representation" },
      body: { email: user.email || existing.email || "" }
    });
    return Array.isArray(rows) && rows[0] ? rows[0] : existing;
  }

  const created = {
    id: user.id,
    email: user.email || "",
    role
  };
  const rows = await restRequest("profiles", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: created
  });
  return Array.isArray(rows) && rows[0] ? rows[0] : created;
}

async function updateProfileById(userId, patch = {}) {
  if (!userId) throw new Error("userId is required");
  const body = {};
  if (patch.email !== undefined) body.email = String(patch.email || "").trim();
  if (patch.full_name !== undefined) body.full_name = String(patch.full_name || "").trim();
  if (patch.phone !== undefined) body.phone = String(patch.phone || "").trim();
  if (patch.avatar_url !== undefined) body.avatar_url = String(patch.avatar_url || "").trim();

  const rows = await restRequest("profiles", {
    method: "PATCH",
    query: { id: `eq.${userId}` },
    headers: { Prefer: "return=representation" },
    body
  });
  return Array.isArray(rows) && rows[0] ? rows[0] : null;
}

function maskEmail(email) {
  const value = String(email || "").trim().toLowerCase();
  const parts = value.split("@");
  if (parts.length !== 2) return "";
  const [name, domain] = parts;
  if (!name) return `***@${domain}`;
  const lead = name.slice(0, 2);
  return `${lead}${"*".repeat(Math.max(3, name.length - 2))}@${domain}`;
}

function normalizePhone(raw) {
  return String(raw || "").replace(/[^\d+]/g, "");
}

async function recoverUserEmails({ fullName = "", phone = "" } = {}) {
  const safeName = String(fullName || "").trim().toLowerCase();
  const safePhone = normalizePhone(phone);
  if (!safeName || !safePhone) {
    throw new Error("fullName and phone are required");
  }

  const rows = await restRequest("profiles", {
    query: {
      select: "email,full_name,phone",
      full_name: `ilike.%${safeName}%`,
      limit: 25
    }
  });

  return (Array.isArray(rows) ? rows : [])
    .filter((row) => normalizePhone(row.phone) === safePhone)
    .map((row) => maskEmail(row.email))
    .filter(Boolean);
}

async function resolveAuthContext(req) {
  const token = parseBearerToken(req);
  if (!token || !hasSupabaseAuthConfig()) {
    const access = buildAccessSummary(null);
    return {
      accessToken: token,
      authenticated: false,
      user: null,
      profile: null,
      isAdmin: false,
      access
    };
  }

  try {
    const user = await getUserFromAccessToken(token);
    const profile = await getProfileById(user.id);
    const access = buildAccessSummary(profile);
    return {
      accessToken: token,
      authenticated: true,
      user,
      profile,
      isAdmin: isAdminRole(profile),
      access
    };
  } catch {
    const access = buildAccessSummary(null);
    return {
      accessToken: token,
      authenticated: false,
      user: null,
      profile: null,
      isAdmin: false,
      access
    };
  }
}

module.exports = {
  buildOAuthAuthorizeUrl,
  ensureProfileForUser,
  getProfileById,
  getUserFromAccessToken,
  hasSupabaseAuthConfig,
  loginWithPassword,
  parseBearerToken,
  recoverUserEmails,
  requestPasswordReset,
  resetPasswordWithAccessToken,
  resolveAuthContext,
  serviceRoleKey,
  signoutToken,
  signupWithPassword,
  updateProfileById
};

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

function isSupabaseBackendEnabled() {
  return String(process.env.CMS_BACKEND || "").toLowerCase() === "supabase";
}

function hasSupabaseConfig() {
  return Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
}

function ensureSupabaseReady() {
  if (!isSupabaseBackendEnabled()) {
    throw new Error("CMS_BACKEND is not set to supabase");
  }
  if (!hasSupabaseConfig()) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
}

async function supabaseRestRequest(pathname, options = {}) {
  ensureSupabaseReady();

  const url = new URL(`/rest/v1/${pathname}`, SUPABASE_URL);
  const method = options.method || "GET";
  const query = options.query || {};

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    url.searchParams.append(key, String(value));
  });

  const headers = {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    "Content-Type": "application/json"
  };

  if (options.preferRepresentation) {
    headers.Prefer = "return=representation";
  }

  const response = await fetch(url, {
    method,
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
      `Supabase request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
}

module.exports = {
  hasSupabaseConfig,
  isSupabaseBackendEnabled,
  supabaseRestRequest
};

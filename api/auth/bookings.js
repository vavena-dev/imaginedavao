const fs = require("fs/promises");
const path = require("path");
const { sendJson } = require("../../lib/common");
const { hasSupabaseAuthConfig, resolveAuthContext } = require("../../lib/auth");

async function readJsonl(filePath) {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return raw
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        try {
          return JSON.parse(line);
        } catch {
          return null;
        }
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

function computeLevel(totalBookings) {
  const level = Math.max(1, Math.floor(totalBookings / 5) + 1);
  const inLevel = totalBookings % 5;
  const nextAt = level * 5;
  const progressPercent = Math.round((inLevel / 5) * 100);
  return { level, progressPercent, nextAt };
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") return sendJson(res, 405, { error: "Method not allowed" });
  if (!hasSupabaseAuthConfig()) return sendJson(res, 500, { error: "Supabase auth is not configured" });

  const auth = await resolveAuthContext(req);
  if (!auth.authenticated || !auth.user) return sendJson(res, 401, { error: "Unauthorized" });

  const localDataPath = path.join(process.cwd(), "data", "booking_clicks.jsonl");
  const tmpPath = path.join("/tmp", "booking_clicks.jsonl");
  const [localRows, tmpRows] = await Promise.all([readJsonl(localDataPath), readJsonl(tmpPath)]);
  const allRows = [...localRows, ...tmpRows];

  const userEmail = String(auth.user.email || "").toLowerCase();
  const filtered = allRows.filter((row) => {
    const payload = row.payload || {};
    const payloadEmail = String(payload.userEmail || "").toLowerCase();
    const payloadUserId = String(payload.userId || "");
    return payloadUserId === auth.user.id || (userEmail && payloadEmail === userEmail);
  });

  const bookings = filtered
    .sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime())
    .map((row) => ({
      trackId: row.trackId,
      timestamp: row.timestamp,
      category: row.category || "unknown",
      city: row.city || "unknown",
      title: row.payload?.selectedTitle || row.title || "Booking selection",
      price: row.payload?.price ?? null,
      trackedUrl: row.trackedUrl || ""
    }));

  const totalBookings = bookings.length;
  const levelState = computeLevel(totalBookings);

  return sendJson(res, 200, {
    user: {
      id: auth.user.id,
      email: auth.user.email || "",
      role: auth.profile?.role || "user"
    },
    stats: {
      totalBookings,
      level: levelState.level,
      progressPercent: levelState.progressPercent,
      nextLevelAtBookings: levelState.nextAt
    },
    bookings
  });
};

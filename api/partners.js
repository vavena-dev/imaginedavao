const { sendJson } = require("../lib/common");
const { resolveAuthContext } = require("../lib/auth");
const { listPartnerPrograms } = require("../lib/partner-store");

const REVENUE_MODEL = {
  summary:
    "Partner pages usually turn tourism attention into paid placements, sponsored campaigns, affiliate bookings, and qualified leads.",
  streams: [
    {
      key: "monthly",
      label: "Paid visibility",
      description: "Recurring listing fees for partners that want steady placement on high-intent city pages."
    },
    {
      key: "campaign",
      label: "Seasonal campaigns",
      description: "Fixed-fee promotions for events, long weekends, openings, and limited-time offers."
    },
    {
      key: "commission",
      label: "Affiliate booking",
      description: "Tracked booking links that pay a percentage when travellers complete partner checkout."
    },
    {
      key: "lead_fee",
      label: "Qualified leads",
      description: "Per-lead pricing when travellers request quotes, contact, or custom itinerary help."
    }
  ]
};

async function hasAdminAccess(req) {
  const required = process.env.ADMIN_TOKEN;
  const given = req.headers["x-admin-token"] || req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (required && Boolean(given) && given === required) return true;

  const auth = await resolveAuthContext(req);
  return Boolean(auth.isAdmin);
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") return sendJson(res, 405, { error: "Method not allowed" });

  try {
    const url = new URL(req.url, "http://localhost");
    const includeDrafts = url.searchParams.get("includeDrafts") === "true";
    let canIncludeDrafts = false;

    if (includeDrafts) {
      canIncludeDrafts = await hasAdminAccess(req);
      if (!canIncludeDrafts) return sendJson(res, 401, { error: "Unauthorized" });
    }

    const programs = await listPartnerPrograms(
      {
        city: url.searchParams.get("city") || "davao",
        category: url.searchParams.get("category") || ""
      },
      { includeDrafts: canIncludeDrafts }
    );

    return sendJson(res, 200, {
      programs,
      revenueModel: REVENUE_MODEL
    });
  } catch (error) {
    return sendJson(res, 500, { error: error.message || "Failed to load partner programs" });
  }
};

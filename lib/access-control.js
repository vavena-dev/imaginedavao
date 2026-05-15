const ADMIN_ROLE = "admin";
const ANONYMOUS_ROLE = "anonymous";

const ACCESS_RULES = {
  "nav:admin_cms": {
    label: "ADMIN CMS",
    resourceType: "navigation",
    resourceKey: "nav:admin_cms",
    allowedRoles: [ADMIN_ROLE]
  },
  "page:admin": {
    label: "ADMIN CMS",
    resourceType: "page",
    resourceKey: "page:admin",
    allowedRoles: [ADMIN_ROLE]
  },
  "cms:all": {
    label: "All CMS pages",
    resourceType: "cms",
    resourceKey: "cms:all",
    allowedRoles: [ADMIN_ROLE]
  }
};

function normalizeRole(role) {
  return String(role || ANONYMOUS_ROLE).trim().toLowerCase() || ANONYMOUS_ROLE;
}

function roleFromUser(userOrProfile = {}) {
  return normalizeRole((userOrProfile || {}).role);
}

function isAdminRole(userOrProfile = {}) {
  return roleFromUser(userOrProfile) === ADMIN_ROLE;
}

function canAccessResource(userOrProfile = {}, resourceKey = "") {
  if (isAdminRole(userOrProfile)) return true;
  const rule = ACCESS_RULES[String(resourceKey || "").trim()];
  if (!rule) return false;
  return rule.allowedRoles.includes(roleFromUser(userOrProfile));
}

function buildAccessSummary(userOrProfile = {}) {
  const role = roleFromUser(userOrProfile);
  return {
    role,
    canAdminCms: canAccessResource({ role }, "page:admin"),
    resources: Object.fromEntries(
      Object.keys(ACCESS_RULES).map((resourceKey) => [
        resourceKey,
        canAccessResource({ role }, resourceKey)
      ])
    )
  };
}

module.exports = {
  ACCESS_RULES,
  ADMIN_ROLE,
  buildAccessSummary,
  canAccessResource,
  isAdminRole,
  normalizeRole
};

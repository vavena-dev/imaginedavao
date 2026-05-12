async function postTrackedBooking(payload) {
  try {
    const response = await fetch("/api/book-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error("Failed to create tracked booking URL");
    }

    return await response.json();
  } catch {
    return { trackedUrl: payload.url, trackId: null };
  }
}

function initGlobalImageFallback() {
  const fallbackSrc = "assets/fallback-travel.svg";

  function applyFallback(img) {
    if (!img || img.dataset.fallbackApplied === "1") return;
    img.dataset.fallbackApplied = "1";
    img.src = fallbackSrc;
  }

  document.querySelectorAll("img").forEach((img) => {
    const src = (img.getAttribute("src") || "").trim();
    if (!src) applyFallback(img);
  });

  document.addEventListener(
    "error",
    (event) => {
      const target = event.target;
      if (target && target.tagName === "IMG") {
        applyFallback(target);
      }
    },
    true
  );
}

const WHITE_LABEL_KEY = "imaginephilippines_white_label";
const WHITE_LABEL_DEFAULTS = {
  brandKicker: "ImaginePhilippines",
  brandCity: "ImagineDavao",
  primaryColor: "#0f6b57",
  secondaryColor: "#e56e1f",
  defaultCity: "davao"
};

function loadWhiteLabel() {
  try {
    const parsed = JSON.parse(localStorage.getItem(WHITE_LABEL_KEY) || "{}");
    return { ...WHITE_LABEL_DEFAULTS, ...parsed };
  } catch {
    return { ...WHITE_LABEL_DEFAULTS };
  }
}

function saveWhiteLabel(config) {
  localStorage.setItem(WHITE_LABEL_KEY, JSON.stringify(config));
}

function ensureWhiteLabelStyles() {
  if (document.getElementById("wl-admin-style")) return;
  const style = document.createElement("style");
  style.id = "wl-admin-style";
  style.textContent = `
    .wl-admin-launch {
      position: fixed;
      left: 1rem;
      bottom: 1rem;
      z-index: 40;
      border: 1px solid rgba(0,0,0,0.18);
      border-radius: 999px;
      background: #fff;
      color: #1f1b16;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 0.65rem;
      padding: 0.48rem 0.75rem;
      cursor: pointer;
    }
    .wl-admin-panel {
      position: fixed;
      left: 1rem;
      bottom: 3.2rem;
      z-index: 41;
      width: min(320px, 88vw);
      background: #fff;
      border: 1px solid rgba(0,0,0,0.18);
      border-radius: 14px;
      padding: 0.8rem;
      box-shadow: 0 18px 36px rgba(0, 0, 0, 0.12);
      display: none;
      gap: 0.55rem;
    }
    .wl-admin-panel.open { display: grid; }
    .wl-admin-panel h5 {
      margin: 0;
      font-size: 0.95rem;
      font-family: "Fraunces", serif;
    }
    .wl-admin-panel p {
      margin: 0;
      font-size: 0.78rem;
      color: #665e55;
    }
    .wl-admin-row {
      display: grid;
      gap: 0.24rem;
    }
    .wl-admin-row label {
      font-size: 0.68rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #665e55;
    }
    .wl-admin-row input,
    .wl-admin-row select {
      border: 1px solid rgba(0,0,0,0.2);
      border-radius: 8px;
      padding: 0.48rem 0.55rem;
      font-size: 0.84rem;
      font-family: inherit;
      background: #fff;
    }
    .wl-admin-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.42rem;
      margin-top: 0.2rem;
    }
    .wl-admin-actions button {
      border: 1px solid rgba(0,0,0,0.18);
      border-radius: 999px;
      background: #fff;
      color: #1f1b16;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 0.63rem;
      padding: 0.42rem 0.68rem;
      cursor: pointer;
    }
    .wl-admin-actions .wl-save {
      background: #0f6b57;
      color: #fff;
      border-color: #0f6b57;
    }
  `;
  document.head.appendChild(style);
}

function applyWhiteLabel(config) {
  document.documentElement.style.setProperty("--primary", config.primaryColor);
  document.documentElement.style.setProperty("--secondary", config.secondaryColor);

  document.querySelectorAll(".brand-kicker, .kicker").forEach((el) => {
    el.textContent = config.brandKicker;
  });

  document.querySelectorAll(".brand-city, .city").forEach((el) => {
    const text = (el.textContent || "").trim().toLowerCase();
    const genericCity = ["things to do", "events", "eat & drink", "where to stay", "maps & guides", "districts", "deals & passes", "partnerships"];
    if (genericCity.includes(text)) return;
    if (el.id === "brandCity" || el.classList.contains("brand-city")) {
      el.textContent = config.brandCity;
    } else if (!el.closest(".topbar")) {
      el.textContent = config.brandCity;
    }
  });
}

function initWhiteLabelAdmin({ onCityChange, cityResolver } = {}) {
  ensureWhiteLabelStyles();
  const config = loadWhiteLabel();
  applyWhiteLabel(config);

  const launch = document.createElement("button");
  launch.type = "button";
  launch.className = "wl-admin-launch";
  launch.id = "wlAdminLaunch";
  launch.textContent = "Brand Admin";

  const panel = document.createElement("section");
  panel.className = "wl-admin-panel";
  panel.id = "wlAdminPanel";
  panel.innerHTML = `
    <h5>White-Label Controls</h5>
    <p>Update brand visuals and default city instantly.</p>
    <div class="wl-admin-row">
      <label for="wlBrandKicker">Brand Kicker</label>
      <input id="wlBrandKicker" type="text" value="${config.brandKicker}" />
    </div>
    <div class="wl-admin-row">
      <label for="wlBrandCity">Brand City</label>
      <input id="wlBrandCity" type="text" value="${config.brandCity}" />
    </div>
    <div class="wl-admin-row">
      <label for="wlPrimaryColor">Primary Color</label>
      <input id="wlPrimaryColor" type="color" value="${config.primaryColor}" />
    </div>
    <div class="wl-admin-row">
      <label for="wlSecondaryColor">Secondary Color</label>
      <input id="wlSecondaryColor" type="color" value="${config.secondaryColor}" />
    </div>
    <div class="wl-admin-row">
      <label for="wlDefaultCity">Default City</label>
      <select id="wlDefaultCity">
        <option value="davao">Davao</option>
        <option value="cebu">Cebu</option>
        <option value="iloilo">Iloilo</option>
      </select>
    </div>
    <div class="wl-admin-actions">
      <button type="button" class="wl-save" id="wlSave">Save</button>
      <button type="button" id="wlReset">Reset</button>
      <button type="button" id="wlClose">Close</button>
    </div>
  `;
  document.body.append(panel, launch);

  panel.querySelector("#wlDefaultCity").value = config.defaultCity;

  const getFormConfig = () => ({
    brandKicker: panel.querySelector("#wlBrandKicker").value.trim() || WHITE_LABEL_DEFAULTS.brandKicker,
    brandCity: panel.querySelector("#wlBrandCity").value.trim() || WHITE_LABEL_DEFAULTS.brandCity,
    primaryColor: panel.querySelector("#wlPrimaryColor").value || WHITE_LABEL_DEFAULTS.primaryColor,
    secondaryColor: panel.querySelector("#wlSecondaryColor").value || WHITE_LABEL_DEFAULTS.secondaryColor,
    defaultCity: panel.querySelector("#wlDefaultCity").value || WHITE_LABEL_DEFAULTS.defaultCity
  });

  launch.addEventListener("click", () => {
    panel.classList.toggle("open");
  });

  panel.querySelector("#wlClose").addEventListener("click", () => {
    panel.classList.remove("open");
  });

  panel.querySelector("#wlSave").addEventListener("click", () => {
    const next = getFormConfig();
    saveWhiteLabel(next);
    applyWhiteLabel(next);
    if (onCityChange) onCityChange(next.defaultCity);
    panel.classList.remove("open");
  });

  panel.querySelector("#wlReset").addEventListener("click", () => {
    saveWhiteLabel(WHITE_LABEL_DEFAULTS);
    panel.querySelector("#wlBrandKicker").value = WHITE_LABEL_DEFAULTS.brandKicker;
    panel.querySelector("#wlBrandCity").value = WHITE_LABEL_DEFAULTS.brandCity;
    panel.querySelector("#wlPrimaryColor").value = WHITE_LABEL_DEFAULTS.primaryColor;
    panel.querySelector("#wlSecondaryColor").value = WHITE_LABEL_DEFAULTS.secondaryColor;
    panel.querySelector("#wlDefaultCity").value = WHITE_LABEL_DEFAULTS.defaultCity;
    applyWhiteLabel(WHITE_LABEL_DEFAULTS);
    if (onCityChange) onCityChange(WHITE_LABEL_DEFAULTS.defaultCity);
  });

  const desiredCity = config.defaultCity || (cityResolver ? cityResolver() : "davao");
  if (onCityChange && desiredCity) onCityChange(desiredCity);
}

async function streamAssistantChat({ message, city, history = [], onToken, onActions, onDone, onError }) {
  try {
    const response = await fetch("/api/chat/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, city, history })
    });

    if (!response.ok || !response.body) {
      throw new Error("Failed to stream chat");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const chunks = buffer.split("\n\n");
      buffer = chunks.pop() || "";

      chunks.forEach((chunk) => {
        const line = chunk
          .split("\n")
          .find((item) => item.startsWith("data: "));

        if (!line) return;

        try {
          const payload = JSON.parse(line.replace(/^data:\s*/, ""));
          if (payload.type === "token" && onToken) onToken(payload.text || "");
          if (payload.type === "actions" && onActions) onActions(payload.actions || []);
          if (payload.type === "done" && onDone) onDone();
        } catch {
          // ignore malformed chunk
        }
      });
    }
  } catch (error) {
    if (onError) onError(error);
  }
}

function buildActionButtons(actions, city, bookingPath) {
  const wrap = document.createElement("div");
  wrap.className = "chat-actions";

  actions.forEach((action) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "chat-action-btn";
    button.textContent = action.label || "Book";
    button.dataset.tab = action.tab || "hotels";
    button.addEventListener("click", () => {
      const target = `${bookingPath}?city=${encodeURIComponent(city || "Davao")}#${button.dataset.tab}`;
      window.location.href = target;
    });
    wrap.appendChild(button);
  });

  return wrap;
}

function attachChatWidget({ cityResolver, bookingPath = "booking.html" } = {}) {
  const chatWidget = document.getElementById("chatWidget");
  const chatFab = document.getElementById("chatFab");
  const closeChat = document.getElementById("closeChat");
  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");
  const chatBody = document.querySelector(".chat-body");
  const chatPanel = document.getElementById("chatPanel");

  if (!chatWidget || !chatFab || !closeChat || !chatForm || !chatInput || !chatBody) {
    return;
  }

  const history = [];

  chatFab.addEventListener("click", () => {
    chatWidget.classList.add("open");
    if (chatPanel) chatPanel.setAttribute("aria-hidden", "false");
    chatInput.focus();
  });

  closeChat.addEventListener("click", () => {
    chatWidget.classList.remove("open");
    if (chatPanel) chatPanel.setAttribute("aria-hidden", "true");
  });

  chatForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;

    const userMsg = document.createElement("article");
    userMsg.className = "chat-msg user";
    userMsg.textContent = text;
    chatBody.appendChild(userMsg);

    const aiMsg = document.createElement("article");
    aiMsg.className = "chat-msg ai";
    aiMsg.textContent = "";
    chatBody.appendChild(aiMsg);

    const status = document.createElement("p");
    status.className = "chat-status";
    status.textContent = "Thinking...";
    chatBody.appendChild(status);

    chatInput.value = "";
    chatBody.scrollTop = chatBody.scrollHeight;

    const city = cityResolver ? cityResolver() : "Davao";

    history.push({ role: "user", content: text });

    await streamAssistantChat({
      message: text,
      city,
      history,
      onToken: (token) => {
        status.remove();
        aiMsg.textContent += token;
        chatBody.scrollTop = chatBody.scrollHeight;
      },
      onActions: (actions) => {
        if (actions.length) {
          chatBody.appendChild(buildActionButtons(actions, city, bookingPath));
          chatBody.scrollTop = chatBody.scrollHeight;
        }
      },
      onDone: () => {
        history.push({ role: "assistant", content: aiMsg.textContent });
      },
      onError: () => {
        status.remove();
        aiMsg.textContent = "Live chat is temporarily offline. Please restart the service to resume streaming responses.";
      }
    });
  });
}

const AUTH_STORAGE_KEY = "imagineph_auth_session";

function readAuthSession() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeAuthSession(session) {
  if (!session) {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

function getAuthToken() {
  const session = readAuthSession();
  return session?.accessToken || "";
}

async function authRequest(pathname, payload = {}, method = "POST", token = "") {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(pathname, {
    method,
    headers,
    body: method === "GET" ? undefined : JSON.stringify(payload || {})
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Authentication request failed");
  }
  return data;
}

async function loginUser(email, password) {
  const data = await authRequest("/api/auth/login", { email, password }, "POST");
  writeAuthSession({
    accessToken: data.accessToken || "",
    refreshToken: data.refreshToken || "",
    user: data.user || null
  });
  return data.user || null;
}

async function signupUser(email, password) {
  const data = await authRequest("/api/auth/signup", { email, password }, "POST");
  if (data.accessToken) {
    writeAuthSession({
      accessToken: data.accessToken || "",
      refreshToken: data.refreshToken || "",
      user: data.user || null
    });
  }
  return data;
}

async function requestPasswordReset(email, redirectTo) {
  const data = await authRequest("/api/auth/forgot-password", {
    email: String(email || "").trim().toLowerCase(),
    redirectTo: String(redirectTo || "").trim()
  }, "POST");
  return data?.message || "Password reset request sent.";
}

async function recoverUserAccount(fullName, phone) {
  const data = await authRequest("/api/auth/forgot-user", {
    fullName: String(fullName || "").trim(),
    phone: String(phone || "").trim()
  }, "POST");
  return {
    message: data?.message || "",
    emails: Array.isArray(data?.emails) ? data.emails : []
  };
}

async function resetPassword(accessToken, password) {
  const data = await authRequest("/api/auth/reset-password", {
    accessToken: String(accessToken || "").trim(),
    password: String(password || "")
  }, "POST");
  return data?.message || "Password updated.";
}

async function fetchCurrentUser() {
  const token = getAuthToken();
  if (!token) return null;
  try {
    const data = await authRequest("/api/auth/profile", {}, "GET", token);
    const session = readAuthSession() || {};
    writeAuthSession({ ...session, user: data.profile || null });
    return data.profile || null;
  } catch {
    writeAuthSession(null);
    return null;
  }
}

async function fetchUserProfile() {
  const token = getAuthToken();
  if (!token) return null;
  const data = await authRequest("/api/auth/profile", {}, "GET", token);
  return data.profile || null;
}

async function updateUserProfile(profilePatch) {
  const token = getAuthToken();
  if (!token) throw new Error("Not authenticated");
  const data = await authRequest("/api/auth/profile", profilePatch || {}, "PUT", token);
  const session = readAuthSession() || {};
  writeAuthSession({ ...session, user: data.profile || session.user || null });
  return data.profile || null;
}

async function logoutUser() {
  const token = getAuthToken();
  try {
    await authRequest("/api/auth/logout", { accessToken: token }, "POST", token);
  } finally {
    writeAuthSession(null);
  }
}

function ensureAuthStyles() {
  if (document.getElementById("auth-widget-style")) return;
  const style = document.createElement("style");
  style.id = "auth-widget-style";
  style.textContent = `
    .auth-widget {
      position: relative;
      display: inline-flex;
      align-items: center;
    }
    .auth-widget.auth-widget--inline {
      margin-left: auto;
    }
    .auth-chip {
      border: 1px solid rgba(0,0,0,0.18);
      background: #fff;
      color: #1f1b16;
      border-radius: 999px;
      padding: 0.34rem 0.62rem;
      font-size: 0.72rem;
      cursor: pointer;
      box-shadow: none;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      min-height: 42px;
    }
    .auth-avatar {
      width: 28px;
      height: 28px;
      border-radius: 999px;
      background: #0f6b57;
      color: #fff;
      font-weight: 700;
      font-size: 0.82rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      text-transform: uppercase;
      flex: 0 0 28px;
    }
    .auth-label {
      display: grid;
      gap: 0.02rem;
      text-align: left;
      line-height: 1.1;
    }
    .auth-name {
      font-size: 0.8rem;
      font-weight: 700;
      max-width: 150px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .auth-level {
      font-size: 0.67rem;
      color: #665e55;
    }
    .auth-menu {
      position: absolute;
      right: 0;
      top: calc(100% + 0.45rem);
      width: 220px;
      background: #fff;
      border: 1px solid rgba(0,0,0,0.15);
      border-radius: 12px;
      box-shadow: 0 16px 34px rgba(0,0,0,0.16);
      padding: 0.35rem;
      display: none;
      z-index: 220;
    }
    .auth-widget.open .auth-menu { display: grid; }
    .auth-menu-item {
      display: inline-flex;
      align-items: center;
      justify-content: flex-start;
      gap: 0.45rem;
      border: none;
      background: #fff;
      color: #1f1b16;
      border-radius: 9px;
      padding: 0.6rem 0.72rem;
      font-size: 0.82rem;
      cursor: pointer;
      text-decoration: none;
      width: 100%;
    }
    .auth-menu-item:hover {
      background: rgba(15, 107, 87, 0.1);
    }
    .auth-menu-icon {
      width: 18px;
      text-align: center;
      color: #665e55;
    }
    .auth-widget--inline.auth-widget-mobile {
      display: flex;
      width: 100%;
      justify-content: flex-end;
    }
    @media (max-width: 980px) {
      .auth-name {
        max-width: 110px;
      }
      .auth-menu {
        position: fixed;
        top: 4.2rem;
        right: 0.8rem;
        width: min(240px, calc(100vw - 1.6rem));
        z-index: 200;
      }
    }
  `;
  document.head.appendChild(style);
}

function emitAuthEvent() {
  const event = new CustomEvent("imagineph:auth-updated", { detail: { user: readAuthSession()?.user || null } });
  window.dispatchEvent(event);
}

function initAuthWidget() {
  const pathName = (window.location.pathname || "").toLowerCase();
  if (pathName.endsWith("/account.html") || pathName.endsWith("/my-bookings.html") || pathName.endsWith("/signin.html")) return;
  if (document.getElementById("authWidget")) return;
  ensureAuthStyles();

  const widget = document.createElement("section");
  widget.className = "auth-widget";
  widget.id = "authWidget";
  widget.innerHTML = `
    <button class="auth-chip" id="authChip" type="button">
      <span class="auth-avatar" id="authAvatar">A</span>
      <span class="auth-label">
        <span class="auth-name" id="authName">Account</span>
        <span class="auth-level" id="authLevel">Sign in</span>
      </span>
    </button>
    <div class="auth-menu" id="authMenu"></div>
  `;
  const utilityMeta = document.querySelector(".utility-meta");
  const topbarNav = document.querySelector(".topbar nav");
  const topbar = document.querySelector(".topbar");
  const utilityContainer = utilityMeta || topbarNav || topbar;
  if (utilityContainer) {
    widget.classList.add("auth-widget--inline");
    utilityContainer.appendChild(widget);
  } else {
    document.body.appendChild(widget);
  }

  const chip = widget.querySelector("#authChip");
  const avatar = widget.querySelector("#authAvatar");
  const nameLabel = widget.querySelector("#authName");
  const levelLabel = widget.querySelector("#authLevel");
  const menu = widget.querySelector("#authMenu");

  const getDisplayName = (user) => {
    if (user?.fullName && String(user.fullName).trim()) {
      return String(user.fullName).trim().split(/\s+/)[0];
    }
    if (user?.email) return String(user.email).split("@")[0];
    return "Account";
  };

  const getInitial = (name) => {
    const value = String(name || "A").trim();
    return value ? value.charAt(0).toUpperCase() : "A";
  };

  const buildMenu = (loggedIn) => {
    if (!loggedIn) {
      menu.innerHTML = `
        <a class="auth-menu-item" href="signin.html"><span class="auth-menu-icon">→</span> Sign in or create account</a>
      `;
      return;
    }
    menu.innerHTML = `
      <a class="auth-menu-item" href="account.html"><span class="auth-menu-icon">A</span> My account</a>
      <a class="auth-menu-item" href="my-bookings.html"><span class="auth-menu-icon">B</span> Bookings</a>
      <button class="auth-menu-item" id="authSignOutBtn" type="button"><span class="auth-menu-icon">S</span> Sign out</button>
    `;

    const signOutBtn = menu.querySelector("#authSignOutBtn");
    signOutBtn.addEventListener("click", async () => {
      await logoutUser();
      widget.classList.remove("open");
      setChipState();
      emitAuthEvent();
      window.location.href = window.location.pathname + window.location.search;
    });
  };

  const loadLevel = async () => {
    const token = getAuthToken();
    if (!token) return null;
    try {
      const response = await fetch("/api/auth/bookings", { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) return null;
      const data = await response.json();
      return data?.stats?.level || null;
    } catch {
      return null;
    }
  };

  const setChipState = () => {
    const session = readAuthSession();
    const user = session?.user || null;
    const loggedIn = Boolean(user);
    const displayName = loggedIn ? getDisplayName(user) : "Account";
    avatar.textContent = getInitial(displayName);
    nameLabel.textContent = loggedIn ? displayName : "Account";
    levelLabel.textContent = loggedIn ? "Signed in" : "Sign in";
    chip.title = loggedIn ? user.email || "Signed in" : "Sign in or create account";
    buildMenu(loggedIn);
  };

  chip.addEventListener("click", () => {
    const session = readAuthSession();
    if (!session?.user) {
      const returnTo = encodeURIComponent(window.location.pathname + window.location.search + window.location.hash);
      window.location.href = `signin.html?returnTo=${returnTo}`;
      return;
    }
    widget.classList.toggle("open");
  });

  document.addEventListener("click", (event) => {
    if (!widget.classList.contains("open")) return;
    if (!widget.contains(event.target)) widget.classList.remove("open");
  });

  fetchCurrentUser()
    .then(() => fetchUserProfile().catch(() => null))
    .then((profile) => {
      if (profile) {
        const session = readAuthSession() || {};
        writeAuthSession({ ...session, user: { ...(session.user || {}), ...profile } });
      }
    })
    .then(async () => {
      setChipState();
      const session = readAuthSession();
      if (session?.user) {
        const level = await loadLevel();
        levelLabel.textContent = level ? `Level ${level}` : "Signed in";
      }
    })
    .finally(() => {
      emitAuthEvent();
    });
}

window.BookingApi = {
  fetchCurrentUser,
  fetchUserProfile,
  getAuthToken,
  loginUser,
  logoutUser,
  postTrackedBooking,
  readAuthSession,
  recoverUserAccount,
  requestPasswordReset,
  resetPassword,
  signupUser,
  updateUserProfile,
  streamAssistantChat,
  attachChatWidget,
  initWhiteLabelAdmin
};

initGlobalImageFallback();
if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAuthWidget);
  } else {
    initAuthWidget();
  }
}

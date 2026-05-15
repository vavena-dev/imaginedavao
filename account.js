const profilePanel = document.getElementById("profilePanel");
const accountHeading = document.getElementById("accountHeading");
const accountMessage = document.getElementById("accountMessage");
const avatarBadge = document.getElementById("avatarBadge");
const fullName = document.getElementById("fullName");
const phone = document.getElementById("phone");
const avatarUrl = document.getElementById("avatarUrl");
const saveProfileBtn = document.getElementById("saveProfileBtn");
const signOutBtn = document.getElementById("signOutBtn");
const profileStatus = document.getElementById("profileStatus");
const accountLangSelect = document.getElementById("accountLangSelect");
const accountPartnerPrograms = document.getElementById("accountPartnerPrograms");

function setStatus(text, isError = false) {
  profileStatus.textContent = text || "";
  profileStatus.classList.toggle("error", Boolean(isError));
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatPartnerMoney(amount, currency = "PHP") {
  const value = Number(amount || 0);
  if (!value) return "";
  try {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency,
      maximumFractionDigits: 0
    }).format(value);
  } catch {
    return `${currency} ${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  }
}

function partnerRevenueBasis(program) {
  if (program.billingModel === "commission" && Number(program.commissionRate)) {
    return `${Number(program.commissionRate).toFixed(0)}% commission`;
  }
  if (program.billingModel === "lead_fee" && Number(program.leadFeeAmount)) {
    return `${formatPartnerMoney(program.leadFeeAmount, program.priceCurrency)} per lead`;
  }
  const price = formatPartnerMoney(program.priceAmount, program.priceCurrency);
  if (!price) return "Partner program";
  return program.billingModel === "monthly" ? `${price} monthly` : `${price} per campaign`;
}

function badgeFromName(user) {
  const source = user?.fullName || user?.email || "I";
  return source.trim().charAt(0).toUpperCase() || "I";
}

function fillProfile(user) {
  fullName.value = user?.fullName || "";
  phone.value = user?.phone || "";
  avatarUrl.value = user?.avatarUrl || "";
  avatarBadge.textContent = badgeFromName(user);
}

function isSignedIn() {
  const session = window.BookingApi.readAuthSession();
  return Boolean(session?.user);
}

function redirectToSignIn() {
  const returnTo = encodeURIComponent(
    `${window.location.pathname}${window.location.search}${window.location.hash}`
  );
  window.location.href = `signin?returnTo=${returnTo}`;
}

function openSelectDropdown(selectEl) {
  if (!selectEl) return;
  if (typeof selectEl.showPicker === "function") {
    selectEl.showPicker();
    return;
  }
  selectEl.focus();
  selectEl.click();
  selectEl.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
}

function makePickerFullyClickable(wrapperSelector, selectEl) {
  const wrapper = document.querySelector(wrapperSelector);
  if (!wrapper || !selectEl) return;
  wrapper.addEventListener("click", (event) => {
    if (event.target === selectEl) return;
    event.preventDefault();
    openSelectDropdown(selectEl);
  });
  wrapper.addEventListener("keydown", (event) => {
    if (event.key === " " || event.key === "Enter" || event.key === "ArrowDown") {
      event.preventDefault();
      openSelectDropdown(selectEl);
    }
  });
}

function initAccountLanguage() {
  if (!accountLangSelect) return;
  const stored = localStorage.getItem("imagineph_lang");
  const initial = stored === "fil" ? "fil" : "en";
  accountLangSelect.value = initial;
  document.documentElement.lang = initial;
  makePickerFullyClickable(".lang-select", accountLangSelect);
  accountLangSelect.addEventListener("change", () => {
    const next = accountLangSelect.value === "fil" ? "fil" : "en";
    localStorage.setItem("imagineph_lang", next);
    document.documentElement.lang = next;
  });
}

function initAccountCurrencyPicker() {
  if (!window.ImagineCurrency || typeof window.ImagineCurrency.init !== "function") return;
  window.ImagineCurrency.init({
    triggerId: "accountCurrencyTrigger",
    modalId: "accountCurrencyModal",
    backdropId: "accountCurrencyBackdrop",
    closeId: "accountCurrencyClose",
    pinnedContainerId: "accountPinnedCurrencies",
    allContainerId: "accountAllCurrencies"
  });
}

function renderSignedOut() {
  redirectToSignIn();
}

function renderSignedIn(user) {
  profilePanel.hidden = false;
  const displayName = user.fullName?.trim() || user.email?.split("@")[0] || "partner";
  accountHeading.textContent = `Hi, ${displayName}`;
  accountMessage.textContent = `Signed in as ${user.email || "your account"}. Manage your listing and partnership details below.`;
  fillProfile(user);
}

async function refreshState() {
  const user = await window.BookingApi.fetchCurrentUser();
  if (!user) {
    renderSignedOut();
    return;
  }

  const profile = await window.BookingApi.fetchUserProfile().catch(() => null);
  const session = window.BookingApi.readAuthSession() || {};
  const merged = { ...(session.user || {}), ...(profile || {}) };
  localStorage.setItem("imagineph_auth_session", JSON.stringify({ ...session, user: merged }));
  renderSignedIn(merged);
}

async function loadPartnerPrograms() {
  if (!accountPartnerPrograms) return;
  try {
    const response = await fetch("/api/partners?city=davao");
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Unable to load partner programs");
    const programs = data.programs || [];
    if (!programs.length) {
      accountPartnerPrograms.innerHTML = '<p class="muted">Partner programs are currently being reviewed by the ImagineDavao team.</p>';
      return;
    }

    accountPartnerPrograms.innerHTML = programs
      .slice(0, 4)
      .map(
        (program) => `
          <article class="account-program-row">
            <div class="account-program-meta">
              <span class="account-program-pill">${escapeHtml(program.category || "program")}</span>
              <span class="account-program-pill">${escapeHtml(partnerRevenueBasis(program))}</span>
            </div>
            <h3>${escapeHtml(program.title)}</h3>
            <p>${escapeHtml(program.summary)}</p>
          </article>
        `
      )
      .join("");
  } catch (error) {
    accountPartnerPrograms.innerHTML = `<p class="muted">${escapeHtml(error.message || "Unable to load partner programs.")}</p>`;
  }
}

saveProfileBtn.addEventListener("click", async () => {
  if (!isSignedIn()) {
    renderSignedOut();
    return;
  }

  try {
    setStatus("Saving partner details...");
    const profile = await window.BookingApi.updateUserProfile({
      fullName: fullName.value.trim(),
      phone: phone.value.trim(),
      avatarUrl: avatarUrl.value.trim()
    });
    const session = window.BookingApi.readAuthSession() || {};
    localStorage.setItem(
      "imagineph_auth_session",
      JSON.stringify({ ...session, user: { ...(session.user || {}), ...(profile || {}) } })
    );
    await refreshState();
    setStatus("Partner details updated.");
  } catch (error) {
    setStatus(error.message || "Unable to update partner details.", true);
  }
});

signOutBtn.addEventListener("click", async () => {
  await window.BookingApi.logoutUser();
  renderSignedOut();
  setStatus("Signed out.");
});

initAccountLanguage();
initAccountCurrencyPicker();
if (!window.BookingApi.getAuthToken()) {
  renderSignedOut();
} else {
  refreshState().catch(() => renderSignedOut());
}
loadPartnerPrograms();

const profilePanel = document.getElementById("profilePanel");
const accountHeading = document.getElementById("accountHeading");
const accountMessage = document.getElementById("accountMessage");
const avatarBadge = document.getElementById("avatarBadge");
const goToSignIn = document.getElementById("goToSignIn");
const fullName = document.getElementById("fullName");
const phone = document.getElementById("phone");
const avatarUrl = document.getElementById("avatarUrl");
const saveProfileBtn = document.getElementById("saveProfileBtn");
const signOutBtn = document.getElementById("signOutBtn");
const profileStatus = document.getElementById("profileStatus");
const accountLangSelect = document.getElementById("accountLangSelect");

function setStatus(text, isError = false) {
  profileStatus.textContent = text || "";
  profileStatus.classList.toggle("error", Boolean(isError));
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
  profilePanel.hidden = true;
  accountHeading.textContent = "Hi, traveler";
  accountMessage.textContent = "Sign in to manage your bookings, profile, and booking rewards.";
  goToSignIn.style.display = "inline-flex";
  avatarBadge.textContent = "I";
}

function renderSignedIn(user) {
  profilePanel.hidden = false;
  const displayName = user.fullName?.trim() || user.email?.split("@")[0] || "traveler";
  accountHeading.textContent = `Hi, ${displayName}`;
  accountMessage.textContent = `Signed in as ${user.email || "your account"}. Manage booking details below.`;
  goToSignIn.style.display = "none";
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

saveProfileBtn.addEventListener("click", async () => {
  if (!isSignedIn()) {
    renderSignedOut();
    return;
  }

  try {
    setStatus("Saving traveler details...");
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
    setStatus("Traveler details updated.");
  } catch (error) {
    setStatus(error.message || "Unable to update traveler details.", true);
  }
});

signOutBtn.addEventListener("click", async () => {
  await window.BookingApi.logoutUser();
  renderSignedOut();
  setStatus("Signed out.");
});

initAccountLanguage();
initAccountCurrencyPicker();
refreshState().catch(() => renderSignedOut());

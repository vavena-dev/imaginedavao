const profilePanel = document.getElementById("profilePanel");
const accountMessage = document.getElementById("accountMessage");
const goToSignIn = document.getElementById("goToSignIn");
const fullName = document.getElementById("fullName");
const phone = document.getElementById("phone");
const avatarUrl = document.getElementById("avatarUrl");
const saveProfileBtn = document.getElementById("saveProfileBtn");
const signOutBtn = document.getElementById("signOutBtn");
const profileStatus = document.getElementById("profileStatus");

function setStatus(text, isError = false) {
  profileStatus.textContent = text || "";
  profileStatus.classList.toggle("error", Boolean(isError));
}

function fillProfile(user) {
  fullName.value = user?.fullName || "";
  phone.value = user?.phone || "";
  avatarUrl.value = user?.avatarUrl || "";
}

function isSignedIn() {
  const session = window.BookingApi.readAuthSession();
  return Boolean(session?.user);
}

function renderSignedOut() {
  profilePanel.hidden = true;
  accountMessage.textContent = "You are not signed in. Use the sign-in page to access your account profile.";
  goToSignIn.style.display = "inline-flex";
}

function renderSignedIn(user) {
  profilePanel.hidden = false;
  accountMessage.textContent = `Signed in as ${user.email || "user"}. Manage your profile below.`;
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
    setStatus("Saving profile...");
    const profile = await window.BookingApi.updateUserProfile({
      fullName: fullName.value.trim(),
      phone: phone.value.trim(),
      avatarUrl: avatarUrl.value.trim()
    });
    const session = window.BookingApi.readAuthSession() || {};
    localStorage.setItem("imagineph_auth_session", JSON.stringify({ ...session, user: { ...(session.user || {}), ...(profile || {}) } }));
    await refreshState();
    setStatus("Profile updated.");
  } catch (error) {
    setStatus(error.message || "Unable to update profile.", true);
  }
});

signOutBtn.addEventListener("click", async () => {
  await window.BookingApi.logoutUser();
  renderSignedOut();
  setStatus("Signed out.");
});

refreshState().catch(() => renderSignedOut());

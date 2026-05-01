const emailInput = document.getElementById("signInEmail");
const passwordInput = document.getElementById("signInPassword");
const continueEmailBtn = document.getElementById("continueEmailBtn");
const createAccountBtn = document.getElementById("createAccountBtn");
const signInStatus = document.getElementById("signInStatus");

const googleBtn = document.getElementById("googleBtn");
const facebookBtn = document.getElementById("facebookBtn");
const linkedinBtn = document.getElementById("linkedinBtn");

function setStatus(text, isError = false) {
  signInStatus.textContent = text || "";
  signInStatus.classList.toggle("error", Boolean(isError));
}

function returnUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("returnTo") || "index.html";
}

async function hydrateProfile() {
  const user = await window.BookingApi.fetchCurrentUser();
  if (!user) return null;
  const profile = await window.BookingApi.fetchUserProfile().catch(() => null);
  const session = window.BookingApi.readAuthSession() || {};
  const merged = { ...(session.user || {}), ...(profile || {}) };
  localStorage.setItem("imagineph_auth_session", JSON.stringify({ ...session, user: merged }));
  return merged;
}

continueEmailBtn.addEventListener("click", async () => {
  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;
  if (!email || !password) {
    setStatus("Enter email and password.", true);
    return;
  }

  try {
    setStatus("Signing in...");
    await window.BookingApi.loginUser(email, password);
    await hydrateProfile();
    setStatus("Signed in.");
    window.location.href = returnUrl();
  } catch (error) {
    setStatus(error.message || "Unable to sign in.", true);
  }
});

createAccountBtn.addEventListener("click", async () => {
  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;
  if (!email || !password) {
    setStatus("Enter email and password.", true);
    return;
  }

  try {
    setStatus("Creating account...");
    const result = await window.BookingApi.signupUser(email, password);
    if (result.needsEmailConfirmation) {
      setStatus("Account created. Confirm your email, then sign in.");
      return;
    }
    await hydrateProfile();
    setStatus("Account created and signed in.");
    window.location.href = returnUrl();
  } catch (error) {
    setStatus(error.message || "Unable to create account.", true);
  }
});

[googleBtn, facebookBtn, linkedinBtn].forEach((btn) => {
  btn.addEventListener("click", () => {
    setStatus(`${btn.textContent} sign-in will be enabled next. Use email sign-in for now.`);
  });
});

hydrateProfile().then((user) => {
  if (user) {
    window.location.href = returnUrl();
  }
});

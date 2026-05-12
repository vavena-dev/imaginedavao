const emailInput = document.getElementById("signInEmail");
const passwordInput = document.getElementById("signInPassword");
const continueEmailBtn = document.getElementById("continueEmailBtn");
const createAccountBtn = document.getElementById("createAccountBtn");
const signInStatus = document.getElementById("signInStatus");
const passwordVisibilityBtn = document.getElementById("passwordVisibilityBtn");
const authTitle = document.getElementById("authTitle");
const authIntro = document.getElementById("authIntro");
const forgotPasswordLink = document.getElementById("forgotPasswordLink");
const authCornerLoginLink = document.querySelector(".auth-corner-link[href='signin.html']");
const authCornerSignupLink = document.querySelector(".auth-corner-link[href='signin.html?mode=signup']");

function setStatus(text, isError = false, isSuccess = false) {
  signInStatus.textContent = text || "";
  signInStatus.classList.toggle("error", Boolean(isError));
  signInStatus.classList.toggle("success", Boolean(isSuccess));
}

function setSignInMode(mode) {
  const isSignup = mode === "signup";

  if (isSignup) {
    authTitle.textContent = "Create your account";
    authIntro.textContent = "Use your email and password to start your ImaginePhilippines account.";
    continueEmailBtn.textContent = "Sign in";
    createAccountBtn.textContent = "Create account";
    createAccountBtn.classList.remove("ghost");
    createAccountBtn.classList.add("btn");
    continueEmailBtn.classList.remove("btn");
    continueEmailBtn.classList.add("btn", "ghost");
    if (authCornerSignupLink) authCornerSignupLink.classList.add("is-active");
    if (authCornerLoginLink) authCornerLoginLink.classList.remove("is-active");
    setStatus("Create your account with email and password.");
    return;
  }

  authTitle.textContent = "Sign in or create an account";
  authIntro.textContent = "Continue with your email and password.";
  continueEmailBtn.textContent = "Sign in";
  createAccountBtn.textContent = "Sign up";
  continueEmailBtn.classList.remove("ghost");
  continueEmailBtn.classList.add("btn");
  createAccountBtn.classList.remove("btn");
  createAccountBtn.classList.add("btn", "ghost");
  if (authCornerLoginLink) authCornerLoginLink.classList.add("is-active");
  if (authCornerSignupLink) authCornerSignupLink.classList.remove("is-active");
}

function returnUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("returnTo") || "index.html";
}

function syncForgotLink() {
  if (!forgotPasswordLink) return;
  const value = emailInput.value.trim();
  const params = new URLSearchParams();
  if (value) params.set("email", value);
  forgotPasswordLink.href = `forgot-password.html${params.toString() ? `?${params.toString()}` : ""}`;
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

async function handleEmailSignIn() {
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
    setStatus("Signed in.", false, true);
    window.location.href = returnUrl();
  } catch (error) {
    setStatus(error.message || "Unable to sign in.", true);
  }
}

async function handleSignUp() {
  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;
  if (!email || !password) {
    setStatus("Enter email and password to create your account.", true);
    return;
  }

  try {
    setStatus("Creating account...");
    const result = await window.BookingApi.signupUser(email, password);
    if (result.needsEmailConfirmation) {
      setStatus("Account created. Confirm your email, then sign in.", false, true);
      return;
    }
    await hydrateProfile();
    setStatus("Account created and signed in.", false, true);
    window.location.href = returnUrl();
  } catch (error) {
    setStatus(error.message || "Unable to create account.", true);
  }
}

async function initializeFromOauthHash() {
  const sessionRestored = window.BookingApi.completeOAuthFromHash();
  if (!sessionRestored) return false;
  await hydrateProfile();
  window.location.href = returnUrl();
  return true;
}

continueEmailBtn.addEventListener("click", handleEmailSignIn);
createAccountBtn.addEventListener("click", handleSignUp);

passwordVisibilityBtn.addEventListener("click", () => {
  const showPassword = passwordInput.type === "password";
  passwordInput.type = showPassword ? "text" : "password";
  passwordVisibilityBtn.setAttribute("aria-pressed", showPassword ? "true" : "false");
  passwordVisibilityBtn.setAttribute("aria-label", showPassword ? "Hide password" : "Show password");
});

emailInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    handleEmailSignIn();
  }
});

emailInput.addEventListener("input", syncForgotLink);

passwordInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    handleEmailSignIn();
  }
});

(async () => {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode") === "signup" ? "signup" : "login";
  setSignInMode(mode);

  const oauthHandled = await initializeFromOauthHash();
  if (oauthHandled) return;

  syncForgotLink();

  const user = await hydrateProfile();
  if (user) {
    window.location.href = returnUrl();
  }
})();

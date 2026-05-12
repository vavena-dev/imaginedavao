const emailInput = document.getElementById("signInEmail");
const passwordInput = document.getElementById("signInPassword");
const continueEmailBtn = document.getElementById("continueEmailBtn");
const createAccountBtn = document.getElementById("createAccountBtn");
const signInStatus = document.getElementById("signInStatus");
const forgotPasswordToggleBtn = document.getElementById("forgotPasswordToggleBtn");
const forgotUserToggleBtn = document.getElementById("forgotUserToggleBtn");
const forgotPasswordCard = document.getElementById("forgotPasswordCard");
const forgotUserCard = document.getElementById("forgotUserCard");
const forgotPasswordEmail = document.getElementById("forgotPasswordEmail");
const sendResetBtn = document.getElementById("sendResetBtn");
const forgotPasswordStatus = document.getElementById("forgotPasswordStatus");
const forgotUserFullName = document.getElementById("forgotUserFullName");
const forgotUserPhone = document.getElementById("forgotUserPhone");
const findUserBtn = document.getElementById("findUserBtn");
const forgotUserStatus = document.getElementById("forgotUserStatus");
const forgotUserResult = document.getElementById("forgotUserResult");

const googleBtn = document.getElementById("googleBtn");
const facebookBtn = document.getElementById("facebookBtn");
const linkedinBtn = document.getElementById("linkedinBtn");

function setStatus(text, isError = false) {
  signInStatus.textContent = text || "";
  signInStatus.classList.toggle("error", Boolean(isError));
}

function setForgotPasswordStatus(text, isError = false, isSuccess = false) {
  forgotPasswordStatus.textContent = text || "";
  forgotPasswordStatus.classList.toggle("error", Boolean(isError));
  forgotPasswordStatus.classList.toggle("success", Boolean(isSuccess));
}

function setForgotUserStatus(text, isError = false, isSuccess = false) {
  forgotUserStatus.textContent = text || "";
  forgotUserStatus.classList.toggle("error", Boolean(isError));
  forgotUserStatus.classList.toggle("success", Boolean(isSuccess));
}

function showCard(card) {
  if (card === "password") {
    forgotPasswordCard.hidden = !forgotPasswordCard.hidden;
    forgotUserCard.hidden = true;
    return;
  }
  if (card === "user") {
    forgotUserCard.hidden = !forgotUserCard.hidden;
    forgotPasswordCard.hidden = true;
  }
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

forgotPasswordToggleBtn.addEventListener("click", () => {
  showCard("password");
  setForgotPasswordStatus("");
});

forgotUserToggleBtn.addEventListener("click", () => {
  showCard("user");
  setForgotUserStatus("");
  forgotUserResult.innerHTML = "";
});

sendResetBtn.addEventListener("click", async () => {
  const email = forgotPasswordEmail.value.trim().toLowerCase() || emailInput.value.trim().toLowerCase();
  if (!email) {
    setForgotPasswordStatus("Enter your account email first.", true);
    return;
  }

  try {
    setForgotPasswordStatus("Sending reset link...");
    const redirectTo = `${window.location.origin}/reset-password.html`;
    const message = await window.BookingApi.requestPasswordReset(email, redirectTo);
    setForgotPasswordStatus(message, false, true);
  } catch (error) {
    setForgotPasswordStatus(error.message || "Unable to send password reset link.", true);
  }
});

findUserBtn.addEventListener("click", async () => {
  const fullName = forgotUserFullName.value.trim();
  const phone = forgotUserPhone.value.trim();
  if (!fullName || !phone) {
    setForgotUserStatus("Enter your full name and phone number.", true);
    return;
  }

  try {
    setForgotUserStatus("Looking up your account...");
    const data = await window.BookingApi.recoverUserAccount(fullName, phone);
    forgotUserResult.innerHTML = "";
    if (data.emails.length) {
      data.emails.forEach((email) => {
        const li = document.createElement("li");
        li.textContent = email;
        forgotUserResult.appendChild(li);
      });
      setForgotUserStatus("Matching account email(s) found.", false, true);
      return;
    }
    setForgotUserStatus(data.message || "No matching account found.", true);
  } catch (error) {
    setForgotUserStatus(error.message || "Unable to find account.", true);
  }
});

hydrateProfile().then((user) => {
  if (user) {
    window.location.href = returnUrl();
  }
});

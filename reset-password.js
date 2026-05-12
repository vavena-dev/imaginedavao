const newPasswordInput = document.getElementById("newPassword");
const confirmNewPasswordInput = document.getElementById("confirmNewPassword");
const updatePasswordBtn = document.getElementById("updatePasswordBtn");
const resetPasswordStatus = document.getElementById("resetPasswordStatus");

function setStatus(text, isError = false, isSuccess = false) {
  resetPasswordStatus.textContent = text || "";
  resetPasswordStatus.classList.toggle("error", Boolean(isError));
  resetPasswordStatus.classList.toggle("success", Boolean(isSuccess));
}

function accessTokenFromUrl() {
  const hash = window.location.hash ? window.location.hash.slice(1) : "";
  const hashParams = new URLSearchParams(hash);
  const queryParams = new URLSearchParams(window.location.search);
  return (
    hashParams.get("access_token") ||
    queryParams.get("access_token") ||
    window.BookingApi.getAuthToken()
  );
}

updatePasswordBtn.addEventListener("click", async () => {
  const accessToken = accessTokenFromUrl();
  if (!accessToken) {
    setStatus("Missing reset token. Open this page from your password reset email.", true);
    return;
  }

  const password = newPasswordInput.value;
  const confirmPassword = confirmNewPasswordInput.value;
  if (!password || password.length < 8) {
    setStatus("Password must be at least 8 characters.", true);
    return;
  }
  if (password !== confirmPassword) {
    setStatus("Passwords do not match.", true);
    return;
  }

  try {
    setStatus("Updating password...");
    const message = await window.BookingApi.resetPassword(accessToken, password);
    setStatus(message, false, true);
    window.setTimeout(() => {
      window.location.href = "signin.html";
    }, 1200);
  } catch (error) {
    setStatus(error.message || "Unable to update password.", true);
  }
});

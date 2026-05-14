const emailInput = document.getElementById("forgotPasswordEmail");
const sendResetBtn = document.getElementById("sendResetBtn");
const forgotPasswordStatus = document.getElementById("forgotPasswordStatus");

function setStatus(text, isError = false, isSuccess = false) {
  forgotPasswordStatus.textContent = text || "";
  forgotPasswordStatus.classList.toggle("error", Boolean(isError));
  forgotPasswordStatus.classList.toggle("success", Boolean(isSuccess));
}

async function sendResetLink() {
  const email = emailInput.value.trim().toLowerCase();
  if (!email) {
    setStatus("Enter your account email first.", true);
    return;
  }

  try {
    setStatus("Sending reset link...");
    const redirectTo = `${window.location.origin}/reset-password`;
    const message = await window.BookingApi.requestPasswordReset(email, redirectTo);
    setStatus(message, false, true);
  } catch (error) {
    setStatus(error.message || "Unable to send password reset link.", true);
  }
}

sendResetBtn.addEventListener("click", sendResetLink);

emailInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    sendResetLink();
  }
});

(() => {
  const params = new URLSearchParams(window.location.search);
  const email = params.get("email");
  if (email) {
    emailInput.value = String(email).trim();
  }
})();

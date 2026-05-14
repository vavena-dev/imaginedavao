const bookingsGrid = document.getElementById("bookingsGrid");
const bookingsStatus = document.getElementById("bookingsStatus");
const bookingsSub = document.getElementById("bookingsSub");
const bookingsLevel = document.getElementById("bookingsLevel");
const bookingsCount = document.getElementById("bookingsCount");
const bookingsProgress = document.getElementById("bookingsProgress");
const bookingsNext = document.getElementById("bookingsNext");

function setStatus(message, isError = false) {
  bookingsStatus.textContent = message || "";
  bookingsStatus.classList.toggle("error", Boolean(isError));
}

function renderLevel(stats) {
  bookingsLevel.textContent = `Level ${stats.level || 1}`;
  bookingsCount.textContent = `${stats.totalBookings || 0} bookings`;
  bookingsProgress.style.width = `${stats.progressPercent || 0}%`;
  bookingsNext.textContent = `Next level at ${stats.nextLevelAtBookings || 5} bookings.`;
}

function renderBookings(items) {
  if (!items.length) {
    bookingsGrid.innerHTML = "<article class='card'><p>No bookings yet. Start from the booking page.</p></article>";
    return;
  }

  bookingsGrid.innerHTML = items
    .map((item) => {
      const date = item.timestamp ? new Date(item.timestamp).toLocaleString() : "";
      return `
      <article class="card">
        <h3>${item.title || "Booking item"}</h3>
        <p class="muted">${item.category || "unknown"} • ${item.city || "unknown"}</p>
        ${item.price !== null && item.price !== undefined ? `<p>Price: PHP ${item.price}</p>` : ""}
        ${date ? `<p class="muted">${date}</p>` : ""}
        ${item.trackedUrl ? `<a class="btn ghost block-link" href="${item.trackedUrl}" target="_blank" rel="noopener">Continue to Partner Checkout</a>` : ""}
      </article>
    `;
    })
    .join("");
}

async function init() {
  const token = window.BookingApi.getAuthToken();
  if (!token) {
    bookingsSub.textContent = "Please sign in to view your bookings.";
    setStatus("Not signed in. Go to signin first.", true);
    return;
  }

  try {
    const response = await fetch("/api/auth/bookings", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to load bookings");

    renderLevel(data.stats || {});
    renderBookings(data.bookings || []);
    bookingsSub.textContent = "Your recent booking activity and level progression.";
    setStatus("Bookings loaded.");
  } catch (error) {
    setStatus(error.message || "Failed to load bookings.", true);
  }
}

init();

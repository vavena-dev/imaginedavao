const filterCity = document.getElementById("filterCity");
const filterPage = document.getElementById("filterPage");
const filterSection = document.getElementById("filterSection");
const reloadBtn = document.getElementById("reloadBtn");
const itemsGrid = document.getElementById("itemsGrid");
const statusEl = document.getElementById("status");
const itemForm = document.getElementById("itemForm");
const formTitle = document.getElementById("formTitle");
const resetBtn = document.getElementById("resetBtn");

const bookingItemsGrid = document.getElementById("bookingItemsGrid");
const bookingStatusEl = document.getElementById("bookingStatusMsg");
const bookingForm = document.getElementById("bookingForm");
const bookingFormTitle = document.getElementById("bookingFormTitle");
const bookingResetBtn = document.getElementById("bookingResetBtn");

const fields = {
  id: document.getElementById("itemId"),
  title: document.getElementById("title"),
  image: document.getElementById("image"),
  text: document.getElementById("text"),
  meta: document.getElementById("meta"),
  tag: document.getElementById("tag"),
  tags: document.getElementById("tags"),
  sortOrder: document.getElementById("sortOrder"),
  bookingMode: document.getElementById("bookingMode"),
  bookingType: document.getElementById("bookingType"),
  ctaLabel: document.getElementById("ctaLabel"),
  ctaUrl: document.getElementById("ctaUrl"),
  bookingInfo: document.getElementById("bookingInfo")
};

const bookingFields = {
  id: document.getElementById("bookingItemId"),
  category: document.getElementById("bookingCategory"),
  providerName: document.getElementById("bookingProviderName"),
  title: document.getElementById("bookingTitle"),
  description: document.getElementById("bookingDescription"),
  locationLabel: document.getElementById("bookingLocationLabel"),
  priceAmount: document.getElementById("bookingPriceAmount"),
  priceCurrency: document.getElementById("bookingPriceCurrency"),
  priceUnit: document.getElementById("bookingPriceUnit"),
  rating: document.getElementById("bookingRating"),
  reviewCount: document.getElementById("bookingReviewCount"),
  thumbnailUrl: document.getElementById("bookingThumbnailUrl"),
  affiliateUrl: document.getElementById("bookingAffiliateUrl"),
  status: document.getElementById("bookingStatus"),
  sortOrder: document.getElementById("bookingSortOrder")
};

let currentItems = [];
let bookingItems = [];

const ADMIN_TOKEN_KEY = "imagineph_admin_token";
const ADMIN_REQUIRED_MESSAGE =
  "Admin access required. Sign in with an admin account in signin.html or set a valid ADMIN_TOKEN in this browser.";

function getAuthHeaders() {
  const headers = { "Content-Type": "application/json" };
  try {
    const rawSession = localStorage.getItem("imagineph_auth_session");
    if (rawSession) {
      const session = JSON.parse(rawSession);
      if (session?.accessToken) {
        headers.Authorization = `Bearer ${session.accessToken}`;
      }
    }
  } catch {
    // ignore session parse issues
  }

  const adminToken = localStorage.getItem(ADMIN_TOKEN_KEY);
  if (adminToken) {
    headers["x-admin-token"] = adminToken;
  }
  return headers;
}

function ensureAdminTokenIfNeeded() {
  if (localStorage.getItem(ADMIN_TOKEN_KEY)) return;
  const typed = window.prompt("Optional: Enter ADMIN_TOKEN for legacy admin mode. Leave blank if using signed-in admin account.");
  if (typed && typed.trim()) {
    localStorage.setItem(ADMIN_TOKEN_KEY, typed.trim());
  }
}

function apiErrorMessage(response, data, fallback) {
  if (response.status === 401) return ADMIN_REQUIRED_MESSAGE;
  return data?.error || fallback;
}

function setStatus(text, isError = false) {
  statusEl.textContent = text;
  statusEl.style.color = isError ? "#a12626" : "#665e55";
}

function setBookingStatus(text, isError = false) {
  bookingStatusEl.textContent = text;
  bookingStatusEl.style.color = isError ? "#a12626" : "#665e55";
}

function getContext() {
  return {
    city: filterCity.value,
    page: filterPage.value,
    section: filterSection.value
  };
}

function toPayload() {
  return {
    id: fields.id.value.trim() || undefined,
    ...getContext(),
    title: fields.title.value.trim(),
    image: fields.image.value.trim(),
    text: fields.text.value.trim(),
    meta: fields.meta.value.trim(),
    tag: fields.tag.value.trim(),
    tags: fields.tags.value
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean),
    sortOrder: Number(fields.sortOrder.value || 0),
    bookingMode: fields.bookingMode.value,
    bookingType: fields.bookingType.value,
    ctaLabel: fields.ctaLabel.value.trim(),
    ctaUrl: fields.ctaUrl.value.trim(),
    bookingInfo: fields.bookingInfo.value.trim()
  };
}

function toBookingPayload() {
  return {
    id: bookingFields.id.value.trim() || undefined,
    city: filterCity.value,
    category: bookingFields.category.value,
    providerName: bookingFields.providerName.value.trim(),
    title: bookingFields.title.value.trim(),
    description: bookingFields.description.value.trim(),
    locationLabel: bookingFields.locationLabel.value.trim(),
    priceAmount: Number(bookingFields.priceAmount.value || 0),
    priceCurrency: bookingFields.priceCurrency.value.trim() || "PHP",
    priceUnit: bookingFields.priceUnit.value.trim(),
    rating: Number(bookingFields.rating.value || 0),
    reviewCount: Number(bookingFields.reviewCount.value || 0),
    thumbnailUrl: bookingFields.thumbnailUrl.value.trim(),
    affiliateUrl: bookingFields.affiliateUrl.value.trim(),
    status: bookingFields.status.value,
    sortOrder: Number(bookingFields.sortOrder.value || 0)
  };
}

function fillForm(item) {
  fields.id.value = item.id || "";
  fields.title.value = item.title || "";
  fields.image.value = item.image || "";
  fields.text.value = item.text || "";
  fields.meta.value = item.meta || "";
  fields.tag.value = item.tag || "";
  fields.tags.value = (item.tags || []).join(", ");
  fields.sortOrder.value = String(item.sortOrder || 0);
  fields.bookingMode.value = item.bookingMode || "none";
  fields.bookingType.value = item.bookingType || "experiences";
  fields.ctaLabel.value = item.ctaLabel || "";
  fields.ctaUrl.value = item.ctaUrl || "";
  fields.bookingInfo.value = item.bookingInfo || "";
  formTitle.textContent = "Update Item";
}

function fillBookingForm(item) {
  bookingFields.id.value = item.id || "";
  bookingFields.category.value = item.category || "hotels";
  bookingFields.providerName.value = item.providerName || "";
  bookingFields.title.value = item.title || "";
  bookingFields.description.value = item.description || "";
  bookingFields.locationLabel.value = item.locationLabel || "";
  bookingFields.priceAmount.value = String(item.priceAmount || 0);
  bookingFields.priceCurrency.value = item.priceCurrency || "PHP";
  bookingFields.priceUnit.value = item.priceUnit || "";
  bookingFields.rating.value = String(item.rating || 4.5);
  bookingFields.reviewCount.value = String(item.reviewCount || 0);
  bookingFields.thumbnailUrl.value = item.thumbnailUrl || "";
  bookingFields.affiliateUrl.value = item.affiliateUrl || "";
  bookingFields.status.value = item.status || "published";
  bookingFields.sortOrder.value = String(item.sortOrder || 0);
  bookingFormTitle.textContent = "Update Booking Row";
}

function clearForm() {
  fields.id.value = "";
  itemForm.reset();
  fields.sortOrder.value = "1";
  fields.bookingMode.value = "none";
  fields.bookingType.value = "experiences";
  formTitle.textContent = "Create Item";
}

function clearBookingForm() {
  bookingFields.id.value = "";
  bookingForm.reset();
  bookingFields.priceAmount.value = "0";
  bookingFields.priceCurrency.value = "PHP";
  bookingFields.rating.value = "4.5";
  bookingFields.reviewCount.value = "0";
  bookingFields.sortOrder.value = "1";
  bookingFields.status.value = "published";
  bookingFields.category.value = "flights";
  bookingFormTitle.textContent = "Booking Inventory (Affiliate Rows)";
}

async function loadItems() {
  const ctx = getContext();
  const qs = new URLSearchParams(ctx);
  const response = await fetch(`/api/cms/items?${qs.toString()}`, { headers: getAuthHeaders() });
  const data = await response.json();
  if (!response.ok) throw new Error(apiErrorMessage(response, data, "Failed to load items"));
  currentItems = data.items || [];
  renderItems();
}

async function loadBookingItems() {
  const qs = new URLSearchParams({ city: filterCity.value });
  const response = await fetch(`/api/admin/booking-inventory?${qs.toString()}`, { headers: getAuthHeaders() });
  const data = await response.json();
  if (!response.ok) throw new Error(apiErrorMessage(response, data, "Failed to load booking inventory"));
  bookingItems = data.items || [];
  renderBookingItems();
}

function renderItems() {
  if (!currentItems.length) {
    itemsGrid.innerHTML = "<p>No items found for this page and section yet.</p>";
    return;
  }

  itemsGrid.innerHTML = currentItems
    .map(
      (item) => `
      <article class="item">
        <img src="${item.image || "assets/fallback-travel.svg"}" alt="${item.title || "Item"}" />
        <div class="item-body">
          <h3>${item.title || "Untitled"}</h3>
          <p>${item.text || ""}</p>
          <div class="meta">
            <span class="pill">${item.section}</span>
            <span class="pill">${item.page}</span>
            <span class="pill">${item.bookingMode || "none"}</span>
          </div>
          <div class="item-actions">
            <button class="btn ghost js-edit" data-id="${item.id}">Edit</button>
            <button class="btn ghost js-delete" data-id="${item.id}">Delete</button>
          </div>
        </div>
      </article>
    `
    )
    .join("");
}

function renderBookingItems() {
  if (!bookingItems.length) {
    bookingItemsGrid.innerHTML = "<p>No booking inventory rows for this city yet.</p>";
    return;
  }

  bookingItemsGrid.innerHTML = bookingItems
    .slice()
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    .map(
      (item) => `
      <article class="item">
        <img src="${item.thumbnailUrl || "assets/fallback-travel.svg"}" alt="${item.title || "Booking item"}" />
        <div class="item-body">
          <h3>${item.title || "Untitled"}</h3>
          <p>${item.description || ""}</p>
          <div class="meta">
            <span class="pill">${item.category || "unknown"}</span>
            <span class="pill">${item.providerName || "Provider"}</span>
            <span class="pill">${item.status || "published"}</span>
          </div>
          <div class="item-actions">
            <button class="btn ghost js-booking-edit" data-id="${item.id}">Edit</button>
            <button class="btn ghost js-booking-delete" data-id="${item.id}">Delete</button>
          </div>
        </div>
      </article>
    `
    )
    .join("");
}

async function saveItem(event) {
  event.preventDefault();
  const payload = toPayload();
  const isUpdate = Boolean(payload.id);
  const response = await fetch("/api/cms/items", {
    method: isUpdate ? "PUT" : "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(apiErrorMessage(response, data, "Failed to save item"));
  setStatus(isUpdate ? "Item updated." : "Item created.");
  clearForm();
  await loadItems();
}

async function saveBookingItem(event) {
  event.preventDefault();
  const payload = toBookingPayload();
  const isUpdate = Boolean(payload.id);
  const response = await fetch("/api/admin/booking-inventory", {
    method: isUpdate ? "PUT" : "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(apiErrorMessage(response, data, "Failed to save booking inventory item"));
  setBookingStatus(isUpdate ? "Booking row updated." : "Booking row created.");
  clearBookingForm();
  await loadBookingItems();
}

async function deleteItem(id) {
  const response = await fetch(`/api/cms/items?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });
  const data = await response.json();
  if (!response.ok) throw new Error(apiErrorMessage(response, data, "Failed to delete item"));
  setStatus("Item deleted.");
  await loadItems();
}

async function deleteBookingItem(id) {
  const response = await fetch(`/api/admin/booking-inventory?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });
  const data = await response.json();
  if (!response.ok) throw new Error(apiErrorMessage(response, data, "Failed to delete booking row"));
  setBookingStatus("Booking row deleted.");
  await loadBookingItems();
}

itemsGrid.addEventListener("click", async (event) => {
  const editBtn = event.target.closest(".js-edit");
  if (editBtn) {
    const found = currentItems.find((item) => item.id === editBtn.dataset.id);
    if (found) fillForm(found);
    return;
  }

  const deleteBtn = event.target.closest(".js-delete");
  if (deleteBtn) {
    const ok = window.confirm("Delete this item?");
    if (!ok) return;
    try {
      await deleteItem(deleteBtn.dataset.id);
    } catch (error) {
      setStatus(error.message, true);
    }
  }
});

bookingItemsGrid.addEventListener("click", async (event) => {
  const editBtn = event.target.closest(".js-booking-edit");
  if (editBtn) {
    const found = bookingItems.find((item) => item.id === editBtn.dataset.id);
    if (found) fillBookingForm(found);
    return;
  }

  const deleteBtn = event.target.closest(".js-booking-delete");
  if (deleteBtn) {
    const ok = window.confirm("Delete this booking row?");
    if (!ok) return;
    try {
      await deleteBookingItem(deleteBtn.dataset.id);
    } catch (error) {
      setBookingStatus(error.message, true);
    }
  }
});

reloadBtn.addEventListener("click", async () => {
  try {
    await Promise.all([loadItems(), loadBookingItems()]);
    setStatus("Items loaded.");
    setBookingStatus("Booking rows loaded.");
  } catch (error) {
    setStatus(error.message, true);
    setBookingStatus(error.message, true);
  }
});

resetBtn.addEventListener("click", () => {
  clearForm();
  setStatus("Form reset.");
});

bookingResetBtn.addEventListener("click", () => {
  clearBookingForm();
  setBookingStatus("Booking form reset.");
});

itemForm.addEventListener("submit", async (event) => {
  try {
    await saveItem(event);
  } catch (error) {
    setStatus(error.message, true);
  }
});

bookingForm.addEventListener("submit", async (event) => {
  try {
    await saveBookingItem(event);
  } catch (error) {
    setBookingStatus(error.message, true);
  }
});

[filterCity, filterPage, filterSection].forEach((node) => {
  node.addEventListener("change", () => {
    clearForm();
    clearBookingForm();
    loadBookingItems().catch((error) => setBookingStatus(error.message, true));
  });
});

ensureAdminTokenIfNeeded();

Promise.all([loadItems(), loadBookingItems()]).then(
  () => {
    setStatus("Items loaded.");
    setBookingStatus("Booking rows loaded.");
  },
  (error) => {
    setStatus(error.message, true);
    setBookingStatus(error.message, true);
  }
);

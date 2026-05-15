const partnerProgramGrid = document.getElementById("partnerProgramGrid");
const partnerProgramRows = document.getElementById("partnerProgramRows");
const partnerRevenueSummary = document.getElementById("partnerRevenueSummary");

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function billingLabel(model) {
  const labels = {
    monthly: "Monthly",
    campaign: "Campaign",
    commission: "Commission",
    lead_fee: "Lead fee",
    hybrid: "Hybrid"
  };
  return labels[model] || "Partner";
}

function formatMoney(amount, currency = "PHP") {
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

function revenueBasis(program) {
  if (program.billingModel === "commission" && Number(program.commissionRate)) {
    return `${Number(program.commissionRate).toFixed(0)}% commission`;
  }
  if (program.billingModel === "lead_fee" && Number(program.leadFeeAmount)) {
    return `${formatMoney(program.leadFeeAmount, program.priceCurrency)} per qualified lead`;
  }
  const price = formatMoney(program.priceAmount, program.priceCurrency);
  if (!price) return billingLabel(program.billingModel);
  return program.billingModel === "monthly" ? `${price} monthly` : `${price} per campaign`;
}

function priceLabel(program) {
  if (program.billingModel === "commission") return revenueBasis(program);
  if (program.billingModel === "lead_fee") return revenueBasis(program);
  return revenueBasis(program);
}

function renderPrograms(programs) {
  if (!programs.length) {
    partnerProgramGrid.innerHTML = '<article class="partner-loading">Partner programs are currently being reviewed by the ImagineDavao team.</article>';
    partnerProgramRows.innerHTML = '<tr><td colspan="4">Partner programs are currently being reviewed.</td></tr>';
    return;
  }

  partnerProgramGrid.innerHTML = programs
    .map((program) => {
      const benefits = (program.benefits || [])
        .slice(0, 3)
        .map((benefit) => `<li>${escapeHtml(benefit)}</li>`)
        .join("");
      return `
        <article class="partner-program-card">
          <div class="partner-program-meta">
            <span class="partner-chip">${escapeHtml(billingLabel(program.billingModel))}</span>
            <span class="partner-chip">${escapeHtml(program.category || "program")}</span>
          </div>
          <h3>${escapeHtml(program.title)}</h3>
          <p>${escapeHtml(program.summary)}</p>
          <div class="partner-price">${escapeHtml(priceLabel(program))}</div>
          <ul class="partner-benefits">${benefits}</ul>
        </article>
      `;
    })
    .join("");

  partnerProgramRows.innerHTML = programs
    .map(
      (program) => `
        <tr>
          <td>${escapeHtml(program.title)}</td>
          <td>${escapeHtml(billingLabel(program.billingModel))}</td>
          <td>${escapeHtml(program.partnerType)}</td>
          <td>${escapeHtml(revenueBasis(program))}</td>
        </tr>
      `
    )
    .join("");
}

async function loadPartnerPrograms() {
  try {
    const response = await fetch("/api/partners?city=davao");
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Unable to load partner programs");

    if (partnerRevenueSummary && data.revenueModel?.summary) {
      partnerRevenueSummary.textContent = data.revenueModel.summary;
    }

    renderPrograms(data.programs || []);
  } catch (error) {
    partnerProgramGrid.innerHTML = `<article class="partner-loading">${escapeHtml(error.message || "Unable to load partner programs.")}</article>`;
    partnerProgramRows.innerHTML = '<tr><td colspan="4">Unable to load partner programs.</td></tr>';
  }
}

loadPartnerPrograms();


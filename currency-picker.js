(() => {
  const STORAGE_KEY = "imagineph_currency";
  const DEFAULT_CURRENCY = "AUD";
  const PINNED = ["USD", "AUD", "PHP"];
  const CURRENCIES = [
    { code: "USD", name: "U.S. Dollar" },
    { code: "AUD", name: "Australian Dollar" },
    { code: "PHP", name: "Philippine Peso" },
    { code: "EUR", name: "Euro" },
    { code: "GBP", name: "Pound Sterling" },
    { code: "CAD", name: "Canadian Dollar" },
    { code: "INR", name: "Indian Rupee" },
    { code: "THB", name: "Thai Baht" },
    { code: "JPY", name: "Japanese Yen" },
    { code: "KRW", name: "South Korean Won" },
    { code: "SGD", name: "Singapore Dollar" },
    { code: "HKD", name: "Hong Kong Dollar" },
    { code: "CNY", name: "Chinese Yuan" },
    { code: "MYR", name: "Malaysian Ringgit" },
    { code: "IDR", name: "Indonesian Rupiah" },
    { code: "VND", name: "Vietnamese Dong" },
    { code: "AED", name: "UAE Dirham" },
    { code: "CHF", name: "Swiss Franc" },
    { code: "SEK", name: "Swedish Krona" },
    { code: "NOK", name: "Norwegian Krone" },
    { code: "DKK", name: "Danish Krone" },
    { code: "NZD", name: "New Zealand Dollar" }
  ];

  function normalizeCurrency(code) {
    return typeof code === "string" ? code.trim().toUpperCase() : "";
  }

  function isKnownCurrency(code) {
    return CURRENCIES.some((currency) => currency.code === code);
  }

  function getSelectedCurrency() {
    const stored = normalizeCurrency(localStorage.getItem(STORAGE_KEY));
    if (isKnownCurrency(stored)) return stored;
    return DEFAULT_CURRENCY;
  }

  function setSelectedCurrency(code) {
    const normalized = normalizeCurrency(code);
    if (!isKnownCurrency(normalized)) return;
    localStorage.setItem(STORAGE_KEY, normalized);
  }

  function currencyOptionMarkup(currency, selectedCode) {
    const selectedClass = currency.code === selectedCode ? " is-selected" : "";
    return `
      <button class="currency-option${selectedClass}" type="button" data-currency-code="${currency.code}">
        <span class="currency-option-name">${currency.name}</span>
        <span class="currency-option-code">${currency.code}</span>
      </button>
    `;
  }

  function renderGrid(container, currencies, selectedCode) {
    if (!container) return;
    container.innerHTML = currencies.map((currency) => currencyOptionMarkup(currency, selectedCode)).join("");
  }

  function init(config) {
    const trigger = document.getElementById(config.triggerId);
    const modal = document.getElementById(config.modalId);
    const backdrop = document.getElementById(config.backdropId);
    const closeBtn = document.getElementById(config.closeId);
    const pinnedContainer = document.getElementById(config.pinnedContainerId);
    const allContainer = document.getElementById(config.allContainerId);

    if (!trigger || !modal || !backdrop || !closeBtn || !pinnedContainer || !allContainer) return;

    let selected = getSelectedCurrency();

    const pinnedCurrencies = PINNED.map((code) => CURRENCIES.find((currency) => currency.code === code)).filter(Boolean);
    const allCurrencies = CURRENCIES.slice().sort((a, b) => a.name.localeCompare(b.name));

    function updateTriggerText() {
      trigger.textContent = selected;
      trigger.setAttribute("aria-label", `Currency: ${selected}. Open currency selector.`);
    }

    function emitCurrencyChange() {
      document.dispatchEvent(
        new CustomEvent("imagineph:currency-change", {
          detail: {
            currency: selected
          }
        })
      );
    }

    function render() {
      renderGrid(pinnedContainer, pinnedCurrencies, selected);
      renderGrid(allContainer, allCurrencies, selected);
      updateTriggerText();
    }

    function openModal() {
      modal.hidden = false;
      backdrop.hidden = false;
      document.body.classList.add("currency-modal-open");
      closeBtn.focus();
    }

    function closeModal() {
      modal.hidden = true;
      backdrop.hidden = true;
      document.body.classList.remove("currency-modal-open");
      trigger.focus();
    }

    function handleSelectionClick(event) {
      const option = event.target.closest("[data-currency-code]");
      if (!option) return;
      const nextCurrency = normalizeCurrency(option.dataset.currencyCode);
      if (!nextCurrency || nextCurrency === selected) {
        closeModal();
        return;
      }
      selected = nextCurrency;
      setSelectedCurrency(nextCurrency);
      render();
      emitCurrencyChange();
      closeModal();
    }

    trigger.addEventListener("click", openModal);
    closeBtn.addEventListener("click", closeModal);
    backdrop.addEventListener("click", closeModal);
    pinnedContainer.addEventListener("click", handleSelectionClick);
    allContainer.addEventListener("click", handleSelectionClick);

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !modal.hidden) {
        closeModal();
      }
    });

    render();
    emitCurrencyChange();
  }

  window.ImagineCurrency = {
    init,
    getSelectedCurrency,
    setSelectedCurrency,
    currencies: CURRENCIES.map((currency) => ({ ...currency }))
  };
})();

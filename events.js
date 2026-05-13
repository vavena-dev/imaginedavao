(function initEventsPage() {
  const grid = document.getElementById("eventsFeaturedGrid");
  if (!grid) return;

  const events = [
    {
      type: "Signature Festival",
      name: "Kadayawan Grand Parade",
      summary: "The city's biggest cultural celebration with floral floats, street performances, and region-wide creative showcases.",
      meta: "Downtown Davao | August Program",
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1400&q=80",
      highlights: ["Full-day parade route", "Traditional dance showcases", "Best for first-time visitors"],
      imageWidth: 1400,
      imageHeight: 933,
      learnMoreUrl: "event-kadayawan-grand-parade.html",
      bookUrl: "booking.html#experiences"
    },
    {
      type: "Night Culture",
      name: "Lanterns on the Gulf",
      summary: "A waterfront evening event with live music, illuminated art installations, and curated local food stations.",
      meta: "Coastal Davao Gulf | Friday Evenings",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1400&q=80",
      highlights: ["Sunset-to-night schedule", "Family-friendly route", "Easy transfer options"],
      imageWidth: 1400,
      imageHeight: 933,
      learnMoreUrl: "event-lanterns-on-the-gulf.html",
      bookUrl: "booking.html#experiences"
    },
    {
      type: "Music + Food Weekend",
      name: "Mindanao Coffee & Music Social",
      summary: "An open-air weekend social featuring regional coffee roasters, acoustic sets, and local artisan pop-up stalls.",
      meta: "Poblacion District | Weekend Mornings",
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1400&q=80",
      highlights: ["Small-stage local artists", "Coffee tasting lanes", "Strong for groups and couples"],
      imageWidth: 1400,
      imageHeight: 933,
      learnMoreUrl: "event-mindanao-coffee-music-social.html",
      bookUrl: "booking.html#experiences"
    },
    {
      type: "Active City Series",
      name: "Davao River Night Run",
      summary: "A guided evening run featuring lit route markers, hydration points, and post-run local snacks by the river.",
      meta: "Riverside Zone | Monthly Edition",
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1400&q=80",
      highlights: ["Timed and non-timed tracks", "Community run format", "Beginner-friendly pacing"],
      imageWidth: 1400,
      imageHeight: 933,
      learnMoreUrl: "event-davao-river-night-run.html",
      bookUrl: "booking.html#experiences"
    },
    {
      type: "Neighborhood Culture",
      name: "Poblacion Food & Culture Walk",
      summary: "A hosted evening trail through heritage lanes, tasting stops, and storytelling points led by local guides.",
      meta: "Poblacion Core | Tuesday and Saturday",
      image: "https://images.unsplash.com/photo-1523451190197-94e8f8ce2f76?auto=format&fit=crop&w=1400&q=80",
      highlights: ["Guided bilingual hosts", "Local heritage narration", "Includes tasting credits"],
      imageWidth: 1400,
      imageHeight: 933,
      learnMoreUrl: "event-poblacion-food-culture-walk.html",
      bookUrl: "booking.html#experiences"
    }
  ];

  if (!events.length) {
    grid.innerHTML = '<article class="events-empty"><p>No featured events are available right now. Please check back soon.</p></article>';
    return;
  }

  grid.innerHTML = events
    .map(
      (item) => `
      <article class="events-card">
        <img
          class="events-card-image"
          src="${item.image}"
          alt="${item.name}"
          width="${item.imageWidth}"
          height="${item.imageHeight}"
          loading="lazy"
          decoding="async"
        />
        <div class="events-card-body">
          <p class="events-card-type">${item.type}</p>
          <h3 class="events-card-title">${item.name}</h3>
          <p class="events-card-text">${item.summary}</p>
          <p class="events-card-meta">${item.meta}</p>
          <ul class="events-card-highlights">
            ${item.highlights.map((highlight) => `<li>${highlight}</li>`).join("")}
          </ul>
          <div class="events-card-actions">
            <a class="events-btn" href="${item.learnMoreUrl}" aria-label="Learn more about ${item.name}">Learn more</a>
            <a class="events-btn book" href="${item.bookUrl}" aria-label="Book ${item.name}">Book</a>
          </div>
        </div>
      </article>
    `
    )
    .join("");
})();

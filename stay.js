(function initStayPage() {
  const grid = document.getElementById("stayHotelGrid");
  if (!grid) return;

  const stays = [
    {
      name: "Seda Abreeza",
      location: "Bajada District, Davao City",
      summary: "A polished city stay beside Abreeza Mall with quick access to business hubs, cafés, and evening dining spots.",
      image: "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=1400",
      highlights: ["Business-ready rooms", "Walkable shopping and dining", "Reliable airport transfers"],
      imageWidth: 1400,
      imageHeight: 933,
      learnMoreUrl: "hotel-seda-abreeza.html",
      bookUrl: "booking.html#hotels"
    },
    {
      name: "Dusit Thani Residence Davao",
      location: "Lanang, Davao City",
      summary: "A premium address with spacious suites and elevated amenities, ideal for longer city stays and family trips.",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Dusit_Thani_Residence_Davao.jpg/1280px-Dusit_Thani_Residence_Davao.jpg",
      highlights: ["Suite-style accommodations", "Wellness and pool facilities", "Close to SM Lanang Premier"],
      imageWidth: 1280,
      imageHeight: 960,
      learnMoreUrl: "hotel-dusit-thani-residence.html",
      bookUrl: "booking.html#hotels"
    },
    {
      name: "Apo View Hotel",
      location: "Poblacion District, Davao City",
      summary: "A heritage-favorite in the downtown core, perfect for travelers who want culture, markets, and local food nearby.",
      image: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1400",
      highlights: ["Classic Davao hospitality", "Near museums and city landmarks", "Great base for walking tours"],
      imageWidth: 1400,
      imageHeight: 933,
      learnMoreUrl: "hotel-apo-view.html",
      bookUrl: "booking.html#hotels"
    },
    {
      name: "Pearl Farm Beach Resort",
      location: "Samal Island, Davao Gulf",
      summary: "A celebrated island retreat with overwater-style villas, clear water views, and curated resort experiences.",
      image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1400",
      highlights: ["Island-resort atmosphere", "Private beach settings", "Best for leisure escapes"],
      imageWidth: 1400,
      imageHeight: 933,
      learnMoreUrl: "hotel-pearl-farm.html",
      bookUrl: "booking.html#hotels"
    }
  ];

  if (!stays.length) {
    grid.innerHTML = '<article class="stay-card-empty"><p>No featured stays are available right now. Please check back shortly.</p></article>';
    return;
  }

  grid.innerHTML = stays
    .map(
      (hotel) => `
      <article class="stay-card">
        <img class="stay-card-image" src="${hotel.image}" alt="${hotel.name}" width="${hotel.imageWidth}" height="${hotel.imageHeight}" loading="lazy" decoding="async" />
        <div class="stay-card-body">
          <p class="stay-card-location">${hotel.location}</p>
          <h3 class="stay-card-title">${hotel.name}</h3>
          <p class="stay-card-text">${hotel.summary}</p>
          <ul class="stay-card-highlights">
            ${hotel.highlights.map((highlight) => `<li>${highlight}</li>`).join("")}
          </ul>
          <div class="stay-card-actions">
            <a class="stay-btn" href="${hotel.learnMoreUrl}" aria-label="Learn more about ${hotel.name}">Learn More</a>
            <a class="stay-btn book" href="${hotel.bookUrl}" aria-label="Book ${hotel.name}">Book</a>
          </div>
        </div>
      </article>
    `
    )
    .join("");
})();

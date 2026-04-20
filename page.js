if (window.BookingApi && typeof window.BookingApi.attachChatWidget === "function") {
  window.BookingApi.attachChatWidget({
    cityResolver: () => "Davao",
    bookingPath: "booking.html"
  });
}

if (window.BookingApi && typeof window.BookingApi.initWhiteLabelAdmin === "function") {
  window.BookingApi.initWhiteLabelAdmin();
}

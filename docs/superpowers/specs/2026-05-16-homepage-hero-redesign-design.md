# ImagineDavao Homepage Hero Redesign

## Goal

Replace the plain two-column homepage hero with a cinematic, Davao-specific first impression anchored on Mount Apo while preserving the existing static-first architecture and carousel behavior.

## Approved Direction

The selected direction is "Cinematic Mount Apo." The hero should feel like an editorial destination campaign: a full-width real Davao image, text layered over the scene, strong travel copy, and compact signals for the trip mix of mountain, market, and island.

## Scope

Modify only the homepage hero path:

- `index.html` for small hero markup additions.
- `styles.css` for the redesigned hero layout, responsive behavior, and motion.
- `script.js` for the Davao hero story copy and image data.

Do not change the Davao Region map SVG, booking page behavior, chat widget behavior, shared footer, auth controls, or unrelated pages.

## Design Details

The first hero story uses a royalty-free Wikimedia Commons Mount Apo image as the primary visual. The image appears full-bleed within the homepage first viewport, with a readable overlay, oversized display headline, destination chips, and a compact hero panel for the active DVO stamp. Supporting copy should be client-facing and avoid placeholder language.

The `heroTitle`, `heroText`, `heroCta`, `heroImage`, `heroStamp`, and `carouselToggle` elements remain in place because `script.js` updates them. The visible CTA continues to link to the on-site booking flow or homepage sections instead of external affiliate pages.

## Accessibility and Responsiveness

The hero image keeps meaningful alt text. Text contrast must remain readable over the image. Focus styles already defined in `styles.css` must continue to apply to CTA links and buttons. The layout must not overlap on mobile, and text must fit inside its containers without viewport-width font scaling.

## Validation

Run:

- `node --check script.js`
- `node --check booking.js`
- `node --check server.js`

Then load `http://127.0.0.1:8080/` and confirm the homepage shows the Mount Apo-led hero, the carousel button changes the story without broken images, the booking CTA remains on-site, and the map/chat surfaces still appear below the hero.


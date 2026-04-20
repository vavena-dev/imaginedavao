# AGENTS.md

## Project Overview

This project is a static-first tourism web app for **ImagineDavao**, under the parent brand **ImaginePhilippines**.

Core goals:
- Showcase Davao travel content with strong visual design.
- Keep the codebase reusable for other Philippine cities.
- Provide an on-site booking demo flow (flights, hotels, experiences, cars).
- Preserve a client-presentation-ready UI (no placeholder language).

## Tech Stack

- HTML/CSS/Vanilla JS
- Node.js HTTP server (`server.js`) for local serving + simple API endpoints
- No framework build step

## Local Run

- Install deps: `npm install`
- Start server: `npm start`
- Default URL: `http://127.0.0.1:8080`

## Key Files

- `index.html`: Landing page + regional map section
- `styles.css`: Main landing styles
- `script.js`: Landing page data/render logic
- `booking.html`: Booking UI page
- `booking.js`: Booking page interactions + demo results
- `server.js`: Static file server + booking/chat helper endpoints
- `api-client.js`: Chat widget + white-label controls
- `page.js`, `page.css`: Shared inner-page behavior/styles
- `*.html` (things/events/eat/stay/guides/districts/deals/partner/now): Inner pages

## Branding Rules (Important)

- Parent brand must remain: **ImaginePhilippines**
- City module must remain: **ImagineDavao** for this repo
- Do not reintroduce old brand names
- Keep copy presentation-ready and client-facing

## Map Rules (Important)

The map in `index.html` is a Davao Region map with real boundary-derived shapes.

- Keep existing region keys:
  - `davao_city`
  - `davao_del_norte`
  - `davao_de_oro`
  - `davao_oriental`
  - `davao_del_sur`
  - `davao_occidental`
- `Davao Gulf` is visual context only:
  - non-clickable
  - non-highlightable
- Maintain `id="mapLabel-<region>"` label IDs used by `script.js`
- If editing SVG order, ensure `Davao City` label remains visible

## Booking Behavior Rules

- Booking interactions should stay on-site for demos.
- If live affiliate plumbing is unavailable, preserve working demo results UX.
- Keep tabs and forms functional:
  - Flights / Hotels / Experiences / Cars

## Image Rules

- Use free-use, relevant images for Davao content.
- Keep images contextually aligned with section topics.
- Avoid blank image states.
- Fallback image behavior via `api-client.js` should remain intact.

## UX/Content Rules

- No “placeholder” wording in user-facing copy.
- Keep all internal links working.
- Preserve fixed-position AI chat trigger behavior.

## Coding Conventions

- Keep code simple and readable; avoid overengineering.
- Prefer minimal, targeted edits over broad rewrites.
- Maintain existing IDs/classes used by JS.
- Validate JS syntax after edits:
  - `node --check script.js`
  - `node --check booking.js`
  - `node --check server.js`

## Agent Checklist Before Finishing

1. Brand strings still correct (`ImaginePhilippines`, `ImagineDavao`)
2. Map interactions still work (click + prev/next + label updates)
3. No broken links on landing and inner pages
4. No empty image areas
5. Booking and chat UI still initialize
6. JS syntax checks pass

# ExecPlans

When writing complex features or significant refactors, use an ExecPlan (as described in .agent/PLANS.md) from design to implementation.
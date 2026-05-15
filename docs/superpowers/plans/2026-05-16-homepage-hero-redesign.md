# ImagineDavao Homepage Hero Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the plain homepage hero with a cinematic Mount Apo-led destination hero while preserving current homepage behavior.

**Architecture:** This is a static HTML/CSS/vanilla JS change. `index.html` owns the hero DOM, `styles.css` owns layout and visual treatment, and `script.js` owns carousel story data.

**Tech Stack:** HTML, CSS, vanilla JavaScript, local Node syntax checks.

---

## Files

- Modify: `index.html`
- Modify: `styles.css`
- Modify: `script.js`
- Verify: `booking.js`
- Verify: `server.js`

## Tasks

- [x] Update `index.html` hero markup with destination chips and a compact visual metadata layer while preserving existing IDs used by `script.js`.
- [x] Replace the old two-column hero CSS with a full-width responsive editorial image hero.
- [x] Update the Davao `heroStories` copy and images in `script.js`, using Mount Apo as the first story and preserving carousel fields.
- [x] Run JavaScript syntax checks: `node --check script.js`, `node --check booking.js`, and `node --check server.js`.
- [x] Browser-check `http://127.0.0.1:8080/` for hero rendering, carousel image changes, booking CTA, and visible lower-page content.

## Acceptance

The homepage first screen should immediately show a strong Davao visual, led by Mount Apo, with readable campaign copy and working CTAs. Clicking "Next Story" should still rotate stories. No map labels, booking tabs, chat widget IDs, or shared navigation behavior should be broken.

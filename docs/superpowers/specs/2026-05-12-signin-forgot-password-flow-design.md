# Sign-In and Forgot Password Flow Design

Date: 2026-05-12
Project: ImagineDavao (`/Users/vavena/Desktop/oracle/AI/imaginedavao`)

## Goal

Align auth UX to standard expectations and site branding:
- `Forgot your password?` should route to a dedicated page.
- Sign-in visual style should match the existing ImagineDavao theme.
- Reset password remains a standalone final step.

## Approved Direction

Option 1 approved:
1. Add dedicated `forgot-password.html` page for reset-link request.
2. Keep `reset-password.html` as final token-based new-password page.
3. Remove inline forgot-password card from sign-in.

## UX Flow

1. User opens `signin.html`.
2. User clicks `Forgot your password?`.
3. App routes to `forgot-password.html`.
4. User enters email and requests reset link.
5. User receives email and opens `reset-password.html` with token.
6. User sets new password and returns to sign-in.

## Scope

### Pages and scripts
- Update `signin.html` and `signin.js`:
  - Remove inline reset card and toggle behavior.
  - Convert forgot-password action to navigation link.
- Add `forgot-password.html` and `forgot-password.js`:
  - Email input + send reset action.
  - Status messaging with `aria-live`.
- Keep `reset-password.html` and `reset-password.js` behavior intact.

### Styling
- Update `account.css` auth-specific styles:
  - Remove off-theme accent treatments from sign-in surface.
  - Ensure fonts and colors use the existing site tokens and typographic system.
  - Style forgot-password action in the same control language as existing auth buttons.

## Accessibility and behavior

- Maintain explicit labels for all fields.
- Maintain status messages (`aria-live="polite"`).
- Maintain keyboard usage and Enter submission behavior.
- Keep text-based error/success messages (not color-only).

## API/Data

No backend contract change.
- Continue using `BookingApi.requestPasswordReset(email, redirectTo)`.
- Continue redirect target: `/reset-password.html`.

## Validation plan

- JS syntax checks:
  - `node --check signin.js`
  - `node --check forgot-password.js`
  - `node --check reset-password.js`
  - `node --check server.js`
- Web-guidelines quick audit on edited auth files.
- Browser verification of:
  - Link navigation to dedicated page
  - Reset request status behavior
  - Visual consistency across auth pages

## Out of scope

- Adding new auth providers beyond current Google OAuth path.
- Reworking backend auth token lifecycle.
- Introducing multi-step reset on sign-in page itself.

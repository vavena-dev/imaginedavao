# Admin ACL and Partner Income System

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

This plan follows `.agent/PLANS.md` in this repository.

## Purpose / Big Picture

ImagineDavao needs a clear access boundary between public partner users and the internal CMS. After this change, only users with the `admin` role can see and open the ADMIN CMS link, and the CMS item API no longer exposes draft/admin rows to non-admin callers. The same work also establishes a partner income stream: partner programs are stored in a database-shaped table, exposed through a small API, and rendered on the public partner page and partner account dashboard.

## Progress

- [x] (2026-05-16) Inspected the existing auth, CMS, booking inventory, partner, Supabase migration, and Vercel API-limit patterns.
- [x] (2026-05-16) Chose an additive design that preserves the current Supabase-style API boundary and keeps admin access centralized.
- [x] (2026-05-16) Added ACL helper code and included access summaries in auth responses.
- [x] (2026-05-16) Required admin access for all `/api/cms/items` methods, including `GET`.
- [x] (2026-05-16) Added the partner program database migration, fallback data, store, and API route.
- [x] (2026-05-16) Rendered partner programs on `partner.html` and `account.html`.
- [x] (2026-05-16) Validated JavaScript syntax, API function count, partner API output, CMS unauthorized response, and browser ACL visibility.

## Surprises & Discoveries

- Observation: The admin page front-end already redirects non-admin users, but `/api/cms/items` permitted unauthenticated `GET` requests with `includeDrafts: true`.
  Evidence: `api/cms/items.js` listed CMS rows before calling `hasAdminAccess(req)`.

- Observation: This local environment has Supabase enabled, but the new `partner_programs` table has not been applied yet.
  Evidence: `/api/partners` initially returned `Could not find the table 'public.partner_programs' in the schema cache`; the store now falls back to `data/partner_programs.json` only for missing-table/schema-cache errors.

- Observation: The existing white-label `Brand Admin` launcher appeared on the public partner page for signed-out users.
  Evidence: Browser verification showed the launcher before it was gated; after the ACL update, `#wlAdminLaunch:visible` count is `0` for a signed-out partner-page visit.

## Decision Log

- Decision: Treat `admin` as the only role that can access the CMS today, while modeling page-specific CMS roles in the database migration for future expansion.
  Rationale: The user asked for admin-only access now and more granular page roles later. This keeps the immediate behavior simple and leaves a clear database path for dedicated page roles.
  Date/Author: 2026-05-16 / Codex

- Decision: Add one public `/api/partners` endpoint instead of several partner admin endpoints.
  Rationale: The app has a Vercel free-tier API limit of 12 functions. The repo currently has 11 enabled API files, so one endpoint fits the cap and keeps the partner income stream demonstrable without creating an oversized admin system.
  Date/Author: 2026-05-16 / Codex

- Decision: Use `partner_programs` as the first partner revenue table and keep lead/subscription workflows for a later phase.
  Rationale: A partner page normally sells packaged placements, sponsorships, affiliate/referral opportunities, and lead generation. A program catalog is the smallest useful table for presenting, pricing, and evolving those products.
  Date/Author: 2026-05-16 / Codex

- Decision: Keep a local fallback for partner programs when Supabase is configured but the new migration has not been applied.
  Rationale: The static-first demo should remain usable locally, while Supabase-backed deployments can switch to the table simply by applying the migration.
  Date/Author: 2026-05-16 / Codex

## Outcomes & Retrospective

Implemented. Non-admin visitors do not see the ADMIN CMS link or the Brand Admin launcher, direct `/admin` navigation redirects to sign-in, and unauthenticated `/api/cms/items` returns `401`. The partner page and account dashboard both render four partner income-stream programs from `/api/partners`, backed by Supabase when the migration exists and by local fallback data otherwise.

## Context and Orientation

The app is a static-first tourism site served by `server.js`. Public pages load static HTML/CSS/JS and call local `/api/*` endpoints. Auth is implemented with Supabase Auth helpers in `lib/auth.js` and browser session state in `api-client.js`. The current CMS admin UI is `admin.html`, `admin.css`, and `admin.js`; CMS reads and writes go through `api/cms/items.js` and `api/cms/content.js`. Public partner content currently lives in `partner.html`, while signed-in partner profile UI lives in `account.html` and `account.js`.

The term ACL means access control list: a list of resources, such as `page:admin` or `nav:admin_cms`, and the roles allowed to use them. In this plan, `admin` can access everything, `partner` can access partner/account surfaces, and future page editor roles can be assigned per CMS page without changing the public page layout.

## Plan of Work

First, add a small shared ACL helper in `lib/access-control.js`. It will normalize roles, describe the admin CMS resource, and produce an access summary used by auth responses. Then update `lib/auth.js`, `api/auth/login.js`, `api/auth/signup.js`, and `api/auth/profile.js` so returned users include an `access` object. Update `api-client.js` and `admin.js` to use that access summary while preserving the existing direct `role === "admin"` fallback.

Second, secure CMS admin reads by moving the admin check in `api/cms/items.js` ahead of the `GET` branch. Public pages continue to use `/api/cms/content`, so public content rendering is not blocked.

Third, create the partner program data foundation. Add a Supabase migration that creates `access_roles`, `access_rules`, and `partner_programs`; update the `profiles.role` check to include `partner` and future page editor roles; and seed starter partner programs. Add `data/partner_programs.json` as the local fallback source, `lib/partner-store.js` as the store adapter, and `api/partners.js` plus the local `server.js` route.

Fourth, replace the current lightweight `partner.html` with a polished partner program page and add `partner.css`/`partner.js`. The page should explain how partner pages usually work: package the offer, publish a paid placement, route clicks or leads, report performance, and renew or upsell. Add the ADMIN CMS link with ACL attributes so it remains hidden unless the user is admin. Update `account.html`, `account.css`, and `account.js` so signed-in partners can see current program opportunities.

## Concrete Steps

From `/Users/vavena/Desktop/oracle/AI/imaginedavao`, edit the files named above. Run these validation commands:

    node --check api-client.js
    node --check admin.js
    node --check account.js
    node --check partner.js
    node --check server.js
    npm run check:vercel-api-limit

If the server is already running, exercise the new endpoint with:

    curl -sS "http://127.0.0.1:8080/api/partners?city=davao"

The response should contain published partner program rows.

## Validation and Acceptance

The work is accepted when a non-admin browser session does not see an ADMIN CMS link, opening `admin` redirects or blocks unless the user is an admin, and `/api/cms/items` returns `401` for non-admin callers. The public partner page should load partner programs from `/api/partners`, and the account page should show the same income stream options. JavaScript syntax checks and the API limit check must pass.

Observed validation:

    node --check api-client.js
    node --check admin.js
    node --check account.js
    node --check partner.js
    node --check things.js
    node --check server.js
    node --check api/partners.js
    node --check lib/access-control.js
    node --check lib/partner-store.js
    node --check api/cms/items.js
    npm run check:vercel-api-limit
    [vercel-api-check] Found 12 API function files in /api (limit: 12).
    [vercel-api-check] PASS

    curl http://127.0.0.1:8081/api/partners?city=davao
    HTTP 200 with 4 programs: Featured Listing, Seasonal Campaign Feature, Affiliate Booking Row, Qualified Lead Package.

    curl http://127.0.0.1:8081/api/cms/items?city=davao&page=things&section=cards
    HTTP 401 with {"error":"Unauthorized"}.

    Browser checks:
    partner page rendered 4 partner-program cards; visible ADMIN CMS count was 0; visible Brand Admin count was 0.
    direct /admin navigation redirected to /signin?returnTo=%2Fadmin and did not show CMS controls.

## Idempotence and Recovery

The migration uses `create table if not exists` and upsert seeds where possible, so it can be rerun safely. The local fallback JSON is read-only at runtime. If Supabase is not configured, `/api/partners` still returns the fallback programs so the local demo works.

## Artifacts and Notes

No implementation artifacts have been generated yet.

## Interfaces and Dependencies

`lib/access-control.js` will export `buildAccessSummary(userOrProfile)`, `canAccessResource(userOrProfile, resourceKey)`, and `isAdminRole(userOrProfile)`. `lib/partner-store.js` will export `listPartnerPrograms(query, options)`. `api/partners.js` will support `GET /api/partners?city=davao`; `includeDrafts=true` will require admin access.

# Vercel API Function Limit Policy

This project keeps Vercel serverless API functions at a strict maximum of **12** on free tier deployments.

## Why

Vercel free tier has a serverless function cap. If we exceed it, deployments fail.

## Rule

- Keep enabled API function files under `api/**/*.js` to **12 or fewer**.
- Any extra function files must be moved to `api_disabled/**/*.js`.
- Disabled functions remain in repo and can be re-enabled later.

## Automatic Guard

Deploy build runs:

```bash
npm run vercel-build
```

Which executes:

1. `npm run api:enforce-limit`
2. `npm run check:vercel-api-limit`

If still above 12 after enforcement, build fails.

## Disable-First Priority Order

When function count is above 12, this order is used first:

1. `api/admin/booking-inventory.js`
2. `api/auth/forgot-password.js`
3. `api/auth/reset-password.js`
4. `api/auth/bookings.js`
5. `api/cms/items.js`
6. `api/booking/inventory.js`

After that, remaining functions are disabled alphabetically until count is 12.

## Commands

Status:

```bash
npm run api:functions
```

Disable specific functions:

```bash
npm run api:disable -- api/auth/forgot-password.js
```

Enable specific functions:

```bash
npm run api:enable -- api/auth/forgot-password.js
```

Enforce limit now:

```bash
npm run api:enforce-limit
```

## Re-enable Later (After Upgrade)

After you subscribe and want full APIs back:

1. Re-enable selected files from `api_disabled/`.
2. Run `npm run api:functions` to confirm count.
3. If you want to lift the guard threshold temporarily, set env var:

```bash
MAX_VERCEL_API_FUNCTIONS=20 npm run check:vercel-api-limit
```

Keep default at 12 while on free tier.

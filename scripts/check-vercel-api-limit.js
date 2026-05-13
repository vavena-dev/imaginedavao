#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const repoRoot = process.cwd();
const apiDir = path.join(repoRoot, 'api');
const maxFunctions = Number(process.env.MAX_VERCEL_API_FUNCTIONS || 12);

function walkJsFiles(dir) {
  if (!fs.existsSync(dir)) return [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(walkJsFiles(full));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.js')) {
      files.push(full);
    }
  }

  return files;
}

function toPosixRelative(absPath) {
  return path.relative(repoRoot, absPath).split(path.sep).join('/');
}

const functionFiles = walkJsFiles(apiDir)
  .map(toPosixRelative)
  .filter((file) => !file.includes('/_'))
  .sort();

const count = functionFiles.length;

console.log(`[vercel-api-check] Found ${count} API function files in /api (limit: ${maxFunctions}).`);
for (const file of functionFiles) {
  console.log(`- ${file}`);
}

if (count <= maxFunctions) {
  console.log('[vercel-api-check] PASS');
  process.exit(0);
}

console.error('[vercel-api-check] FAIL: API function count exceeds Vercel free-tier safe limit.');
console.error('[vercel-api-check] Suggested disable-first candidates:');
[
  'api/admin/booking-inventory.js',
  'api/auth/forgot-password.js',
  'api/auth/reset-password.js',
  'api/auth/bookings.js',
  'api/cms/items.js',
  'api/booking/inventory.js'
].forEach((name) => console.error(`- ${name}`));
console.error('[vercel-api-check] Move extra functions to api_disabled/ (or merge endpoints) before deploy.');

process.exit(1);

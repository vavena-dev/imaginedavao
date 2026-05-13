#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const repoRoot = process.cwd();
const apiDir = path.join(repoRoot, 'api');
const disabledDir = path.join(repoRoot, 'api_disabled');
const maxFunctions = Number(process.env.MAX_VERCEL_API_FUNCTIONS || 12);
const command = process.argv[2] || 'status';
const inputTargets = process.argv.slice(3);

const disablePriority = [
  'api/admin/booking-inventory.js',
  'api/auth/forgot-password.js',
  'api/auth/reset-password.js',
  'api/auth/bookings.js',
  'api/cms/items.js',
  'api/booking/inventory.js'
];

function toPosixRelative(absPath) {
  return path.relative(repoRoot, absPath).split(path.sep).join('/');
}

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

function listFunctions(rootDir) {
  return walkJsFiles(rootDir)
    .map(toPosixRelative)
    .filter((file) => !file.includes('/_'))
    .sort();
}

function printStatus() {
  const enabled = listFunctions(apiDir);
  const disabled = listFunctions(disabledDir);

  console.log(`[api-manager] Enabled API functions: ${enabled.length} (limit: ${maxFunctions})`);
  enabled.forEach((f) => console.log(`- ${f}`));

  console.log(`[api-manager] Disabled API functions: ${disabled.length}`);
  disabled.forEach((f) => console.log(`- ${f}`));

  if (enabled.length <= maxFunctions) {
    console.log('[api-manager] STATUS OK');
    return 0;
  }

  console.error('[api-manager] STATUS FAIL: enabled API functions exceed configured limit.');
  return 1;
}

function normalizeTarget(raw, fromDirName) {
  let t = raw.replace(/^\.\//, '');
  if (t.startsWith('api/')) return t;
  if (t.startsWith('api_disabled/')) {
    return fromDirName === 'api' ? t.replace(/^api_disabled\//, 'api/') : t;
  }
  return `${fromDirName}/${t}`;
}

function ensureParentDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function moveOne(sourceRel, destinationRel) {
  const sourceAbs = path.join(repoRoot, sourceRel);
  const destinationAbs = path.join(repoRoot, destinationRel);

  if (!fs.existsSync(sourceAbs)) {
    console.error(`[api-manager] Not found: ${sourceRel}`);
    return false;
  }

  ensureParentDir(destinationAbs);
  fs.renameSync(sourceAbs, destinationAbs);
  console.log(`[api-manager] moved ${sourceRel} -> ${destinationRel}`);
  return true;
}

function disableTargets(targets) {
  if (!targets.length) {
    console.error('[api-manager] No targets provided. Usage: disable <api/path.js>...');
    return 1;
  }

  let ok = true;
  for (const raw of targets) {
    const sourceRel = normalizeTarget(raw, 'api');
    if (!sourceRel.startsWith('api/')) {
      console.error(`[api-manager] Invalid disable target: ${raw}`);
      ok = false;
      continue;
    }
    const destinationRel = sourceRel.replace(/^api\//, 'api_disabled/');
    if (!moveOne(sourceRel, destinationRel)) ok = false;
  }

  return ok ? 0 : 1;
}

function enableTargets(targets) {
  if (!targets.length) {
    console.error('[api-manager] No targets provided. Usage: enable <api/path.js>...');
    return 1;
  }

  let ok = true;
  for (const raw of targets) {
    const normalized = normalizeTarget(raw, 'api_disabled');
    const sourceRel = normalized.startsWith('api_disabled/') ? normalized : normalized.replace(/^api\//, 'api_disabled/');
    const destinationRel = sourceRel.replace(/^api_disabled\//, 'api/');
    if (!moveOne(sourceRel, destinationRel)) ok = false;
  }

  return ok ? 0 : 1;
}

function enforceLimit() {
  const enabled = new Set(listFunctions(apiDir));
  if (enabled.size <= maxFunctions) {
    console.log('[api-manager] enforce: already within limit.');
    return 0;
  }

  let overflow = enabled.size - maxFunctions;
  console.log(`[api-manager] enforce: need to disable ${overflow} function(s) to reach limit ${maxFunctions}.`);

  const candidates = [];
  for (const item of disablePriority) {
    if (enabled.has(item)) candidates.push(item);
  }

  for (const item of Array.from(enabled).sort()) {
    if (!candidates.includes(item)) candidates.push(item);
  }

  let disabledCount = 0;
  for (const sourceRel of candidates) {
    if (overflow <= 0) break;
    const destinationRel = sourceRel.replace(/^api\//, 'api_disabled/');
    if (moveOne(sourceRel, destinationRel)) {
      overflow -= 1;
      disabledCount += 1;
    }
  }

  if (overflow > 0) {
    console.error('[api-manager] enforce: unable to disable enough functions.');
    return 1;
  }

  console.log(`[api-manager] enforce: disabled ${disabledCount} function(s).`);
  return printStatus();
}

fs.mkdirSync(disabledDir, { recursive: true });

let code = 0;
if (command === 'status') {
  code = printStatus();
} else if (command === 'disable') {
  code = disableTargets(inputTargets);
} else if (command === 'enable') {
  code = enableTargets(inputTargets);
} else if (command === 'enforce') {
  code = enforceLimit();
} else {
  console.error('[api-manager] Unknown command. Use: status | disable | enable | enforce');
  code = 1;
}

process.exit(code);

#!/usr/bin/env node
/**
 * Prepare Ffw2023 bundled assets (project-saral pattern):
 * - Convert 2023 classic images → WebP (same dimensions, q85)
 * - Copy fonts, JSON, iCal into src/webparts/ffw2023/assets/
 * - Emit ffw2023AssetMap.ts with webpack require() entries
 */
import { execSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SPFX_ROOT = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(SPFX_ROOT, '..');
const CLASSIC_2023 = path.join(REPO_ROOT, 'DBS-FFW-classicsite/2023');
const ASSETS_ROOT = path.join(SPFX_ROOT, 'src/webparts/ffw2023/assets');
const IMG_OUT = path.join(ASSETS_ROOT, 'img');
const ICAL_OUT = path.join(ASSETS_ROOT, 'ical');
const DATA_OUT = path.join(ASSETS_ROOT, 'data');
const LOTTIE_OUT = path.join(ASSETS_ROOT, 'lottie');
const FONTS_OUT = path.join(ASSETS_ROOT, 'fonts/opensans');
const MAP_OUT = path.join(ASSETS_ROOT, 'ffw2023AssetMap.ts');

const WEBP_QUALITY = 85;
const IMAGE_EXT = /\.(png|jpe?g)$/i;

function hasCwebp() {
  return spawnSync('cwebp', ['-version'], { stdio: 'ignore' }).status === 0;
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function walkFiles(dir, predicate) {
  const results = [];
  if (!fs.existsSync(dir)) {
    return results;
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkFiles(full, predicate));
    } else if (predicate(full)) {
      results.push(full);
    }
  }

  return results;
}

function toPosix(p) {
  return p.split(path.sep).join('/');
}

function classicPublicPath(absPath, publicRoot) {
  const rel = path.relative(publicRoot, absPath);
  return `public/${toPosix(rel)}`;
}

function convertImage(src, destWebp) {
  ensureDir(path.dirname(destWebp));

  if (hasCwebp()) {
    const result = spawnSync(
      'cwebp',
      ['-q', String(WEBP_QUALITY), '-mt', src, '-o', destWebp],
      { encoding: 'utf8' }
    );

    if (result.status !== 0) {
      throw new Error(`cwebp failed for ${src}: ${result.stderr || result.stdout}`);
    }

    return 'webp';
  }

  copyFile(src, destWebp.replace(/\.webp$/i, path.extname(src)));
  console.warn(`cwebp missing — copied original for ${src}`);
  return 'copy';
}

function escapeTsString(value) {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function buildRequirePath(fromAssetsRoot, targetPath) {
  const rel = toPosix(path.relative(fromAssetsRoot, targetPath));
  return './' + rel;
}

/** OPC-safe bundled filename; classic key keeps original name (incl. spaces). */
function sanitizeLottieFilename(name) {
  return name.replace(/\s+/g, '-');
}

function main() {
  const imagesRoot = path.join(CLASSIC_2023, 'public/images');
  const icalRoot = path.join(CLASSIC_2023, 'public/iCal-invites');
  const lottieRoot = path.join(CLASSIC_2023, 'public/json');
  const fontsRoot = path.join(REPO_ROOT, 'DBS-FFW-classicsite/2025/public/css/opensans');

  console.log('Preparing Ffw2023 assets…');

  if (fs.existsSync(ASSETS_ROOT)) {
    fs.rmSync(ASSETS_ROOT, { recursive: true, force: true });
  }

  ensureDir(IMG_OUT);
  ensureDir(ICAL_OUT);
  ensureDir(DATA_OUT);
  ensureDir(LOTTIE_OUT);
  ensureDir(FONTS_OUT);

  const imageEntries = [];
  const icalEntries = [];
  const lottieEntries = [];

  for (const src of walkFiles(imagesRoot, (f) => IMAGE_EXT.test(f))) {
    const rel = path.relative(imagesRoot, src);
    const destWebp = path.join(IMG_OUT, rel.replace(IMAGE_EXT, '.webp'));
    const mode = convertImage(src, destWebp);
    const classicKey = classicPublicPath(src, path.join(CLASSIC_2023, 'public'));
    const bundledPath = mode === 'webp' ? destWebp : destWebp.replace(IMAGE_EXT, path.extname(src));
    imageEntries.push({ classicKey, bundledPath });
  }

  for (const src of walkFiles(icalRoot, (f) => f.endsWith('.ics'))) {
    const rel = path.relative(icalRoot, src);
    const dest = path.join(ICAL_OUT, rel);
    copyFile(src, dest);
    const classicKey = classicPublicPath(src, path.join(CLASSIC_2023, 'public'));
    icalEntries.push({ classicKey, bundledPath: dest });
  }

  for (const name of ['participants.json', 'events.json', 'post-event.json']) {
    copyFile(path.join(CLASSIC_2023, name), path.join(DATA_OUT, name));
  }

  for (const src of walkFiles(lottieRoot, (f) => f.endsWith('.json'))) {
    const baseName = path.basename(src);
    const safeName = sanitizeLottieFilename(baseName);
    const dest = path.join(LOTTIE_OUT, safeName);
    copyFile(src, dest);
    const classicKey = `public/json/${baseName}`;
    lottieEntries.push({ classicKey, bundledPath: dest });
  }

  const fontFiles = [
    'OpenSans-Bold.woff2',
    'OpenSans-SemiBold.woff2',
    'OpenSans-Medium.woff2',
    'OpenSans-Regular.woff2',
    'OpenSans-Light.woff2',
    'OpenSans-Bold.woff',
    'OpenSans-SemiBold.woff',
    'OpenSans-Regular.woff',
    'OpenSans-Medium.woff',
    'OpenSans-Light.woff'
  ];

  for (const font of fontFiles) {
    const src = path.join(fontsRoot, font);
    if (fs.existsSync(src)) {
      copyFile(src, path.join(FONTS_OUT, font));
    }
  }

  const imageMapLines = imageEntries
    .sort((a, b) => a.classicKey.localeCompare(b.classicKey))
    .map(({ classicKey, bundledPath }) => {
      const req = buildRequirePath(ASSETS_ROOT, bundledPath);
      return `  '${escapeTsString(classicKey)}': require('${escapeTsString(req)}') as string`;
    });

  const icalMapLines = icalEntries
    .sort((a, b) => a.classicKey.localeCompare(b.classicKey))
    .map(({ classicKey, bundledPath }) => {
      const req = buildRequirePath(ASSETS_ROOT, bundledPath);
      return `  '${escapeTsString(classicKey)}': require('${escapeTsString(req)}') as string`;
    });

  const lottieMapLines = lottieEntries
    .sort((a, b) => a.classicKey.localeCompare(b.classicKey))
    .map(({ classicKey, bundledPath }) => {
      const req = buildRequirePath(ASSETS_ROOT, bundledPath);
      return `  '${escapeTsString(classicKey)}': require('${escapeTsString(req)}')`;
    });

  const mapSource = `/* eslint-disable @typescript-eslint/no-var-requires */
/* Auto-generated by scripts/prepare-ffw2023-assets.mjs — do not edit manually */

const FFW2023_IMAGE_MAP: Record<string, string> = {
${imageMapLines.join(',\n')}
};

const FFW2023_ICAL_MAP: Record<string, string> = {
${icalMapLines.join(',\n')}
};

const FFW2023_LOTTIE_MAP: Record<string, object> = {
${lottieMapLines.join(',\n')}
};

/** Resolve classic \`public/images/...\` path to bundled WebP URL. */
export function resolveFfw2023Image(classicPath: string): string {
  const normalized = classicPath.replace(/\\\\/g, '/');
  const url = FFW2023_IMAGE_MAP[normalized];

  if (!url) {
    console.warn('[Ffw2023] Missing bundled image for:', normalized);
    return normalized;
  }

  return url;
}

/** Resolve classic \`public/iCal-invites/...\` path to bundled .ics URL. */
export function resolveFfw2023Ical(classicPath: string): string {
  const normalized = classicPath.replace(/\\\\/g, '/');
  const url = FFW2023_ICAL_MAP[normalized];

  if (!url) {
    console.warn('[Ffw2023] Missing bundled iCal for:', normalized);
    return normalized;
  }

  return url;
}

/** Bundled Lottie animation data for hero decorations. */
export function getFfw2023LottieAnimation(classicPath: string): object | undefined {
  const normalized = classicPath.replace(/\\\\/g, '/');
  return FFW2023_LOTTIE_MAP[normalized];
}

/** Resolve any classic public asset path (images or iCal). */
export function resolveFfw2023Asset(classicPath: string): string {
  const normalized = classicPath.replace(/\\\\/g, '/');

  if (normalized.indexOf('public/iCal-invites/') === 0) {
    return resolveFfw2023Ical(normalized);
  }

  if (normalized.indexOf('public/images/') === 0) {
    return resolveFfw2023Image(normalized);
  }

  return normalized;
}
`;

  fs.writeFileSync(MAP_OUT, mapSource, 'utf8');

  console.log(`Images: ${imageEntries.length} → WebP (q${WEBP_QUALITY})`);
  console.log(`iCal: ${icalEntries.length} copied`);
  console.log(`Lottie: ${lottieEntries.length} copied`);
  console.log(`Asset map: ${MAP_OUT}`);
}

main();

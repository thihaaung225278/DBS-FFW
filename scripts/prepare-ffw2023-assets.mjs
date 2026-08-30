#!/usr/bin/env node
/**
 * Prepare Ffw2023 bundled assets (optimized):
 * - Convert 2023 classic images → WebP (resize oversized, q78)
 * - Copy woff2 fonts, JSON, Lottie into src/webparts/ffw2023/assets/
 * - Stage iCal invites for SiteAssets upload (not bundled in sppkg)
 * - Emit ffw2023AssetMap.ts with webpack require() entries (images + lottie only)
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SPFX_ROOT = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(SPFX_ROOT, '..');
const CLASSIC_2023 = path.join(REPO_ROOT, 'DBS-FFW-classicsite/2023');
const ASSETS_ROOT = path.join(SPFX_ROOT, 'src/webparts/ffw2023/assets');
const IMG_OUT = path.join(ASSETS_ROOT, 'img');
const DATA_OUT = path.join(ASSETS_ROOT, 'data');
const LOTTIE_OUT = path.join(ASSETS_ROOT, 'lottie');
const FONTS_OUT = path.join(ASSETS_ROOT, 'fonts/opensans');
const ICAL_STAGING = path.join(SPFX_ROOT, 'sharepoint/siteassets-staging/FFW2023/iCal-invites');
const MAP_OUT = path.join(ASSETS_ROOT, 'ffw2023AssetMap.ts');

const WEBP_QUALITY = 78;
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

function getImageMaxWidth(relPath) {
  const p = relPath.replace(/\\/g, '/').toLowerCase();

  if (p.includes('/gallery/') || p.includes('/gameshow/')) {
    return 1600;
  }

  if (p.includes('/10jul/') || p.includes('/17jul/') || p.includes('/4july/')) {
    return 1600;
  }

  if (p.includes('btn_') || p.includes('dropdown') || p.includes('star.webp') || p.includes('p-logo')) {
    return 800;
  }

  if (p.includes('team') || p.includes('highlight') || p.includes('prize')) {
    return 1200;
  }

  return 1920;
}

function readImageWidth(src) {
  const sips = spawnSync('sips', ['-g', 'pixelWidth', src], { encoding: 'utf8' });
  if (sips.status !== 0) {
    return undefined;
  }

  const match = sips.stdout.match(/pixelWidth:\s*(\d+)/);
  return match ? Number(match[1]) : undefined;
}

function convertImage(src, destWebp, relFromImagesRoot) {
  ensureDir(path.dirname(destWebp));

  if (hasCwebp()) {
    const maxWidth = getImageMaxWidth(relFromImagesRoot);
    const currentWidth = readImageWidth(src);
    const args = ['-q', String(WEBP_QUALITY), '-mt'];

    if (currentWidth && currentWidth > maxWidth) {
      args.push('-resize', String(maxWidth), '0');
    }

    args.push(src, '-o', destWebp);

    const result = spawnSync('cwebp', args, { encoding: 'utf8' });
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

function sanitizeLottieFilename(name) {
  return name.replace(/\s+/g, '-');
}

function stageIcalFiles(icalRoot) {
  if (fs.existsSync(ICAL_STAGING)) {
    fs.rmSync(ICAL_STAGING, { recursive: true, force: true });
  }

  let count = 0;
  for (const src of walkFiles(icalRoot, (f) => f.endsWith('.ics'))) {
    const rel = path.relative(icalRoot, src);
    copyFile(src, path.join(ICAL_STAGING, rel));
    count++;
  }

  return count;
}

function main() {
  const imagesRoot = path.join(CLASSIC_2023, 'public/images');
  const icalRoot = path.join(CLASSIC_2023, 'public/iCal-invites');
  const lottieRoot = path.join(CLASSIC_2023, 'public/json');
  const fontsRoot = path.join(REPO_ROOT, 'DBS-FFW-classicsite/2025/public/css/opensans');

  console.log('Preparing Ffw2023 assets (optimized)…');

  if (fs.existsSync(ASSETS_ROOT)) {
    for (const entry of fs.readdirSync(ASSETS_ROOT, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        fs.rmSync(path.join(ASSETS_ROOT, entry.name), { recursive: true, force: true });
      }
    }
  }

  ensureDir(IMG_OUT);
  ensureDir(DATA_OUT);
  ensureDir(LOTTIE_OUT);
  ensureDir(FONTS_OUT);

  const imageEntries = [];
  const lottieEntries = [];

  for (const src of walkFiles(imagesRoot, (f) => IMAGE_EXT.test(f))) {
    const rel = path.relative(imagesRoot, src);
    const destWebp = path.join(IMG_OUT, rel.replace(IMAGE_EXT, '.webp'));
    const mode = convertImage(src, destWebp, rel);
    const classicKey = classicPublicPath(src, path.join(CLASSIC_2023, 'public'));
    const bundledPath = mode === 'webp' ? destWebp : destWebp.replace(IMAGE_EXT, path.extname(src));
    imageEntries.push({ classicKey, bundledPath });
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
    'OpenSans-Light.woff2'
  ];

  for (const font of fontFiles) {
    const src = path.join(fontsRoot, font);
    if (fs.existsSync(src)) {
      copyFile(src, path.join(FONTS_OUT, font));
    }
  }

  const icalCount = stageIcalFiles(icalRoot);

  const imageMapLines = imageEntries
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

/** Bundled Lottie animation data for hero decorations. */
export function getFfw2023LottieAnimation(classicPath: string): object | undefined {
  const normalized = classicPath.replace(/\\\\/g, '/');
  return FFW2023_LOTTIE_MAP[normalized];
}

/** Resolve bundled image paths only (iCal uses SiteAssets — see ffw2023SiteAssetUrls). */
export function resolveFfw2023Asset(classicPath: string): string {
  const normalized = classicPath.replace(/\\\\/g, '/');

  if (normalized.indexOf('public/images/') === 0) {
    return resolveFfw2023Image(normalized);
  }

  return normalized;
}
`;

  fs.writeFileSync(MAP_OUT, mapSource, 'utf8');

  console.log(`Images: ${imageEntries.length} → WebP (q${WEBP_QUALITY}, resized)`);
  console.log(`iCal: ${icalCount} staged → ${ICAL_STAGING}`);
  console.log(`Lottie: ${lottieEntries.length} copied`);
  console.log(`Fonts: ${fontFiles.length} woff2 only`);
  console.log(`Asset map: ${MAP_OUT}`);
}

main();

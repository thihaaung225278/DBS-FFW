#!/usr/bin/env node
/**
 * Prepare Ffw2024 bundled assets (live 2024/index.aspx surface only):
 * - Convert stills → WebP (q78, resize oversized highlights)
 * - Copy gallery GIF as-is (do not convert — animation)
 * - Copy Condensed woff2 + events.json
 * - Emit ffw2024AssetMap.ts
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SPFX_ROOT = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(SPFX_ROOT, '..');
const CLASSIC_2024 = path.join(REPO_ROOT, 'DBS-FFW-classicsite/2024');
const ASSETS_ROOT = path.join(SPFX_ROOT, 'src/webparts/ffw2024/assets');
const IMG_OUT = path.join(ASSETS_ROOT, 'img');
const DATA_OUT = path.join(ASSETS_ROOT, 'data');
const FONTS_OUT = path.join(ASSETS_ROOT, 'fonts/opensans-condensed');
const MAP_OUT = path.join(ASSETS_ROOT, 'ffw2024AssetMap.ts');

const WEBP_QUALITY = 78;
const IMAGE_EXT = /\.(png|jpe?g)$/i;
const LIVE_STILLS = [
  'public/images/2024/logo.png',
  'public/images/2024/Highlights/highlight-1.jpg',
  'public/images/2024/Highlights/highlight-2.jpg',
  'public/images/2024/Highlights/highlight-3.jpg',
  'public/images/2024/play-icon.png',
  'public/images/2024/Frame-dd.png',
  'public/images/2024/clock.png',
  'public/images/2024/location.png'
];
const LIVE_GIF = 'public/images/2024/LF Carnival gif carousel x2.gif';
/** Text/icon graphic — copy PNG (do not WebP; q78 softens type). */
const LIVE_PNG_COPY = ['public/images/2024/see-it.png'];

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

function toPosix(p) {
  return p.split(path.sep).join('/');
}

function getImageMaxWidth(relPath) {
  const p = relPath.replace(/\\/g, '/').toLowerCase();

  if (p.includes('/highlights/') || p.includes('highlight-')) {
    return 1600;
  }

  if (p.includes('play-icon') || p.includes('frame-dd') || p.includes('clock') || p.includes('location')) {
    return 800;
  }

  return 1920;
}

function readImageWidth(src) {
  const result = spawnSync('sips', ['-g', 'pixelWidth', src], { encoding: 'utf8' });
  if (result.status !== 0) {
    return undefined;
  }

  const match = result.stdout.match(/pixelWidth:\s*(\d+)/);
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

function classicToAbs(classicKey) {
  return path.join(CLASSIC_2024, classicKey);
}

function main() {
  console.log('Preparing Ffw2024 assets (live surface)…');

  if (fs.existsSync(ASSETS_ROOT)) {
    for (const entry of fs.readdirSync(ASSETS_ROOT, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        fs.rmSync(path.join(ASSETS_ROOT, entry.name), { recursive: true, force: true });
      }
    }
  }

  ensureDir(IMG_OUT);
  ensureDir(DATA_OUT);
  ensureDir(FONTS_OUT);

  const imageEntries = [];

  for (const classicKey of LIVE_STILLS) {
    const src = classicToAbs(classicKey);
    if (!fs.existsSync(src)) {
      throw new Error(`Missing classic still: ${src}`);
    }

    const relFromImages = classicKey.replace(/^public\/images\//, '');
    const destWebp = path.join(IMG_OUT, relFromImages.replace(IMAGE_EXT, '.webp'));
    const mode = convertImage(src, destWebp, relFromImages);
    const bundledPath = mode === 'webp' ? destWebp : destWebp.replace(/\.webp$/i, path.extname(src));
    imageEntries.push({ classicKey, bundledPath });
  }

  const gifSrc = classicToAbs(LIVE_GIF);
  if (!fs.existsSync(gifSrc)) {
    throw new Error(`Missing classic GIF: ${gifSrc}`);
  }

  const gifDest = path.join(IMG_OUT, '2024/LF Carnival gif carousel x2.gif');
  copyFile(gifSrc, gifDest);
  imageEntries.push({ classicKey: LIVE_GIF, bundledPath: gifDest });

  for (const classicKey of LIVE_PNG_COPY) {
    const src = classicToAbs(classicKey);
    if (!fs.existsSync(src)) {
      throw new Error(`Missing classic PNG copy: ${src}`);
    }

    const relFromImages = classicKey.replace(/^public\/images\//, '');
    const destPng = path.join(IMG_OUT, relFromImages);
    copyFile(src, destPng);
    imageEntries.push({ classicKey, bundledPath: destPng });
  }

  copyFile(path.join(CLASSIC_2024, 'events.json'), path.join(DATA_OUT, 'events.json'));

  const fontsRoot = path.join(CLASSIC_2024, 'public/fonts/opensans-condensed');
  const fontFiles = [
    'OpenSans_CondensedExtraBold.woff2',
    'OpenSansCondBold.woff2',
    'OpenSans_CondensedRegular.woff2',
    'OpenSansCondLight.woff2'
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

  const mapSource = `/* eslint-disable @typescript-eslint/no-var-requires */
/* Auto-generated by scripts/prepare-ffw2024-assets.mjs — do not edit manually */

const FFW2024_IMAGE_MAP: Record<string, string> = {
${imageMapLines.join(',\n')}
};

/** Resolve classic \`public/images/...\` path to bundled WebP (or GIF) URL. */
export function resolveFfw2024Image(classicPath: string): string {
  const normalized = classicPath.replace(/\\\\/g, '/');
  const url = FFW2024_IMAGE_MAP[normalized];

  if (!url) {
    console.warn('[Ffw2024] Missing bundled image for:', normalized);
    return normalized;
  }

  return url;
}
`;

  fs.writeFileSync(MAP_OUT, mapSource, 'utf8');

  console.log(`Images: ${imageEntries.length} (stills WebP q${WEBP_QUALITY} + GIF/PNG copy)`);
  console.log(`Fonts: ${fontFiles.length} woff2`);
  console.log(`Asset map: ${MAP_OUT}`);
}

main();

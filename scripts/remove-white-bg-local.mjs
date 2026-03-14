/**
 * Local white-background removal using jimp.
 * Walks every pixel — if it's "near white" (all channels >= threshold),
 * it sets alpha to 0. Works on logos with clean white backgrounds.
 *
 * Usage: node scripts/remove-white-bg-local.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, '..', 'public');

// How close to white a pixel needs to be (0–255). 245 = very near white only.
const THRESHOLD = 245;

// Files to process — output saves over the input (in-place).
const FILES = [
  'TrophyCast_Horizontal_Side_FullColor_WhiteBG.png',
  'TrophyCast_Stack_Wordmark_Tagline_WhiteBG.png',
];

async function removeWhiteBackground(fileName) {
  console.log(`\n🖼  Processing: ${fileName}`);

  const { Jimp } = await import('jimp');

  const filePath = join(PUBLIC_DIR, fileName);
  const image = await Jimp.read(filePath);

  const { width, height } = image.bitmap;
  console.log(`   Size: ${width}×${height}`);

  let changed = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixel = image.getPixelColor(x, y);
      // Jimp stores as 0xRRGGBBAA
      const r = (pixel >>> 24) & 0xff;
      const g = (pixel >>> 16) & 0xff;
      const b = (pixel >>> 8)  & 0xff;

      if (r >= THRESHOLD && g >= THRESHOLD && b >= THRESHOLD) {
        // Set alpha to 0 (fully transparent), keep RGB
        image.setPixelColor(((r << 24) | (g << 16) | (b << 8) | 0x00) >>> 0, x, y);
        changed++;
      }
    }
  }

  console.log(`   Transparent pixels: ${changed.toLocaleString()} / ${(width * height).toLocaleString()}`);

  await image.write(filePath);
  const sizekb = Math.round(readFileSync(filePath).length / 1024);
  console.log(`   ✅ Saved: ${fileName} (${sizekb}KB) — background removed`);
}

async function main() {
  console.log(`\n🚀 Local White-Background Removal`);
  console.log(`   Threshold: pixels with R,G,B >= ${THRESHOLD} become transparent\n`);

  for (const file of FILES) {
    await removeWhiteBackground(file);
  }

  console.log(`\n✅ All done!\n`);
}

main().catch(err => {
  console.error('\n❌ Error:', err.message);
  process.exit(1);
});

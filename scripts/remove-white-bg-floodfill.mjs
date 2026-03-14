/**
 * Flood-fill background removal — starts from edges, only removes
 * connected near-white pixels. Text and artwork inside are safe.
 *
 * Usage: node scripts/remove-white-bg-floodfill.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, '..', 'public');

// Pixels with R,G,B all >= this are considered "near white" background
// 253 = only pure white (#FFFFFF) and 1-step-off white — preserves cream/gold/light text
const THRESHOLD = 253;

const DEFAULT_FILES = [
  'TrophyCast_Stack_Wordmark_Tagline_WhiteBG.png',
];

function isNearWhite(r, g, b) {
  return r >= THRESHOLD && g >= THRESHOLD && b >= THRESHOLD;
}

function cropToOpaqueBounds(image, padding = 0) {
  const { width, height, data } = image.bitmap;
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha === 0) continue;

      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }

  if (maxX === -1 || maxY === -1) {
    return null;
  }

  const cropX = Math.max(0, minX - padding);
  const cropY = Math.max(0, minY - padding);
  const cropWidth = Math.min(width - cropX, maxX - minX + 1 + padding * 2);
  const cropHeight = Math.min(height - cropY, maxY - minY + 1 + padding * 2);

  image.crop({ x: cropX, y: cropY, w: cropWidth, h: cropHeight });

  return {
    width: cropWidth,
    height: cropHeight,
  };
}

async function removeBackground(fileName) {
  console.log(`\n🖼  Processing: ${fileName}`);

  const { Jimp } = await import('jimp');

  const filePath = join(PUBLIC_DIR, fileName);
  const image = await Jimp.read(filePath);
  const { width, height, data } = image.bitmap;

  console.log(`   Size: ${width}×${height}`);

  // visited[y * width + x] = true if we've checked this pixel
  const visited = new Uint8Array(width * height);
  // toRemove[y * width + x] = true if this pixel should become transparent
  const toRemove = new Uint8Array(width * height);

  // BFS queue - seed from all 4 edges
  const queue = [];

  function enqueue(x, y) {
    const idx = y * width + x;
    if (visited[idx]) return;
    visited[idx] = 1;
    const dataIdx = idx * 4;
    const r = data[dataIdx];
    const g = data[dataIdx + 1];
    const b = data[dataIdx + 2];
    if (isNearWhite(r, g, b)) {
      toRemove[idx] = 1;
      queue.push(x, y);
    }
  }

  // Seed from all edges
  for (let x = 0; x < width; x++) {
    enqueue(x, 0);
    enqueue(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    enqueue(0, y);
    enqueue(width - 1, y);
  }

  // BFS flood fill
  let head = 0;
  while (head < queue.length) {
    const x = queue[head++];
    const y = queue[head++];
    // 4-connected neighbors
    if (x > 0)         enqueue(x - 1, y);
    if (x < width - 1) enqueue(x + 1, y);
    if (y > 0)         enqueue(x, y - 1);
    if (y < height - 1) enqueue(x, y + 1);
  }

  // Pass 1: apply flood-fill results
  let changed = 0;
  for (let i = 0; i < width * height; i++) {
    if (toRemove[i]) {
      data[i * 4 + 3] = 0;
      changed++;
    }
  }
  console.log(`   Pass 1 (flood-fill): ${changed.toLocaleString()} pixels removed`);

  // Pass 2: remove any remaining near-white islands (letter counters, gaps)
  // After the flood fill the main background is gone; any remaining near-white
  // pixels are trapped inside letterforms and should also be transparent.
  let pass2 = 0;
  for (let i = 0; i < width * height; i++) {
    if (toRemove[i]) continue; // already transparent
    const di = i * 4;
    if (data[di] >= THRESHOLD && data[di + 1] >= THRESHOLD && data[di + 2] >= THRESHOLD) {
      data[di + 3] = 0;
      pass2++;
    }
  }
  console.log(`   Pass 2 (island cleanup): ${pass2.toLocaleString()} pixels removed`);

  const totalChanged = changed + pass2;
  console.log(`   Total: ${totalChanged.toLocaleString()} / ${(width * height).toLocaleString()}`);

  const cropped = cropToOpaqueBounds(image, 8);
  if (cropped) {
    console.log(`   Crop: ${width}×${height} -> ${cropped.width}×${cropped.height}`);
  }

  await image.write(filePath);
  const sizekb = Math.round(readFileSync(filePath).length / 1024);
  console.log(`   ✅ Saved: ${fileName} (${sizekb}KB)`);
}

async function main() {
  const files = process.argv.slice(2);
  const targets = files.length > 0 ? files : DEFAULT_FILES;

  console.log(`\n🚀 Flood-Fill Background Removal`);
  console.log(`   Only removes edge-connected near-white pixels — text stays intact\n`);

  for (const file of targets) {
    await removeBackground(file);
  }

  console.log(`\n✅ Done!\n`);
}

main().catch(err => {
  console.error('\n❌ Error:', err.message);
  process.exit(1);
});

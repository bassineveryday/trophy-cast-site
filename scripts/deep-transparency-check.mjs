import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const logoDir = join(__dirname, "..", "public", "TC Logo's");

async function checkFile(filename) {
  const filePath = join(logoDir, filename);
  const img = sharp(filePath);
  const meta = await img.metadata();
  const raw = await img.raw().toBuffer();
  const w = meta.width;
  const h = meta.height;
  const channels = meta.channels;

  function getPixel(x, y) {
    const offset = (y * w + x) * channels;
    return {
      r: raw[offset],
      g: raw[offset + 1],
      b: raw[offset + 2],
      a: channels >= 4 ? raw[offset + 3] : 255,
    };
  }

  // Sample a 20x20 grid across the image to find all non-transparent pixels
  let totalSampled = 0;
  let fullyTransparent = 0;
  let nearWhite = 0; // alpha > 0 AND rgb all > 220
  let colored = 0;

  for (let sy = 0; sy < 20; sy++) {
    for (let sx = 0; sx < 20; sx++) {
      const x = Math.floor((sx / 19) * (w - 1));
      const y = Math.floor((sy / 19) * (h - 1));
      const p = getPixel(x, y);
      totalSampled++;
      if (p.a === 0) fullyTransparent++;
      else if (p.r > 220 && p.g > 220 && p.b > 220) nearWhite++;
      else colored++;
    }
  }

  // Also sample all pixels in the border (outermost 10px band)
  let borderTransparent = 0;
  let borderWhite = 0;
  let borderColored = 0;
  let borderTotal = 0;

  for (let y = 0; y < Math.min(h, 10); y++) {
    for (let x = 0; x < w; x++) {
      const p = getPixel(x, y);
      borderTotal++;
      if (p.a === 0) borderTransparent++;
      else if (p.r > 220 && p.g > 220 && p.b > 220) borderWhite++;
      else borderColored++;
    }
  }
  for (let y = Math.max(0, h - 10); y < h; y++) {
    for (let x = 0; x < w; x++) {
      const p = getPixel(x, y);
      borderTotal++;
      if (p.a === 0) borderTransparent++;
      else if (p.r > 220 && p.g > 220 && p.b > 220) borderWhite++;
      else borderColored++;
    }
  }

  console.log(`\n=== ${filename} (${w}x${h}, ch=${channels}) ===`);
  console.log(`  Grid 20x20 sample: transparent=${fullyTransparent} nearWhite=${nearWhite} colored=${colored} / ${totalSampled}`);
  console.log(`  Border (outer 10px): transparent=${borderTransparent} nearWhite=${borderWhite} colored=${borderColored} / ${borderTotal}`);
  
  // Sample a few specific pixels
  const midLeft = getPixel(2, Math.floor(h/2));
  const midRight = getPixel(w-3, Math.floor(h/2));
  const topMid = getPixel(Math.floor(w/2), 2);
  const botMid = getPixel(Math.floor(w/2), h-3);
  console.log(`  Mid-left: rgba(${midLeft.r},${midLeft.g},${midLeft.b},${midLeft.a})`);
  console.log(`  Mid-right: rgba(${midRight.r},${midRight.g},${midRight.b},${midRight.a})`);
  console.log(`  Top-mid: rgba(${topMid.r},${topMid.g},${topMid.b},${topMid.a})`);
  console.log(`  Bot-mid: rgba(${botMid.r},${botMid.g},${botMid.b},${botMid.a})`);

  if (borderWhite > 0) {
    console.log(`  ❌ PROBLEM: ${borderWhite} near-white OPAQUE pixels in border!`);
  } else if (borderTransparent === borderTotal) {
    console.log(`  ✅ Border entirely transparent`);
  } else {
    console.log(`  ✅ Border transparent or colored (no white)`);
  }
}

const files = [
  "trophy-cast-logo-48.png",
  "TrophyCast_FishMark_transparent.png",
];

for (const f of files) {
  await checkFile(f);
}

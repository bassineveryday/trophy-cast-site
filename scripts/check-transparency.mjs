import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// Minimal PNG decoder for checking corner pixel alpha values
// We'll use sharp if available, otherwise fall back to a simpler approach

const __dirname = dirname(fileURLToPath(import.meta.url));
const logoDir = join(__dirname, "..", "public", "tc-logos");

async function checkFile(filename) {
  try {
    const sharp = (await import("sharp")).default;
    const filePath = join(logoDir, filename);
    const img = sharp(filePath);
    const meta = await img.metadata();
    
    // Sample 4 corner pixels and center
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
    
    // Count transparent vs white pixels in borders
    let transparentCount = 0;
    let whiteCount = 0;
    let otherCount = 0;
    
    // Sample top row, bottom row, left col, right col
    for (let x = 0; x < w; x += 10) {
      for (const y of [0, 1, 2, h - 3, h - 2, h - 1]) {
        const p = getPixel(x, y);
        if (p.a === 0) transparentCount++;
        else if (p.r > 240 && p.g > 240 && p.b > 240 && p.a > 240) whiteCount++;
        else otherCount++;
      }
    }
    for (let y = 0; y < h; y += 10) {
      for (const x of [0, 1, 2, w - 3, w - 2, w - 1]) {
        const p = getPixel(x, y);
        if (p.a === 0) transparentCount++;
        else if (p.r > 240 && p.g > 240 && p.b > 240 && p.a > 240) whiteCount++;
        else otherCount++;
      }
    }
    
    const corners = [
      getPixel(0, 0),
      getPixel(w - 1, 0),
      getPixel(0, h - 1),
      getPixel(w - 1, h - 1),
    ];
    
    console.log(`\n=== ${filename} ===`);
    console.log(`  Size: ${w}x${h}, Channels: ${channels}`);
    console.log(`  Corners: ${corners.map(p => `rgba(${p.r},${p.g},${p.b},${p.a})`).join(" | ")}`);
    console.log(`  Border sample: transparent=${transparentCount} white=${whiteCount} other=${otherCount}`);
    
    const verdict = whiteCount > transparentCount 
      ? "❌ HAS WHITE BACKGROUND" 
      : transparentCount > 0 
        ? "✅ Truly transparent" 
        : "⚠️ Unknown";
    console.log(`  Verdict: ${verdict}`);
    
  } catch (err) {
    console.error(`Error processing ${filename}:`, err.message);
  }
}

const files = [
  "trophy-cast-logo-256.png",
  "trophy-cast-logo-48.png",
  "TrophyCast_FishMark_transparent.png",
  "TrophyCast_Horizontal_Side_FullColor_transparent.png",
  "TrophyCast_Wordmark_transparent.png",
];

for (const f of files) {
  await checkFile(f);
}

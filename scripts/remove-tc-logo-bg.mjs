/**
 * One-off: Remove background from Trophy Cast logo using Cloudinary AI.
 * Uploads "Trophy cast white background.png", applies e_background_removal,
 * saves result as "trophy-cast-logo-nobg.png" in /public.
 *
 * Usage: node scripts/remove-tc-logo-bg.mjs
 */

import { createHash } from 'crypto';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, '..', 'public');

const CLOUD_NAME = 'dlalit4ti';
const API_KEY = '832875284446218';
const API_SECRET = '4quG6z56m3Q8oxeZJweX6DVWzGs';

function generateSignature(params) {
  const sorted = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&');
  return createHash('sha1').update(sorted + API_SECRET).digest('hex');
}

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return httpsGet(res.headers.location).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

function multipartPost(url, fields, fileBuffer, fileName) {
  return new Promise((resolve, reject) => {
    const boundary = `----Boundary${Date.now()}`;
    const crlf = '\r\n';
    const parts = [];
    for (const [k, v] of Object.entries(fields)) {
      parts.push(Buffer.from(`--${boundary}${crlf}Content-Disposition: form-data; name="${k}"${crlf}${crlf}${v}${crlf}`));
    }
    parts.push(Buffer.from(`--${boundary}${crlf}Content-Disposition: form-data; name="file"; filename="${fileName}"${crlf}Content-Type: image/png${crlf}${crlf}`));
    parts.push(fileBuffer);
    parts.push(Buffer.from(`${crlf}--${boundary}--${crlf}`));
    const body = Buffer.concat(parts);
    const urlObj = new URL(url);
    const req = https.request({
      hostname: urlObj.hostname,
      path: urlObj.pathname,
      method: 'POST',
      headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}`, 'Content-Length': body.length }
    }, (res) => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(JSON.parse(Buffer.concat(chunks).toString())));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  const srcFile = 'Trophy cast white background.png';
  const destFile = 'trophy-cast-logo-nobg.png';

  console.log(`\n🚀 Cloudinary Background Removal — Trophy Cast Logo`);
  console.log(`   Source:  public/${srcFile}`);
  console.log(`   Output:  public/${destFile}\n`);

  const filePath = join(PUBLIC_DIR, srcFile);
  const fileBuffer = readFileSync(filePath);
  console.log(`  📂 Read ${Math.round(fileBuffer.length / 1024)}KB`);

  // Upload
  const timestamp = Math.floor(Date.now() / 1000);
  const publicId = `tc-logo-nobg-${timestamp}`;
  const sig = generateSignature({ public_id: publicId, timestamp });

  console.log(`  ⬆️  Uploading to Cloudinary...`);
  const result = await multipartPost(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { api_key: API_KEY, timestamp, public_id: publicId, signature: sig },
    fileBuffer,
    srcFile
  );

  if (result.error) {
    throw new Error(`Upload failed: ${result.error.message}`);
  }
  console.log(`  ✅ Uploaded: ${result.public_id} (${result.width}×${result.height})`);

  // Fetch with background removal
  const transformedUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/e_background_removal/${result.public_id}.png`;
  console.log(`  🎨 Fetching with background removal...`);
  console.log(`     URL: ${transformedUrl}`);

  let imageBuffer = null;
  for (let attempt = 1; attempt <= 8; attempt++) {
    if (attempt > 1) {
      console.log(`  ⏳ Attempt ${attempt}/8 — waiting 5s...`);
      await new Promise(r => setTimeout(r, 5000));
    }
    imageBuffer = await httpsGet(transformedUrl);
    if (imageBuffer.length > 5000) break;
    console.log(`  ⚠️  Response too small (${imageBuffer.length} bytes), retrying...`);
    imageBuffer = null;
  }

  if (!imageBuffer || imageBuffer.length < 5000) {
    try {
      console.error(`  ❌ Response:`, imageBuffer?.toString());
    } catch {}
    throw new Error(`Background removal failed after 8 attempts`);
  }

  // Save
  const destPath = join(PUBLIC_DIR, destFile);
  writeFileSync(destPath, imageBuffer);
  console.log(`  💾 Saved: public/${destFile} (${Math.round(imageBuffer.length / 1024)}KB)`);
  console.log(`\n✅ Done! Use "/trophy-cast-logo-nobg.png" in the flyer.\n`);
}

main().catch(err => {
  console.error('\n❌ Error:', err.message);
  process.exit(1);
});

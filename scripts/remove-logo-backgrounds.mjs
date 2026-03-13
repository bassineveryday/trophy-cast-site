/**
 * Removes backgrounds from sponsor logos using Cloudinary's background_removal add-on.
 * Uploads each logo, applies e_background_removal, downloads the clean PNG,
 * and overwrites the original file in /public.
 *
 * Usage: node scripts/remove-logo-backgrounds.mjs
 */

import { createHash, createHmac } from 'crypto';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __dirname = dirname(fileURLToPath(import.meta.url));

const CLOUD_NAME = 'dlalit4ti';
const API_KEY = '832875284446218';
const API_SECRET = '4quG6z56m3Q8oxeZJweX6DVWzGs';

const PUBLIC_DIR = join(__dirname, '..', 'public');

const LOGOS = [
  'Eagle Claw logo transparent..png',
  'Militia Marine logo. Transparent..png',
  'Rapala logo transparent..png',
  'Discount fishing tackle. Logo. Transparent..png',
];

function generateSignature(params) {
  const sorted = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&');
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
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

function multipartPost(url, fields, fileField, fileName, fileBuffer) {
  return new Promise((resolve, reject) => {
    const boundary = `----CloudinaryBoundary${Date.now()}`;
    const crlf = '\r\n';
    const parts = [];

    for (const [key, val] of Object.entries(fields)) {
      parts.push(
        Buffer.from(
          `--${boundary}${crlf}Content-Disposition: form-data; name="${key}"${crlf}${crlf}${val}${crlf}`
        )
      );
    }

    parts.push(
      Buffer.from(
        `--${boundary}${crlf}Content-Disposition: form-data; name="${fileField}"; filename="${fileName}"${crlf}Content-Type: image/png${crlf}${crlf}`
      )
    );
    parts.push(fileBuffer);
    parts.push(Buffer.from(`${crlf}--${boundary}--${crlf}`));

    const body = Buffer.concat(parts);

    const urlObj = new URL(url);
    const req = https.request(
      {
        hostname: urlObj.hostname,
        path: urlObj.pathname,
        method: 'POST',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          'Content-Length': body.length,
        },
      },
      (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          try {
            resolve(JSON.parse(Buffer.concat(chunks).toString()));
          } catch (e) {
            reject(new Error('Failed to parse response: ' + Buffer.concat(chunks).toString()));
          }
        });
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function processLogo(filename) {
  console.log(`\n📂 Processing: ${filename}`);
  const filePath = join(PUBLIC_DIR, filename);
  const fileBuffer = readFileSync(filePath);

  // 1. Upload to Cloudinary
  const timestamp = Math.floor(Date.now() / 1000);
  const publicId = `sponsor-logos/${filename.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').replace(/_$/, '')}`;

  const sigParams = {
    public_id: publicId,
    timestamp,
  };
  const signature = generateSignature(sigParams);

  const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  console.log(`  ⬆️  Uploading...`);

  const uploadResult = await multipartPost(
    uploadUrl,
    {
      api_key: API_KEY,
      timestamp,
      public_id: publicId,
      signature,
    },
    'file',
    filename,
    fileBuffer
  );

  if (uploadResult.error) {
    throw new Error(`Upload failed: ${uploadResult.error.message}`);
  }

  console.log(`  ✅ Uploaded as: ${uploadResult.public_id}`);

  // 2. Fetch with background removal transformation
  // e_background_removal requires the Cloudinary AI Background Removal add-on
  const transformedUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/e_background_removal/${uploadResult.public_id}.png`;
  console.log(`  🎨 Fetching with background removal...`);
  console.log(`     URL: ${transformedUrl}`);

  // Background removal can take a moment — poll a few times
  let imageBuffer = null;
  for (let attempt = 1; attempt <= 5; attempt++) {
    if (attempt > 1) {
      console.log(`  ⏳ Attempt ${attempt}/5 — waiting 4s...`);
      await new Promise((r) => setTimeout(r, 4000));
    }
    imageBuffer = await httpsGet(transformedUrl);
    // If Cloudinary returns a tiny response it's likely an error JSON
    if (imageBuffer.length > 5000) break;
    console.log(`  ⚠️  Response too small (${imageBuffer.length} bytes), retrying...`);
    imageBuffer = null;
  }

  if (!imageBuffer || imageBuffer.length < 5000) {
    // Try to parse as JSON to show error
    try {
      const msg = JSON.parse(imageBuffer.toString());
      throw new Error(`Cloudinary error: ${JSON.stringify(msg)}`);
    } catch {
      throw new Error(`Background removal returned unexpected response (${imageBuffer?.length ?? 0} bytes)`);
    }
  }

  // 3. Overwrite the original file
  writeFileSync(filePath, imageBuffer);
  console.log(`  💾 Saved back to public/${filename} (${Math.round(imageBuffer.length / 1024)}KB)`);
}

async function main() {
  console.log('🚀 Cloudinary Background Removal — Sponsor Logos');
  console.log('================================================');
  console.log(`Cloud: ${CLOUD_NAME} | Logos: ${LOGOS.length}`);

  let success = 0;
  for (const logo of LOGOS) {
    try {
      await processLogo(logo);
      success++;
    } catch (err) {
      console.error(`  ❌ FAILED: ${err.message}`);
    }
  }

  console.log(`\n================================================`);
  console.log(`✅ Done: ${success}/${LOGOS.length} logos processed`);
  if (success > 0) {
    console.log(`\nNext step: commit the updated PNGs and push.`);
  }
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});

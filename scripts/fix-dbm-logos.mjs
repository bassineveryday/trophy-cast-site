import { createHash } from 'crypto';
import { readFileSync, writeFileSync } from 'fs';
import https from 'https';

const CLOUD_NAME = 'dlalit4ti';
const API_KEY = '832875284446218';
const API_SECRET = '4quG6z56m3Q8oxeZJweX6DVWzGs';

const LOGOS = [
  { src: "Loge Transparent background.png", dest: "Loge Transparent background.png" },
  { src: "Denver Bassmaster Junior's logo transparent..png", dest: "Denver Bassmaster Junior's logo transparent..png" },
  { src: "FRBC Logo.png", dest: "FRBC Logo.png" },
];

function generateSignature(params) {
  const sorted = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&');
  return createHash('sha1').update(sorted + API_SECRET).digest('hex');
}

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
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

async function processLogo({ src, dest }) {
  console.log(`\n📂 ${src}`);
  const buf = readFileSync(`public/${src}`);
  const timestamp = Math.floor(Date.now() / 1000);
  const publicId = `dbm-logos/${src.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 60)}_${timestamp}`;
  const sig = generateSignature({ public_id: publicId, timestamp });

  console.log(`  ⬆️  Uploading (${Math.round(buf.length/1024)}KB)...`);
  const result = await multipartPost(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { api_key: API_KEY, timestamp, public_id: publicId, signature: sig },
    buf, src
  );
  if (result.error) throw new Error(result.error.message);
  console.log(`  ✅ Uploaded: ${result.public_id} (${result.width}x${result.height})`);

  const url = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/e_background_removal/${result.public_id}.png`;
  console.log(`  🎨 Fetching background removal...`);
  await new Promise(r => setTimeout(r, 4000));

  let cleaned = null;
  for (let i = 1; i <= 4; i++) {
    cleaned = await httpsGet(url);
    if (cleaned.length > 5000) break;
    console.log(`  ⏳ Retry ${i}/4...`);
    await new Promise(r => setTimeout(r, 3000));
  }

  const colorType = cleaned[25];
  console.log(`  Color type: ${colorType} — ${colorType === 6 ? 'RGBA ✅' : 'No alpha ❌'}`);
  writeFileSync(`public/${dest}`, cleaned);
  console.log(`  💾 Saved: public/${dest} (${Math.round(cleaned.length/1024)}KB)`);
}

async function main() {
  console.log('🦅 DBM Logo Background Removal');
  let ok = 0;
  for (const logo of LOGOS) {
    try { await processLogo(logo); ok++; }
    catch (e) { console.error(`  ❌ ${e.message}`); }
  }
  console.log(`\n✅ ${ok}/${LOGOS.length} done`);
}

main();

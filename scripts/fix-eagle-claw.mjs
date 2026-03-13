import { createHash } from 'crypto';
import { readFileSync, writeFileSync } from 'fs';
import https from 'https';

const CLOUD_NAME = 'dlalit4ti';
const API_KEY = '832875284446218';
const API_SECRET = '4quG6z56m3Q8oxeZJweX6DVWzGs';

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

async function run() {
  const sourceFile = 'public/Eagle Claw logo transparent. (1).png';
  const destFile = 'public/Eagle Claw logo transparent..png';

  console.log('Reading source:', sourceFile);
  const buf = readFileSync(sourceFile);
  console.log('Size:', Math.round(buf.length / 1024) + 'KB');

  const timestamp = Math.floor(Date.now() / 1000);
  const publicId = `sponsor-logos/Eagle_Claw_v3_${timestamp}`;
  const sig = generateSignature({ public_id: publicId, timestamp });

  console.log('Uploading...');
  const result = await multipartPost(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { api_key: API_KEY, timestamp, public_id: publicId, signature: sig },
    buf,
    'Eagle Claw logo transparent. (1).png'
  );
  if (result.error) throw new Error(result.error.message);
  console.log('Uploaded:', result.public_id, `(${result.width}x${result.height})`);

  const transformedUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/e_background_removal/${result.public_id}.png`;
  console.log('Fetching with background removal...');
  console.log('URL:', transformedUrl);

  // Wait for processing
  await new Promise(r => setTimeout(r, 4000));
  const cleaned = await httpsGet(transformedUrl);
  console.log('Response size:', Math.round(cleaned.length / 1024) + 'KB');

  const colorType = cleaned[25];
  const colorTypes = { 2: 'RGB (no alpha) ❌', 6: 'RGBA ✅' };
  console.log('Color type:', colorType, '-', colorTypes[colorType] ?? 'Unknown');

  writeFileSync(destFile, cleaned);
  console.log('Saved to:', destFile);
}

run().catch(e => { console.error('Error:', e.message); process.exit(1); });

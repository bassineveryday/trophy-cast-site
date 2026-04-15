import { Jimp } from 'jimp';
import path from 'path';
import { copyFileSync } from 'fs';

const baseDir = path.join(process.cwd(), 'public', 'tc-logos');
const archiveDir = path.join(baseDir, '_archive');

// Each entry: { source } is the clean white-background original to read from.
// { output } is the transparent PNG to write. If source !== output, we copy first.
const fileMap = [
  {
    // Clean white-background source → horizontal lockup transparent output
    source: path.join(archiveDir, 'TrophyCast_Horizontal_Side_FullColor_WhiteBG.png'),
    output: path.join(baseDir, 'TrophyCast_Horizontal_Side_FullColor_transparent.png'),
    label: 'TrophyCast_Horizontal_Side_FullColor_transparent.png',
  },
  {
    // Stack wordmark + tagline white-bg → wordmark transparent output
    source: path.join(archiveDir, 'TrophyCast_Stack_Wordmark_Tagline_WhiteBG.png'),
    output: path.join(baseDir, 'TrophyCast_Wordmark_transparent.png'),
    label: 'TrophyCast_Wordmark_transparent.png',
  },
  {
    // FishMark: current file is white-bg (never correctly stripped) — process in-place
    source: path.join(baseDir, 'TrophyCast_FishMark_transparent.png'),
    output: path.join(baseDir, 'TrophyCast_FishMark_transparent.png'),
    label: 'TrophyCast_FishMark_transparent.png',
  },
];

const colorTolerance = 32;

function getPixelChannels(data, index) {
  const dataIndex = index * 4;
  return {
    red: data[dataIndex],
    green: data[dataIndex + 1],
    blue: data[dataIndex + 2],
    alpha: data[dataIndex + 3],
  };
}

function colorDistance(left, right) {
  return Math.sqrt(
    (left.red - right.red) ** 2 +
      (left.green - right.green) ** 2 +
      (left.blue - right.blue) ** 2,
  );
}

function isBackgroundMatch(pixel, seedColors) {
  if (pixel.alpha === 0) {
    return true;
  }

  return seedColors.some((seedColor) => colorDistance(pixel, seedColor) <= colorTolerance);
}

async function removeEdgeConnectedBackground({ source, output, label }) {
  // Copy clean source to output path before processing (no-op when source === output)
  if (source !== output) {
    copyFileSync(source, output);
  }
  const image = await Jimp.read(output);
  const { width, height, data } = image.bitmap;
  const visited = new Uint8Array(width * height);
  const toRemove = new Uint8Array(width * height);
  const queue = [];
  const edgeSeedPoints = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
    [Math.floor(width / 2), 0],
    [Math.floor(width / 2), height - 1],
    [0, Math.floor(height / 2)],
    [width - 1, Math.floor(height / 2)],
  ];
  const seedColors = edgeSeedPoints.map(([x, y]) => getPixelChannels(data, y * width + x));

  function enqueue(x, y) {
    const index = y * width + x;
    if (visited[index]) {
      return;
    }

    visited[index] = 1;

    const pixel = getPixelChannels(data, index);

    if (!isBackgroundMatch(pixel, seedColors)) {
      return;
    }

    toRemove[index] = 1;
    queue.push(x, y);
  }

  for (let x = 0; x < width; x += 1) {
    enqueue(x, 0);
    enqueue(x, height - 1);
  }

  for (let y = 0; y < height; y += 1) {
    enqueue(0, y);
    enqueue(width - 1, y);
  }

  let head = 0;
  while (head < queue.length) {
    const x = queue[head];
    const y = queue[head + 1];
    head += 2;

    if (x > 0) enqueue(x - 1, y);
    if (x < width - 1) enqueue(x + 1, y);
    if (y > 0) enqueue(x, y - 1);
    if (y < height - 1) enqueue(x, y + 1);
  }

  let removed = 0;
  for (let index = 0; index < width * height; index += 1) {
    if (!toRemove[index]) {
      continue;
    }

    data[index * 4 + 3] = 0;
    removed += 1;
  }

  await image.write(output);
  console.log(`${label}: removed ${removed} background pixels`);
}

for (const entry of fileMap) {
  await removeEdgeConnectedBackground(entry);
}
import zlib from 'zlib';
import fs from 'fs';

const SIZE = 32;
const pixels = new Uint8Array(SIZE * SIZE * 4);

function setPixel(x, y, r, g, b, a = 255) {
  if (x < 0 || x >= SIZE || y < 0 || y >= SIZE) return;
  const i = (y * SIZE + x) * 4;
  const alpha = a / 255;
  pixels[i]     = Math.round(pixels[i]     * (1 - alpha) + r * alpha);
  pixels[i + 1] = Math.round(pixels[i + 1] * (1 - alpha) + g * alpha);
  pixels[i + 2] = Math.round(pixels[i + 2] * (1 - alpha) + b * alpha);
  pixels[i + 3] = Math.min(255, pixels[i + 3] + a);
}

// gradient: blue #0071e3 → purple #9b51e0
function gradColor(t) {
  return [
    Math.round(0x00 + t * (0x9b - 0x00)),
    Math.round(0x71 + t * (0x51 - 0x71)),
    Math.round(0xe3 + t * (0xe0 - 0xe3)),
  ];
}

// Rounded rect background (white)
const RR = 6;
for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    const dx = Math.max(RR - x, 0, x - (SIZE - 1 - RR));
    const dy = Math.max(RR - y, 0, y - (SIZE - 1 - RR));
    if (dx * dx + dy * dy <= RR * RR) {
      setPixel(x, y, 255, 255, 255, 255);
    }
  }
}

// Orbit ring — anti-aliased
const cx = SIZE / 2, cy = SIZE / 2, radius = 9.5, strokeW = 2.0;
for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    const dist = Math.sqrt((x - cx + 0.5) ** 2 + (y - cy + 0.5) ** 2);
    const inner = radius - strokeW / 2, outer = radius + strokeW / 2;
    if (dist >= inner - 1 && dist <= outer + 1) {
      const t = Math.atan2(y - cy + 0.5, x - cx + 0.5) / (Math.PI * 2) + 0.5;
      const [r, g, b] = gradColor(t);
      const alpha = Math.min(1, Math.max(0,
        Math.min(dist - (inner - 1), (outer + 1) - dist)
      )) * 255;
      setPixel(x, y, r, g, b, alpha);
    }
  }
}

// Orbit node dot (right side)
const nx = Math.round(cx + radius), ny = Math.round(cy);
const dotR = 2.8;
for (let y = ny - 5; y <= ny + 5; y++) {
  for (let x = nx - 5; x <= nx + 5; x++) {
    const dist = Math.sqrt((x - nx + 0.5) ** 2 + (y - ny + 0.5) ** 2);
    if (dist <= dotR + 1) {
      const alpha = Math.min(1, (dotR + 1 - dist)) * 255;
      const [r, g, b] = gradColor(0.15);
      setPixel(x, y, r, g, b, alpha);
    }
  }
}

// Center dot
const cdotR = 2.0;
for (let y = cy - 4; y <= cy + 4; y++) {
  for (let x = cx - 4; x <= cx + 4; x++) {
    const dist = Math.sqrt((x - cx + 0.5) ** 2 + (y - cy + 0.5) ** 2);
    if (dist <= cdotR + 1) {
      const alpha = Math.min(1, (cdotR + 1 - dist)) * 255;
      const [r, g, b] = gradColor(0.5);
      setPixel(x, y, r, g, b, alpha);
    }
  }
}

// PNG encode
function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (const b of buf) { c ^= b; for (let i = 0; i < 8; i++) c = (c & 1) ? (c >>> 1) ^ 0xEDB88320 : c >>> 1; }
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function chunk(type, data) {
  const t = Buffer.from(type), d = Buffer.from(data);
  const len = Buffer.alloc(4); len.writeUInt32BE(d.length);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([t, d])));
  return Buffer.concat([len, t, d, crc]);
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(SIZE, 0); ihdr.writeUInt32BE(SIZE, 4);
ihdr[8] = 8; ihdr[9] = 6;

const raw = Buffer.alloc(SIZE * (1 + SIZE * 4));
for (let y = 0; y < SIZE; y++) {
  raw[y * (1 + SIZE * 4)] = 0;
  for (let x = 0; x < SIZE; x++) {
    const src = (y * SIZE + x) * 4, dst = y * (1 + SIZE * 4) + 1 + x * 4;
    raw[dst] = pixels[src]; raw[dst+1] = pixels[src+1];
    raw[dst+2] = pixels[src+2]; raw[dst+3] = pixels[src+3];
  }
}

const png = Buffer.concat([
  Buffer.from([137,80,78,71,13,10,26,10]),
  chunk('IHDR', ihdr),
  chunk('IDAT', zlib.deflateSync(raw)),
  chunk('IEND', Buffer.alloc(0)),
]);

fs.writeFileSync('public/favicon.png', png);
console.log('✓ public/favicon.png создан');

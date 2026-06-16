// Run: node generate-favicon.mjs
// Requires: npm install canvas (or sharp)
// Generates public/favicon.png from the SVG

import { createCanvas } from 'canvas';
import { writeFileSync } from 'fs';

const SIZE = 64;
const canvas = createCanvas(SIZE, SIZE);
const ctx = canvas.getContext('2d');

// White rounded rect background
const R = SIZE * 0.22;
ctx.beginPath();
ctx.moveTo(R, 0);
ctx.lineTo(SIZE - R, 0);
ctx.arcTo(SIZE, 0, SIZE, R, R);
ctx.lineTo(SIZE, SIZE - R);
ctx.arcTo(SIZE, SIZE, SIZE - R, SIZE, R);
ctx.lineTo(R, SIZE);
ctx.arcTo(0, SIZE, 0, SIZE - R, R);
ctx.lineTo(0, R);
ctx.arcTo(0, 0, R, 0, R);
ctx.closePath();
ctx.fillStyle = '#ffffff';
ctx.fill();

// Gradient blue→purple
const grad = ctx.createLinearGradient(4, 4, SIZE - 4, SIZE - 4);
grad.addColorStop(0, '#0071e3');
grad.addColorStop(1, '#9b51e0');

// Orbit ring
const cx = SIZE / 2, cy = SIZE / 2, r = SIZE * 0.31;
ctx.beginPath();
ctx.arc(cx, cy, r, 0, Math.PI * 2);
ctx.strokeStyle = grad;
ctx.lineWidth = SIZE * 0.069;
ctx.stroke();

// Orbit node
const nx = cx + r + SIZE * 0.031;
ctx.beginPath();
ctx.arc(nx, cy, SIZE * 0.094, 0, Math.PI * 2);
ctx.fillStyle = grad;
ctx.fill();

// Center dot
ctx.beginPath();
ctx.arc(cx, cy, SIZE * 0.069, 0, Math.PI * 2);
ctx.fillStyle = grad;
ctx.fill();

writeFileSync('public/favicon.png', canvas.toBuffer('image/png'));
console.log('✓ public/favicon.png written');

const sharp = require('sharp');
const path = require('path');

async function replaceBackground(inputPath) {
  const { data, info } = await sharp(inputPath)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const pixels = Buffer.from(data);

  // Background color: #2D6A4F = rgb(45, 106, 79)
  const bgR = 45, bgG = 106, bgB = 79;

  for (let i = 0; i < pixels.length; i += channels) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];

    const dr = r - bgR;
    const dg = g - bgG;
    const db = b - bgB;
    const distFromBg = Math.sqrt(dr * dr + dg * dg + db * db);

    if (distFromBg < 90) {
      // Smooth blend: pure background → white, edge pixels → proportional
      const t = distFromBg / 90;
      pixels[i]     = Math.round(255 * (1 - t) + r * t);
      pixels[i + 1] = Math.round(255 * (1 - t) + g * t);
      pixels[i + 2] = Math.round(255 * (1 - t) + b * t);
    }
  }

  await sharp(pixels, { raw: { width, height, channels } })
    .png()
    .toFile(inputPath);

  console.log(`✓ ${path.basename(inputPath)} updated`);
}

async function main() {
  await replaceBackground('./src/assets/icon.png');
  console.log('Done — icon.png now has white background.');
}

main().catch(err => { console.error(err); process.exit(1); });

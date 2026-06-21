const sharp = require('sharp');
const path = require('path');

const SIZE = 1024;
const GREEN = { r: 45, g: 106, b: 79, alpha: 1 }; // #2D6A4F

async function generate() {
  const logoPath = path.join(__dirname, '../src/assets/logo.png');

  // Logo: 58% del canvas, posicionado en el tercio superior
  const logoSize = Math.round(SIZE * 0.58);
  const logoLeft = Math.round((SIZE - logoSize) / 2);
  const logoTop  = Math.round(SIZE * 0.10);

  const resizedLogo = await sharp(logoPath)
    .resize(logoSize, logoSize, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  // Logo: centrado verticalmente al quitar el texto
  const logoTopCentered = Math.round((SIZE - logoSize) / 2);

  const outputPath = path.join(__dirname, '../src/assets/icon.png');
  const foregroundPath = path.join(__dirname, '../src/assets/adaptive-icon.png');

  // Ícono completo (fondo verde + logo centrado)
  await sharp({
    create: { width: SIZE, height: SIZE, channels: 4, background: GREEN },
  })
    .png()
    .composite([
      { input: resizedLogo, top: logoTopCentered, left: logoLeft },
    ])
    .toFile(outputPath);

  // Foreground para adaptive icon (transparente, solo logo)
  const fgLogoSize = Math.round(SIZE * 0.65);
  const fgLeft = Math.round((SIZE - fgLogoSize) / 2);
  const fgTop  = Math.round((SIZE - fgLogoSize) / 2);

  const fgLogo = await sharp(logoPath)
    .resize(fgLogoSize, fgLogoSize, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  await sharp({
    create: { width: SIZE, height: SIZE, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .png()
    .composite([{ input: fgLogo, top: fgTop, left: fgLeft }])
    .toFile(foregroundPath);

  console.log('✓ icon.png generado');
  console.log('✓ adaptive-icon.png generado');
}

generate().catch((err) => { console.error(err); process.exit(1); });

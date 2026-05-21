import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.resolve('public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');
const MAX_WIDTH = 1920;
const JPEG_QUALITY = 80;
const PNG_QUALITY = 80; // For PNG compression level

async function compressImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const sizeBefore = fs.statSync(filePath).size;
  const sizeMB = (sizeBefore / (1024 * 1024)).toFixed(2);

  if (!['.png', '.jpg', '.jpeg'].includes(ext)) {
    return;
  }

  console.log(`\n📷 Processing: ${path.relative('.', filePath)} (${sizeMB} MB)`);

  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();

    let pipeline = sharp(filePath);

    // Resize if wider than MAX_WIDTH
    if (metadata.width > MAX_WIDTH) {
      pipeline = pipeline.resize(MAX_WIDTH, null, {
        withoutEnlargement: true,
        fit: 'inside',
      });
      console.log(`   ↳ Resizing from ${metadata.width}px to ${MAX_WIDTH}px wide`);
    }

    // Compress based on format
    const tempPath = filePath + '.tmp';
    if (ext === '.png') {
      await pipeline
        .png({ quality: PNG_QUALITY, compressionLevel: 9, effort: 10 })
        .toFile(tempPath);
    } else {
      // JPEG
      await pipeline
        .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
        .toFile(tempPath);
    }

    const sizeAfter = fs.statSync(tempPath).size;
    const reduction = ((1 - sizeAfter / sizeBefore) * 100).toFixed(1);
    const sizeAfterMB = (sizeAfter / (1024 * 1024)).toFixed(2);

    // Only replace if we actually reduced the size
    if (sizeAfter < sizeBefore) {
      fs.unlinkSync(filePath);
      fs.renameSync(tempPath, filePath);
      console.log(`   ✅ ${sizeMB} MB → ${sizeAfterMB} MB (${reduction}% smaller)`);
    } else {
      fs.unlinkSync(tempPath);
      console.log(`   ⏭️  Already optimal, skipping`);
    }
  } catch (err) {
    console.error(`   ❌ Error: ${err.message}`);
  }
}

async function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await processDirectory(fullPath);
    } else {
      await compressImage(fullPath);
    }
  }
}

console.log('🔧 Starting image compression...\n');
console.log('='.repeat(60));

// Process root public images
const rootImages = fs.readdirSync(PUBLIC_DIR).filter((f) => {
  const ext = path.extname(f).toLowerCase();
  return ['.png', '.jpg', '.jpeg'].includes(ext) && !f.startsWith('favicon') && !f.startsWith('android') && !f.startsWith('apple') && !f.startsWith('mstile');
});

for (const img of rootImages) {
  await compressImage(path.join(PUBLIC_DIR, img));
}

// Process images subdirectory
if (fs.existsSync(IMAGES_DIR)) {
  await processDirectory(IMAGES_DIR);
}

console.log('\n' + '='.repeat(60));
console.log('✅ Image compression complete!');

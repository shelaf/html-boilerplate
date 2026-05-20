import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
import { join, extname, basename, dirname, relative } from 'node:path';

const SRC_DIR = 'src/assets/images';
const OUT_DIR = 'public/images';

const SUPPORTED = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.tiff']);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

async function optimise(src) {
  const ext = extname(src).toLowerCase();
  if (!SUPPORTED.has(ext)) return;

  const rel = relative(SRC_DIR, src);
  const dest = join(OUT_DIR, rel);
  await mkdir(dirname(dest), { recursive: true });

  const image = sharp(src);

  if (ext === '.jpg' || ext === '.jpeg') {
    await image.jpeg({ mozjpeg: true }).toFile(dest);
  } else if (ext === '.png') {
    await image.png({ compressionLevel: 9, palette: true }).toFile(dest);
  } else if (ext === '.webp') {
    await image.webp({ effort: 6 }).toFile(dest);
  } else if (ext === '.avif') {
    await image.avif({ effort: 6 }).toFile(dest);
  } else if (ext === '.gif') {
    await image.gif().toFile(dest);
  } else if (ext === '.tiff') {
    await image.tiff({ compression: 'lzw' }).toFile(dest);
  }

  console.log(`  ${rel}`);
}

const files = [];
for await (const file of walk(SRC_DIR)) {
  if (SUPPORTED.has(extname(file).toLowerCase())) files.push(file);
}

if (files.length === 0) {
  console.log('No images found.');
} else {
  console.log(`Optimising ${files.length} image(s)...`);
  await Promise.all(files.map(optimise));
  console.log('Done.');
}

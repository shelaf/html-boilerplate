import { Eta } from 'eta';
import { readdir, writeFile, mkdir } from 'node:fs/promises';
import { join, resolve, dirname } from 'node:path';

const BASE_DIR = 'src/layouts';
const OUT_DIR = 'public';

const eta = new Eta({ views: resolve('src') });

const entries = await readdir(BASE_DIR, { withFileTypes: true });
const etaFiles = entries.filter(e => e.isFile() && e.name.endsWith('.eta'));

await Promise.all(etaFiles.map(async (entry) => {
  const result = await eta.renderAsync(`./layouts/${entry.name}`, {});
  const destName = entry.name.replace(/\.eta$/, '.html');
  const dest = join(OUT_DIR, destName);
  await mkdir(dirname(dest), { recursive: true });
  await writeFile(dest, result, 'utf-8');
  console.log(`  ${destName}`);
}));

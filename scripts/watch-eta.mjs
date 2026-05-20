import { watch } from 'node:fs';
import { spawn } from 'node:child_process';

let timer;

watch('src', { recursive: true }, (_, filename) => {
  if (!filename?.endsWith('.eta')) return;
  clearTimeout(timer);
  timer = setTimeout(() => {
    spawn('bun', ['run', 'build:html'], { stdio: 'inherit' });
  }, 50);
});

console.log('Watching Eta files...');

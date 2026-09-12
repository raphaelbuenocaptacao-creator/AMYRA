import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../sw.js', import.meta.url), 'utf8');

assert.match(
  source,
  /const withTimeout=\(promise,ms\)=>\{[\s\S]*?clearTimeout\(timeout\)/,
  'o helper de timeout do service worker deve cancelar o timer quando a operacao terminar'
);

console.log('service worker timeout cleanup: ok');

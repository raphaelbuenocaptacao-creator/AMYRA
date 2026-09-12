import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../safety.js', import.meta.url), 'utf8');

assert.match(
  source,
  /const withTimeout=\(promise,ms\)=>\{let timeout;[\s\S]*\.finally\(\(\)=>clearTimeout\(timeout\)\)\);\};/,
  'withTimeout deve cancelar o timer depois que a operação terminar'
);

console.log('safety timeout cleanup: ok');

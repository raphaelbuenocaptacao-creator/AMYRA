import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../safety.js', import.meta.url), 'utf8');

assert.match(
  source,
  /typeof navigator\.clipboard\?\.writeText === 'function'/,
  'o fluxo de cópia só deve usar Clipboard API quando writeText realmente existir'
);

console.log('safety clipboard capability: ok');

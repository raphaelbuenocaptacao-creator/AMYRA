import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../safety.js', import.meta.url), 'utf8');

assert.match(
  source,
  /withTimeout\(navigator\.clipboard\.writeText\(helpText\),\s*4000\)/,
  'a cópia via Clipboard API deve ter limite de tempo para não deixar os controles de ajuda presos indefinidamente'
);

assert.match(
  source,
  /const withTimeout\s*=\s*\(promise,\s*ms\)\s*=>\s*Promise\.race/,
  'safety.js deve limitar operações assíncronas potencialmente travadas'
);

console.log('safety clipboard timeout: ok');

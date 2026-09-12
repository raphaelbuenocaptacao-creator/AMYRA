import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../safety.js', import.meta.url), 'utf8');

assert.match(
  source,
  /withTimeout\(navigator\.share\(shareData\),\s*10000\)/,
  'o Web Share deve ter limite de tempo para não deixar os controles de ajuda presos indefinidamente'
);

assert.match(
  source,
  /fallbackResult\s*=\s*await copyHelpText\(\)/,
  'uma falha ou timeout do Web Share deve preservar o fallback de cópia da mensagem'
);

console.log('safety web share timeout: ok');

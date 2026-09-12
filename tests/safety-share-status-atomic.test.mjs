import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../safety.html', import.meta.url), 'utf8');

assert.match(
  source,
  /<div class="status" id="shareStatus" role="status" aria-live="polite" aria-atomic="true"><\/div>/i,
  'o feedback de copiar/compartilhar deve ser anunciado por leitores de tela como uma mensagem completa'
);

console.log('safety share status atomic: ok');

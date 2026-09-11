import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../safety.js', import.meta.url), 'utf8');

assert.match(
  source,
  /addEventListener\(['"]pageshow['"]/,
  'a página de segurança deve tratar restaurações pelo histórico do navegador'
);
assert.match(
  source,
  /event\.persisted/,
  'o status transitório deve ser limpo apenas quando a página vier do bfcache'
);
assert.match(
  source,
  /shareStatus\.textContent\s*=\s*['"]['"]/,
  'o feedback de compartilhamento deve ser limpo ao restaurar a página'
);

console.log('safety bfcache status reset: ok');

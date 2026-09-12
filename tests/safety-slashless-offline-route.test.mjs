import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../sw.js', import.meta.url), 'utf8');

assert.match(
  source,
  /const isSafetyNavigation=url=>[^;]*url\.pathname===`\$\{scopePath\}safety`[^;]*url\.pathname===`\$\{scopePath\}safety\/`[^;]*url\.pathname===`\$\{scopePath\}safety\.html`/,
  'o service worker deve reconhecer /safety, /safety/ e /safety.html como a mesma rota de ajuda'
);

assert.match(
  source,
  /navigationCacheKey=url=>isSafetyNavigation\(url\)\?'\.\/safety\.html'/,
  'todas as variantes da rota de ajuda devem usar safety.html como chave de cache'
);

console.log('safety slashless offline route: ok');

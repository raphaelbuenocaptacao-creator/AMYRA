import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../sw.js', import.meta.url), 'utf8');

assert.match(
  source,
  /url\.pathname===`\$\{scopePath\}plans`/,
  'o service worker deve reconhecer /plans sem barra final como navegação conhecida para manter o fallback offline da página de planos'
);

console.log('slashless plans navigation: ok');

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../safety.html', import.meta.url), 'utf8');

assert.match(
  source,
  /<a[^>]+class="skip-link"[^>]+href="#contactTitle"[^>]*>Ir direto aos contatos<\/a>/i,
  'a página Ajuda agora deve oferecer um atalho de teclado para os contatos imediatos'
);

assert.match(
  source,
  /\.skip-link:focus-visible\{[^}]*position:fixed[^}]*\}/i,
  'o atalho deve ficar visível quando recebe foco'
);

console.log('safety skip link: ok');

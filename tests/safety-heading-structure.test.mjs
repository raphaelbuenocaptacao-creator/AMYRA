import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../safety.html', import.meta.url), 'utf8');

assert.match(
  source,
  /<section[^>]+aria-labelledby="contactTitle"[^>]*>[\s\S]*?<h2[^>]+id="contactTitle"[^>]*>Contatos imediatos<\/h2>/i,
  'a página Ajuda agora deve expor uma seção nomeada para os contatos imediatos'
);

assert.match(
  source,
  /<section[^>]+aria-labelledby="stepsTitle"[^>]*>[\s\S]*?<h2[^>]+id="stepsTitle"[^>]*>Passos de segurança<\/h2>/i,
  'os passos de segurança devem ter um título semântico navegável por leitores de tela'
);

assert.match(
  source,
  /<section[^>]+class="shareBox"[^>]+aria-labelledby="shareTitle"[^>]*>[\s\S]*?<h2[^>]+id="shareTitle"[^>]*>Peça para alguém ficar com você<\/h2>/i,
  'o pedido de ajuda deve ser uma seção nomeada com heading semântico'
);

console.log('safety heading structure: ok');
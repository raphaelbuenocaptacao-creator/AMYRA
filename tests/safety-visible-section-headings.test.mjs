import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../safety.html', import.meta.url), 'utf8');

assert.match(
  source,
  /<h2 class="section-heading" id="contactTitle">Contatos imediatos<\/h2>/i,
  'os contatos imediatos devem ter um título visível para facilitar a leitura em situação de estresse'
);

assert.match(
  source,
  /<h2 class="section-heading" id="stepsTitle">Passos de segurança<\/h2>/i,
  'os passos de segurança devem ter um título visível para facilitar a leitura em situação de estresse'
);

console.log('safety visible section headings: ok');

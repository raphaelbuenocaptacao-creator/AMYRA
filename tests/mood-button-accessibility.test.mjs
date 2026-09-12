import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

for (const label of ['Muito mal', 'Mal', 'Neutro', 'Bem', 'Muito bem']) {
  assert.match(
    source,
    new RegExp(`<button class="mood"[^>]+aria-label="${label}"[^>]+aria-pressed="false"`, 'i'),
    `o botão de humor "${label}" deve ter nome acessível e estado pressionado inicial`
  );
}

assert.match(
  source,
  /setAttribute\('aria-pressed',x===b\?'true':'false'\)/,
  'selecionar um humor deve atualizar aria-pressed junto com o estado visual'
);

console.log('mood button accessibility: ok');

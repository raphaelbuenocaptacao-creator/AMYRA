import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

const modal = source.match(/<div id="safetyModal"[\s\S]*?<\/div><\/div><\/div>/)?.[0] || '';

assert.match(
  modal,
  /href="safety\.html"/i,
  'o alerta de risco do diário deve oferecer acesso direto à página Ajuda agora'
);
assert.match(
  modal,
  />\s*Ajuda agora\s*</i,
  'o link de apoio deve ter um rótulo claro e acionável'
);

console.log('journal crisis help link: ok');

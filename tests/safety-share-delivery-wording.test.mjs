import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../safety.js', import.meta.url), 'utf8');

assert.match(
  source,
  /O menu de compartilhamento foi fechado\. Confirme que alguém recebeu sua mensagem/,
  'o retorno do Web Share deve pedir confirmação humana sem presumir que a mensagem foi enviada'
);

assert.doesNotMatch(
  source,
  /Compartilhamento concluído no dispositivo/,
  'a interface não deve afirmar que o compartilhamento foi concluído quando a API só confirma o fechamento do fluxo'
);

console.log('safety share delivery wording: ok');

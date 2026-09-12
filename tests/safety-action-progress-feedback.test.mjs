import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../safety.js', import.meta.url), 'utf8');

assert.match(
  source,
  /Copiando mensagem…/,
  'a ação de copiar deve informar imediatamente que está em andamento'
);

assert.match(
  source,
  /Abrindo opções de compartilhamento…/,
  'a ação de compartilhar deve informar imediatamente que está abrindo o menu do dispositivo'
);

console.log('safety action progress feedback: ok');

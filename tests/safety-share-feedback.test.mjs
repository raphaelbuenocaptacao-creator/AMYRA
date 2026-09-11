import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../safety.js', import.meta.url), 'utf8');

assert.match(
  source,
  /confirme que alguém recebeu/i,
  'o feedback de compartilhamento deve lembrar que o app não confirma recebimento'
);
assert.doesNotMatch(
  source,
  /Pedido de ajuda compartilhado\./,
  'o feedback não deve afirmar entrega/recebimento sem confirmação'
);

console.log('safety share feedback: ok');

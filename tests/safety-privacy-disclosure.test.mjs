import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../safety.html', import.meta.url), 'utf8');

assert.match(
  source,
  /A AMYRA não envia nem inicia ligações automaticamente/i,
  'a página Ajuda agora deve explicar claramente que ações externas dependem do usuário'
);
assert.match(
  source,
  /telefone ou menu de compartilhamento do seu aparelho/i,
  'a página deve avisar que ligar ou compartilhar pode abrir recursos do próprio aparelho'
);

console.log('safety privacy disclosure: ok');

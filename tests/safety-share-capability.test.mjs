import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../safety.js', import.meta.url), 'utf8');

assert.match(
  source,
  /if \(!navigator\.share\)[\s\S]*shareBtn\.textContent\s*=\s*['"]Copiar para compartilhar['"]/,
  'quando Web Share não estiver disponível, o botão deve explicar que irá copiar a mensagem'
);

console.log('safety share capability label: ok');

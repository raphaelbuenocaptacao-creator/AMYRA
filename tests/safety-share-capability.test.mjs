import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../safety.js', import.meta.url), 'utf8');

assert.match(
  source,
  /if \(!canUseWebShare\)[\s\S]*shareBtn\.textContent\s*=\s*['"]Copiar para compartilhar['"]/,
  'quando Web Share não puder compartilhar esta mensagem, o botão deve explicar que irá copiar'
);

console.log('safety share capability label: ok');

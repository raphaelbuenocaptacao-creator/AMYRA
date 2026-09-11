import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../safety.js', import.meta.url), 'utf8');

assert.match(
  source,
  /navigator\.canShare[\s\S]*Copiar para compartilhar/,
  'quando Web Share existir mas não aceitar a mensagem, o botão deve anunciar a cópia antes do clique'
);
assert.match(
  source,
  /const\s+canUseWebShare[\s\S]*if\s*\(canUseWebShare\)/,
  'o fluxo deve compartilhar apenas quando a mensagem for suportada'
);

console.log('safety Web Share data capability: ok');

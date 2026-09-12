import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const modal = source.match(/<div id="safetyModal"[\s\S]*?<\/div><\/div><\/div>/)?.[0] || '';

assert.match(modal, /role="dialog"/i, 'o alerta de segurança deve ser exposto como diálogo');
assert.match(modal, /aria-modal="true"/i, 'o alerta de segurança deve ser anunciado como modal');
assert.match(modal, /aria-labelledby="safetyTitle"/i, 'o diálogo deve apontar para um título acessível');
assert.match(modal, /<h2 id="safetyTitle">/i, 'o título acessível do diálogo deve existir');
assert.match(modal, /id="safetyHelp"[^>]*href="safety\.html"/i, 'a ação Ajuda agora deve ter um alvo de foco estável');

assert.match(
  source,
  /function openSafety\(trigger\)[\s\S]*?safetyReturnFocus=trigger[\s\S]*?safetyHelp'\)\.focus\(\)/,
  'ao abrir, o alerta deve focar Ajuda agora e guardar o elemento de origem'
);
assert.match(
  source,
  /function closeSafety\(\)[\s\S]*?safetyReturnFocus\?\.focus\?\.\(\)/,
  'ao fechar, o alerta deve devolver o foco ao ponto de origem quando possível'
);

console.log('safety modal accessibility: ok');

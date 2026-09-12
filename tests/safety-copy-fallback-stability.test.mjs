import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../safety.js', import.meta.url), 'utf8');

assert.match(
  source,
  /function selectHelpTextSafely\(\)[\s\S]*?try\s*\{[\s\S]*?helpMessage\.focus\(\)[\s\S]*?helpMessage\.select\(\)[\s\S]*?setSelectionRange\(0, helpMessage\.value\.length\)[\s\S]*?return true[\s\S]*?catch\s*\(_\)\s*\{[\s\S]*?return false/,
  'a seleção manual da mensagem deve ser protegida contra falhas do navegador'
);

assert.match(
  source,
  /catch\s*\(_\)\s*\{\s*const selected = selectHelpTextSafely\(\);[\s\S]*?shareStatus\.textContent = selected[\s\S]*?manualSelection: selected/,
  'o fallback de cópia deve continuar com feedback mesmo se a seleção manual falhar'
);

console.log('safety copy fallback stability: ok');

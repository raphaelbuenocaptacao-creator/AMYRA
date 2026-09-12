import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../offline.html', import.meta.url), 'utf8');

assert.match(
  source,
  /id="status"[^>]*role="status"[^>]*aria-live="polite"[^>]*aria-atomic="true"/,
  'o status offline deve ser anunciado por inteiro quando a mensagem mudar'
);

console.log('offline status atomic announcement: ok');

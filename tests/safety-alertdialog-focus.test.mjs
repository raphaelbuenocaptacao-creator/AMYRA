import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

test('crisis modal is announced and focuses the immediate help action', () => {
  assert.match(html, /id="safetyModal"[^>]*role="alertdialog"[^>]*aria-modal="true"[^>]*aria-labelledby="safetyTitle"[^>]*aria-describedby="safetyDescription"/);
  assert.match(html, /<h2 id="safetyTitle">Você não precisa atravessar isso sozinho\(a\)\.<\/h2>/);
  assert.match(html, /<p class="muted" id="safetyDescription">/);
  assert.match(html, /id="safetyHelp"[^>]*href="safety\.html"/);
  assert.match(html, /function openSafetyModal\(\)\{[^}]*classList\.remove\('hide'\)[^}]*requestAnimationFrame\(\(\)=>\$\('#safetyHelp'\)\.focus\(\)\)/);
});

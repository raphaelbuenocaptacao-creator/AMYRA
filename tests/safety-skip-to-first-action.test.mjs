import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../safety.html', import.meta.url), 'utf8');

test('safety skip link lands on the first actionable emergency contact', () => {
  assert.match(html, /<a[^>]+class="skip-link"[^>]+href="#samuCall"/i, 'skip link should target the first emergency action');
  assert.match(html, /<a[^>]+id="samuCall"[^>]+href="tel:192"/i, 'SAMU 192 should be the focusable skip-link target');
});

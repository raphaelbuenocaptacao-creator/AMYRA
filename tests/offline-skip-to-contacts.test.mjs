import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../offline.html', import.meta.url), 'utf8');

test('offline fallback lets keyboard users skip directly to the first crisis contact action', () => {
  assert.match(html, /<a[^>]+class="skip-link"[^>]+href="#offlineSamuCall"/i, 'offline page should expose a keyboard skip link to the first actionable crisis contact');
  assert.match(html, /<a[^>]+id="offlineSamuCall"[^>]+href="tel:192"/i, 'skip link target should be the actionable SAMU 192 link');
  assert.match(html, /\.skip-link:focus-visible/i, 'skip link should become visibly actionable when focused');
});

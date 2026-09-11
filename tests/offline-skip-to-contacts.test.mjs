import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../offline.html', import.meta.url), 'utf8');

test('offline fallback lets keyboard users skip directly to crisis contacts', () => {
  assert.match(html, /<a[^>]+class="skip-link"[^>]+href="#offlineContactsTitle"/i, 'offline page should expose a keyboard skip link to the contacts section');
  assert.match(html, /id="offlineContactsTitle"/i, 'skip link target should be the emergency contacts heading');
  assert.match(html, /\.skip-link:focus-visible/i, 'skip link should become visibly actionable when focused');
});

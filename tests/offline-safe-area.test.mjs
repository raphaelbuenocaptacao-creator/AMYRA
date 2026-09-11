import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../offline.html', import.meta.url), 'utf8');

test('offline fallback respects mobile PWA safe areas', () => {
  assert.match(html, /min-height:\s*100dvh/i, 'offline page should use the dynamic viewport height');
  assert.match(html, /safe-area-inset-top/i, 'offline page should pad around the top display cutout');
  assert.match(html, /safe-area-inset-right/i, 'offline page should pad around the right display cutout');
  assert.match(html, /safe-area-inset-bottom/i, 'offline page should pad above the home indicator');
  assert.match(html, /safe-area-inset-left/i, 'offline page should pad around the left display cutout');
});

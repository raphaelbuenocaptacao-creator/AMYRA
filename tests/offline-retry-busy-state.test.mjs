import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const js = await readFile(new URL('../offline.js', import.meta.url), 'utf8');

test('offline reconnect exposes busy state to assistive technology', () => {
  assert.match(js, /retry\.setAttribute\('aria-busy',String\(isBusy\)\)/);
  assert.match(js, /status\.setAttribute\('aria-busy',String\(isBusy\)\)/);
  assert.match(js, /setRetryBusy\(true\)/);
  assert.match(js, /setRetryBusy\(false\)/);
});

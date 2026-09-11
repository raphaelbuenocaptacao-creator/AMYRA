import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const script = await readFile(new URL('../offline.js', import.meta.url), 'utf8');

test('offline reconnect controls reset when the page is restored from bfcache', () => {
  assert.match(script, /addEventListener\(['"]pageshow['"]/, 'offline page should handle browser history restoration');
  assert.match(script, /event\.persisted/, 'reset should be limited to bfcache restoration');
  assert.match(script, /retry\.disabled\s*=\s*false/, 'retry button should be re-enabled after restoration');
  assert.match(script, /reloading\s*=\s*false/, 'reconnect guard should be reset after restoration');
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const script = await readFile(new URL('../offline.js', import.meta.url), 'utf8');

test('offline reconnect validates the AMYRA app shell before leaving the offline page', () => {
  assert.match(script, /content-type/i, 'reconnect probe should validate an HTML response');
  assert.match(script, /response\.text\(\)/, 'reconnect probe should inspect the returned document');
  assert.match(script, /AMYRA/, 'reconnect probe should verify an AMYRA-specific marker');
});

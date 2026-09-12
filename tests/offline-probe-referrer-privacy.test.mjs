import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const script = await readFile(new URL('../offline.js', import.meta.url), 'utf8');

test('offline connectivity probe does not send a referrer', () => {
  assert.match(script, /fetch\(probe,\{[^}]*credentials:'omit'[^}]*referrerPolicy:'no-referrer'[^}]*\}\)/, 'connectivity probe should omit credentials and referrer metadata');
});

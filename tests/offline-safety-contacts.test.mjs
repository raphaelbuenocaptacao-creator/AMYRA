import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../offline.html', import.meta.url), 'utf8');

test('offline fallback exposes immediate Brazilian crisis contacts', () => {
  assert.match(html, /href=["']tel:192["']/i, 'SAMU 192 should be directly callable offline');
  assert.match(html, /href=["']tel:190["']/i, 'Polícia Militar 190 should be directly callable offline');
  assert.match(html, /href=["']tel:188["']/i, 'CVV 188 should be directly callable offline');
});

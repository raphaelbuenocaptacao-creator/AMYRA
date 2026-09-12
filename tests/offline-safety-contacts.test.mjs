import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../offline.html', import.meta.url), 'utf8');

test('offline fallback exposes immediate Brazilian crisis contacts', () => {
  assert.match(html, /href=["']tel:192["']/i, 'SAMU 192 should be directly callable offline');
  assert.match(html, /href=["']tel:190["']/i, 'Polícia Militar 190 should be directly callable offline');
  assert.match(html, /href=["']tel:188["']/i, 'CVV 188 should be directly callable offline');
});

test('offline crisis contacts have a semantic heading for assistive navigation', () => {
  assert.match(
    html,
    /<h2\b[^>]*id=["']offlineContactsTitle["'][^>]*>\s*Contatos imediatos no Brasil\s*<\/h2>/i,
    'the offline crisis-contact section should expose its title as an h2'
  );
});

test('offline fallback distinguishes emergency services from emotional support', () => {
  assert.match(
    html,
    /Risco imediato:[\s\S]*192[\s\S]*190[\s\S]*CVV 188[\s\S]*não é serviço de emergência/i,
    'offline crisis guidance should prioritize 192/190 and identify CVV 188 as emotional support, not emergency response'
  );
});

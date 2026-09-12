import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../safety.html', import.meta.url), 'utf8');

test('safety page visibly distinguishes immediate emergency contacts from emotional support', () => {
  assert.match(
    html,
    /Risco imediato:\s*priorize\s*<b>192<\/b>\s*ou\s*<b>190<\/b>\.\s*O\s*<b>CVV 188<\/b>\s*oferece apoio emocional, mas não é serviço de emergência\./i,
    'the contact section should visibly tell users to prioritize 192/190 for immediate risk and distinguish CVV 188'
  );
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

test('route and world choices expose their selected state to assistive technology', () => {
  assert.match(html, /\$\$\('\.world'\)\.forEach\(b=>\{const selected=b\.dataset\.world===state\.world;b\.classList\.toggle\('selected',selected\);b\.setAttribute\('aria-pressed',String\(selected\)\)\}\)/, 'world buttons should keep aria-pressed in sync with the visual selected state');
  assert.match(html, /\$\$\('\.route'\)\.forEach\(b=>\{const selected=b\.dataset\.intent===state\.intent;b\.classList\.toggle\('selected',selected\);b\.setAttribute\('aria-pressed',String\(selected\)\)\}\)/, 'route buttons should keep aria-pressed in sync with the visual selected state');
});

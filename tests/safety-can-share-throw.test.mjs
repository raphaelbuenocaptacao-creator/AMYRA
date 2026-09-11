import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../safety.js', import.meta.url), 'utf8');

function element(value = '') {
  return {
    value,
    textContent: '',
    disabled: false,
    setAttribute() {},
    addEventListener() {},
    focus() {},
    select() {},
    setSelectionRange() {}
  };
}

const helpMessage = element('Preciso de ajuda.');
const shareBtn = element();
const copyBtn = element();
const shareStatus = element();
const elements = {
  helpMessage,
  shareHelp: shareBtn,
  copyHelp: copyBtn,
  shareStatus
};

const context = {
  document: {
    activeElement: null,
    execCommand: () => false,
    getElementById: id => elements[id] || null
  },
  navigator: {
    share: async () => {},
    canShare() {
      throw new TypeError('unsupported share data');
    }
  },
  window: {
    isSecureContext: true,
    addEventListener() {}
  }
};

assert.doesNotThrow(
  () => runInNewContext(source, context),
  'uma exceção de navigator.canShare não deve desativar os controles de ajuda'
);
assert.equal(
  shareBtn.textContent,
  'Copiar para compartilhar',
  'se canShare falhar, o compartilhamento deve cair para a opção de copiar'
);

console.log('safety canShare throwing fallback: ok');

'use strict';

const helpMessage = document.getElementById('helpMessage');
const helpText = helpMessage.value;
const shareBtn = document.getElementById('shareHelp');
const copyBtn = document.getElementById('copyHelp');
const shareStatus = document.getElementById('shareStatus');
let actionInProgress = false;

function setActionBusy(isBusy) {
  actionInProgress = isBusy;
  shareBtn.disabled = isBusy;
  copyBtn.disabled = isBusy;
  shareBtn.setAttribute('aria-busy', String(isBusy));
  copyBtn.setAttribute('aria-busy', String(isBusy));
}

async function copyHelpText() {
  shareStatus.textContent = '';
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(helpText);
    } else {
      helpMessage.focus();
      helpMessage.select();
      helpMessage.setSelectionRange(0, helpMessage.value.length);
      if (!document.execCommand('copy')) throw new Error('copy-failed');
    }
    shareStatus.textContent = 'Mensagem copiada. Cole em uma conversa com alguém de confiança.';
    return true;
  } catch (_) {
    helpMessage.focus();
    helpMessage.select();
    helpMessage.setSelectionRange(0, helpMessage.value.length);
    shareStatus.textContent = 'Não foi possível copiar automaticamente. A mensagem ficou selecionada para você copiar manualmente.';
    return false;
  }
}

copyBtn.addEventListener('click', async () => {
  if (actionInProgress) return;
  setActionBusy(true);
  try {
    await copyHelpText();
  } finally {
    setActionBusy(false);
  }
});

shareBtn.addEventListener('click', async () => {
  if (actionInProgress) return;
  setActionBusy(true);
  shareStatus.textContent = '';
  try {
    if (navigator.share) {
      await navigator.share({ title: 'Preciso de ajuda agora', text: helpText });
      shareStatus.textContent = 'Pedido de ajuda aberto para compartilhamento.';
      return;
    }
    await copyHelpText();
  } catch (err) {
    if (err && err.name === 'AbortError') {
      shareStatus.textContent = 'Compartilhamento cancelado. Os outros atalhos de ajuda continuam disponíveis.';
      return;
    }

    // Alguns navegadores expõem Web Share, mas ainda podem falhar ao abrir
    // o compartilhamento. Nesse caso, deixe a mensagem pronta na área de
    // transferência (ou selecionada) sem exigir um segundo clique.
    await copyHelpText();
  } finally {
    setActionBusy(false);
  }
});

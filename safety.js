'use strict';

const helpMessage = document.getElementById('helpMessage');
const helpText = helpMessage.value;
const shareBtn = document.getElementById('shareHelp');
const copyBtn = document.getElementById('copyHelp');
const shareStatus = document.getElementById('shareStatus');

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

copyBtn.addEventListener('click', copyHelpText);
shareBtn.addEventListener('click', async () => {
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
  }
});

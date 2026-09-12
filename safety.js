'use strict';

const helpMessage = document.getElementById('helpMessage');
const shareBtn = document.getElementById('shareHelp');
const copyBtn = document.getElementById('copyHelp');
const shareStatus = document.getElementById('shareStatus');

// The emergency phone links in safety.html stay usable even if a cached HTML/JS
// version is temporarily out of sync after a PWA update. In that case, do not
// let an optional copy/share enhancement crash the safety page.
const sharingReady = Boolean(helpMessage && shareBtn && copyBtn && shareStatus);

if (sharingReady) {
  const helpText = helpMessage.value;
  let actionInProgress = false;
  const shareData = { title: 'Preciso de ajuda agora', text: helpText };
  const withTimeout = (promise, ms) => Promise.race([
    Promise.resolve(promise),
    new Promise((_, reject) => setTimeout(() => reject(new Error('operation-timeout')), ms))
  ]);

  function supportsWebShare(data) {
    if (typeof navigator.share !== 'function') return false;
    if (typeof navigator.canShare !== 'function') return true;
    try {
      return navigator.canShare(data);
    } catch (_) {
      // Some browsers expose canShare but can still throw for otherwise valid
      // share data. Treat that as unavailable so the copy fallback stays usable.
      return false;
    }
  }

  const canUseWebShare = supportsWebShare(shareData);

  // On browsers without usable Web Share for this message, the same action
  // falls back to copying. Say that up front so a person in distress is not
  // surprised by the result.
  if (!canUseWebShare) {
    shareBtn.textContent = 'Copiar para compartilhar';
    shareBtn.setAttribute('aria-label', 'Copiar mensagem para compartilhar com alguém de confiança');
  }

  function setActionBusy(isBusy) {
    actionInProgress = isBusy;
    shareBtn.disabled = isBusy;
    copyBtn.disabled = isBusy;
    shareBtn.setAttribute('aria-busy', String(isBusy));
    copyBtn.setAttribute('aria-busy', String(isBusy));
  }

  // Browsers can restore this page from the back/forward cache with the exact
  // previous DOM state. A stale "shared" message could look like a new send,
  // so clear transient feedback and busy state only on an actual bfcache restore.
  window.addEventListener('pageshow', event => {
    if (!event.persisted) return;
    shareStatus.textContent = '';
    setActionBusy(false);
  });

  // Selection APIs are inconsistent across older mobile browsers and embedded
  // webviews. Keep failures here contained so the crisis-help page can still
  // explain what to do instead of rejecting the whole copy action.
  function selectHelpTextSafely() {
    try {
      helpMessage.focus();
      helpMessage.select();
      helpMessage.setSelectionRange(0, helpMessage.value.length);
      return true;
    } catch (_) {
      return false;
    }
  }

  async function copyHelpText() {
    shareStatus.textContent = '';
    try {
      if (typeof navigator.clipboard?.writeText === 'function' && window.isSecureContext) {
        // A few embedded browsers expose Clipboard API but can leave the
        // returned promise pending indefinitely. Bound the wait so crisis-page
        // controls are never left disabled forever; the catch path below then
        // falls back to selection/legacy copy.
        await withTimeout(navigator.clipboard.writeText(helpText), 4000);
      } else {
        if (!selectHelpTextSafely()) throw new Error('selection-failed');
        if (!document.execCommand('copy')) throw new Error('copy-failed');
      }
      shareStatus.textContent = 'Mensagem copiada. Cole em uma conversa com alguém de confiança.';
      return { copied: true, manualSelection: false };
    } catch (_) {
      const selected = selectHelpTextSafely();
      shareStatus.textContent = selected
        ? 'Não foi possível copiar automaticamente. A mensagem ficou selecionada para você copiar manualmente.'
        : 'Não foi possível copiar automaticamente. Se puder, toque e segure a mensagem para copiá-la manualmente.';
      return { copied: false, manualSelection: selected };
    }
  }

  copyBtn.addEventListener('click', async () => {
    if (actionInProgress) return;
    setActionBusy(true);
    let result;
    try {
      result = await copyHelpText();
    } finally {
      setActionBusy(false);
    }
    // Keep keyboard/screen-reader users anchored on the action they triggered.
    // If automatic copy failed, leave focus on the selected message so Ctrl/Cmd+C
    // still works immediately.
    if (result && result.copied && document.activeElement === helpMessage) copyBtn.focus();
  });

  shareBtn.addEventListener('click', async () => {
    if (actionInProgress) return;
    setActionBusy(true);
    shareStatus.textContent = '';
    let fallbackResult = null;
    try {
      if (canUseWebShare) {
        await navigator.share(shareData);
        shareStatus.textContent = 'Compartilhamento concluído no dispositivo. Se puder, confirme que alguém recebeu sua mensagem.';
        return;
      }
      fallbackResult = await copyHelpText();
    } catch (err) {
      if (err && err.name === 'AbortError') {
        shareStatus.textContent = 'Compartilhamento cancelado. Os outros atalhos de ajuda continuam disponíveis.';
        return;
      }

      // Alguns navegadores expõem Web Share, mas ainda podem falhar ao abrir
      // o compartilhamento. Nesse caso, deixe a mensagem pronta na área de
      // transferência (ou selecionada) sem exigir um segundo clique.
      fallbackResult = await copyHelpText();
    } finally {
      setActionBusy(false);
      // Preserve manual-selection fallback, otherwise restore a predictable
      // keyboard focus position after browser share/fallback flows.
      if (!(fallbackResult && fallbackResult.manualSelection) && document.activeElement === helpMessage) shareBtn.focus();
    }
  });
}

/**
 * UI Module
 * Gerencia toda a manipulação do DOM e interface
 */

const UI = (function() {
  const elements = {};

  function cacheElements() {
    elements.guessBtn = document.getElementById('palpitar');
    elements.restartBtn = document.getElementById('reiniciar');
    elements.input = document.getElementById('input');
    elements.message = document.getElementById('mensagem');
    elements.messageBox = document.getElementById('mensagem-box');
    elements.guessesList = document.getElementById('palpites');
    elements.attemptsCount = document.getElementById('tentativas-count');
    elements.remainingCount = document.getElementById('restantes-count');
    elements.soundBtn = document.getElementById('sound-toggle');
    elements.statsBtn = document.getElementById('stats-btn');
    elements.statsModal = document.getElementById('stats-modal');
    elements.closeModalBtn = document.getElementById('close-modal');
  }

  function updateStats(attempts, remaining) {
    elements.attemptsCount.textContent = attempts;
    elements.remainingCount.textContent = remaining;
  }

  function setMessage(text, type = 'neutral') {
    elements.message.textContent = text;
    elements.messageBox.className = 'message-box';
    
    if (type !== 'neutral') {
      elements.messageBox.classList.add(type);
    }
  }

  function addGuessChip(guess, type) {
    const chip = document.createElement('span');
    chip.className = `palpite-chip ${type}`;
    chip.textContent = guess;
    elements.guessesList.appendChild(chip);
  }

  function clearGuesses() {
    elements.guessesList.innerHTML = '';
  }

  function getInputValue() {
    return parseInt(elements.input.value);
  }

  function clearInput() {
    elements.input.value = '';
  }

  function focusInput() {
    elements.input.focus();
  }

  function setInputDisabled(disabled) {
    elements.input.disabled = disabled;
  }

  function setGuessButtonDisabled(disabled) {
    elements.guessBtn.disabled = disabled;
  }

  function disableGame() {
    setInputDisabled(true);
    setGuessButtonDisabled(true);
  }

  function enableGame() {
    setInputDisabled(false);
    setGuessButtonDisabled(false);
  }

  function updateSoundIcon(enabled) {
    if (!elements.soundBtn) return;
    
    const icon = elements.soundBtn.querySelector('svg');
    if (icon) {
      icon.innerHTML = enabled 
        ? '<path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
        : '<path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>';
    }
  }

  function showStatsModal(stats) {
    if (!elements.statsModal) return;

    document.getElementById('stat-played').textContent = stats.gamesPlayed;
    document.getElementById('stat-win-rate').textContent = stats.winRate + '%';
    document.getElementById('stat-streak').textContent = stats.currentStreak;
    document.getElementById('stat-best').textContent = stats.bestScore || '-';

    elements.statsModal.classList.add('show');
  }

  function hideStatsModal() {
    if (!elements.statsModal) return;
    elements.statsModal.classList.remove('show');
  }

  function bindEvents(handlers) {
    elements.guessBtn.addEventListener('click', handlers.onGuess);
    elements.restartBtn.addEventListener('click', handlers.onRestart);
    
    elements.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        handlers.onGuess();
      }
    });

    if (elements.soundBtn) {
      elements.soundBtn.addEventListener('click', handlers.onToggleSound);
    }

    if (elements.statsBtn) {
      elements.statsBtn.addEventListener('click', handlers.onShowStats);
    }

    if (elements.closeModalBtn) {
      elements.closeModalBtn.addEventListener('click', hideStatsModal);
    }

    if (elements.statsModal) {
      elements.statsModal.addEventListener('click', (e) => {
        if (e.target === elements.statsModal) {
          hideStatsModal();
        }
      });
    }
  }

  function getMessageBox() {
    return elements.messageBox;
  }

  function getInput() {
    return elements.input;
  }

  function init() {
    cacheElements();
  }

  return {
    init,
    updateStats,
    setMessage,
    addGuessChip,
    clearGuesses,
    getInputValue,
    clearInput,
    focusInput,
    disableGame,
    enableGame,
    bindEvents,
    getMessageBox,
    getInput,
    updateSoundIcon,
    showStatsModal,
    hideStatsModal
  };
})();

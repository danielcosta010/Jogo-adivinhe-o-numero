/**
 * App Module
 * Ponto de entrada principal - conecta todos os módulos
 */

const App = (function() {
  function handleGuess() {
    const guess = UI.getInputValue();
    const config = Game.getConfig();

    if (isNaN(guess) || guess < config.MIN_NUMBER || guess > config.MAX_NUMBER) {
      UI.setMessage(`⚠️ Digite um número entre ${config.MIN_NUMBER} e ${config.MAX_NUMBER}`, 'danger');
      Effects.shake(UI.getInput());
      Effects.playSound('error');
      UI.clearInput();
      UI.focusInput();
      return;
    }

    const result = Game.makeGuess(guess);

    if (!result.success) {
      if (result.error === 'already_guessed') {
        UI.setMessage(`Você já tentou o número ${result.guess}!`, 'warning');
        Effects.shake(UI.getMessageBox());
      }
      UI.clearInput();
      UI.focusInput();
      return;
    }

    const state = Game.getState();
    UI.updateStats(state.attempts, state.remaining);

    if (result.isCorrect) {
      UI.setMessage(
        `🎉 Parabéns! O número era ${result.guess}. Você acertou em ${result.attempts} ${result.attempts === 1 ? 'tentativa' : 'tentativas'}!`,
        'success'
      );
      UI.addGuessChip(result.guess, 'correct');
      Effects.celebrate(UI.getMessageBox());
      Effects.celebrateWin();
      UI.disableGame();
    } else if (result.isGameOver) {
      UI.setMessage(`😔 Fim de jogo! O número era ${result.secretNumber}. Tente novamente!`, 'danger');
      UI.addGuessChip(result.guess, result.isHigher ? 'higher' : 'lower');
      Effects.shake(UI.getMessageBox());
      Effects.playSound('error');
      UI.disableGame();
    } else {
      if (result.isHigher) {
        UI.setMessage(`⬆️ O número é maior que ${result.guess}`, 'warning');
        UI.addGuessChip(result.guess, 'higher');
      } else {
        UI.setMessage(`⬇️ O número é menor que ${result.guess}`, 'warning');
        UI.addGuessChip(result.guess, 'lower');
      }
      Effects.shake(UI.getMessageBox());
      Effects.playSound('click');
    }

    UI.clearInput();
    UI.focusInput();
  }

  function handleRestart() {
    Game.reset();
    const state = Game.getState();
    
    UI.enableGame();
    UI.clearGuesses();
    UI.setMessage('Faça seu primeiro palpite!');
    UI.updateStats(state.attempts, state.remaining);
    UI.clearInput();
    UI.focusInput();
    
    Effects.playSound('click');
  }

  function handleToggleSound() {
    const enabled = Effects.toggleSound();
    UI.updateSoundIcon(enabled);
  }

  function handleShowStats() {
    const stats = Game.getStats();
    UI.showStatsModal(stats);
  }

  function init() {
    UI.init();
    Game.init();
    Effects.init();

    UI.bindEvents({
      onGuess: handleGuess,
      onRestart: handleRestart,
      onToggleSound: handleToggleSound,
      onShowStats: handleShowStats
    });

    const state = Game.getState();
    UI.updateStats(state.attempts, state.remaining);
    UI.updateSoundIcon(Effects.isSoundEnabled());
    UI.focusInput();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', App.init);

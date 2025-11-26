/**
 * Game Logic Module
 * Gerencia toda a lógica do jogo de adivinhação
 */

const Game = (function() {
  const CONFIG = {
    MIN_NUMBER: 1,
    MAX_NUMBER: 100,
    MAX_ATTEMPTS: 6,
    STORAGE_KEY: 'guessGame_stats'
  };

  let state = {
    secretNumber: 0,
    attempts: 0,
    guesses: [],
    isGameOver: false,
    difficulty: 'normal'
  };

  let stats = {
    gamesPlayed: 0,
    gamesWon: 0,
    totalAttempts: 0,
    bestScore: null,
    currentStreak: 0,
    bestStreak: 0
  };

  function generateSecretNumber() {
    return Math.floor(Math.random() * CONFIG.MAX_NUMBER) + CONFIG.MIN_NUMBER;
  }

  function init() {
    loadStats();
    reset();
  }

  function reset() {
    state.secretNumber = generateSecretNumber();
    state.attempts = 0;
    state.guesses = [];
    state.isGameOver = false;
  }

  function makeGuess(guess) {
    if (state.isGameOver) {
      return { success: false, error: 'game_over' };
    }

    if (guess < CONFIG.MIN_NUMBER || guess > CONFIG.MAX_NUMBER) {
      return { success: false, error: 'out_of_range' };
    }

    if (state.guesses.includes(guess)) {
      return { success: false, error: 'already_guessed', guess };
    }

    state.guesses.push(guess);
    state.attempts++;

    const result = {
      success: true,
      guess,
      attempts: state.attempts,
      remaining: CONFIG.MAX_ATTEMPTS - state.attempts,
      isCorrect: guess === state.secretNumber,
      isHigher: guess < state.secretNumber,
      isGameOver: false,
      isWin: false,
      secretNumber: null
    };

    if (result.isCorrect) {
      result.isGameOver = true;
      result.isWin = true;
      result.secretNumber = state.secretNumber;
      state.isGameOver = true;
      updateStats(true);
    } else if (state.attempts >= CONFIG.MAX_ATTEMPTS) {
      result.isGameOver = true;
      result.isWin = false;
      result.secretNumber = state.secretNumber;
      state.isGameOver = true;
      updateStats(false);
    }

    return result;
  }

  function updateStats(won) {
    stats.gamesPlayed++;
    stats.totalAttempts += state.attempts;

    if (won) {
      stats.gamesWon++;
      stats.currentStreak++;
      
      if (stats.bestScore === null || state.attempts < stats.bestScore) {
        stats.bestScore = state.attempts;
      }
      
      if (stats.currentStreak > stats.bestStreak) {
        stats.bestStreak = stats.currentStreak;
      }
    } else {
      stats.currentStreak = 0;
    }

    saveStats();
  }

  function saveStats() {
    try {
      localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(stats));
    } catch (e) {
      console.warn('Could not save stats to localStorage');
    }
  }

  function loadStats() {
    try {
      const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
      if (saved) {
        stats = { ...stats, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Could not load stats from localStorage');
    }
  }

  function getState() {
    return {
      attempts: state.attempts,
      remaining: CONFIG.MAX_ATTEMPTS - state.attempts,
      guesses: [...state.guesses],
      isGameOver: state.isGameOver,
      maxAttempts: CONFIG.MAX_ATTEMPTS
    };
  }

  function getStats() {
    const winRate = stats.gamesPlayed > 0 
      ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) 
      : 0;
    
    const avgAttempts = stats.gamesWon > 0 
      ? (stats.totalAttempts / stats.gamesWon).toFixed(1) 
      : '-';

    return {
      ...stats,
      winRate,
      avgAttempts
    };
  }

  function getConfig() {
    return { ...CONFIG };
  }

  return {
    init,
    reset,
    makeGuess,
    getState,
    getStats,
    getConfig
  };
})();

/**
 * Effects Module
 * Gerencia efeitos visuais, animações e sons
 */

const Effects = (function() {
  const COLORS = {
    theme: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6'],
    rainbow: ['#ff0000', '#ffa500', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff']
  };

  const SOUNDS = {
    click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
    success: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
    error: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3',
    win: 'https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3'
  };

  let soundEnabled = true;
  const audioCache = {};

  function preloadSounds() {
    Object.entries(SOUNDS).forEach(([key, url]) => {
      const audio = new Audio(url);
      audio.volume = 0.3;
      audioCache[key] = audio;
    });
  }

  function playSound(soundName) {
    if (!soundEnabled) return;
    
    try {
      const audio = audioCache[soundName];
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }
    } catch (e) {
      console.warn('Could not play sound');
    }
  }

  function toggleSound() {
    soundEnabled = !soundEnabled;
    return soundEnabled;
  }

  function isSoundEnabled() {
    return soundEnabled;
  }

  function shake(element) {
    element.classList.add('shake');
    setTimeout(() => element.classList.remove('shake'), 500);
  }

  function pulse(element) {
    element.classList.add('pulse');
    setTimeout(() => element.classList.remove('pulse'), 500);
  }

  function celebrate(element) {
    element.classList.add('celebrate');
    setTimeout(() => element.classList.remove('celebrate'), 600);
  }

  function fireConfetti() {
    if (typeof confetti === 'undefined') return;

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: COLORS.theme
    });

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: COLORS.theme
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: COLORS.theme
      });
    }, 300);

    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 },
        colors: COLORS.theme,
        startVelocity: 45
      });
    }, 600);
  }

  function fireFireworks() {
    if (typeof confetti === 'undefined') return;

    const duration = 4000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: COLORS.rainbow
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: COLORS.rainbow
      });
    }, 250);
  }

  function celebrateWin() {
    playSound('win');
    fireConfetti();
    setTimeout(fireFireworks, 800);
  }

  function init() {
    preloadSounds();
  }

  return {
    init,
    shake,
    pulse,
    celebrate,
    celebrateWin,
    playSound,
    toggleSound,
    isSoundEnabled
  };
})();

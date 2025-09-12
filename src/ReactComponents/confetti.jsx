import confetti from "canvas-confetti";

// Anima i coriandoli per ~1.2s e ritorna una Promise
export function shootConfetti(duration = 1200) {
  return new Promise((resolve) => {
    const end = Date.now() + duration;

    (function frame() {
      confetti({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0 } });
      confetti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1 } });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      } else {
        resolve();
      }
    })();
  });
}

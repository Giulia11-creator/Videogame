import kaplay from "kaplay";

export default function initKaplay() {
  const canvas = document.getElementById("game");

  if (!canvas) {
    throw new Error('Canvas #game non trovato');
  }

  return kaplay({
    width: 1920,
    height: 1080,
    letterbox: true,
    global: false,
    debug: true, // false in prod
    debugKey: "f1",
    canvas,
    pixelDensity: window.devicePixelRatio || 1,
    gl: false, // forza canvas renderer
  });
}
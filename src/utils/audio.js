/**
 * Web Audio API synthesizer for SOS countdown and emergency siren sounds.
 * Generates audio on the fly without requiring external MP3/WAV assets.
 */

let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Plays a single short beep for countdown (e.g. 5, 4, 3, 2, 1)
export function playCountdownBeep(frequency = 880, duration = 0.15) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (err) {
    console.warn('Audio playback not permitted or supported:', err);
  }
}

// Plays high-pitch urgent activation alarm burst
export function playActivationAlert() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.3);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.5);
  } catch (err) {
    console.warn('Activation sound error:', err);
  }
}

// Continuous alternating emergency siren synthesizer
let sirenOscillator = null;
let sirenLFO = null;
let sirenGain = null;

export function startSiren() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    stopSiren();

    const now = ctx.currentTime;
    sirenOscillator = ctx.createOscillator();
    sirenLFO = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    sirenGain = ctx.createGain();

    // Frequency modulation for wailing European/US siren
    sirenOscillator.type = 'sine';
    sirenOscillator.frequency.setValueAtTime(750, now);

    sirenLFO.type = 'triangle';
    sirenLFO.frequency.setValueAtTime(1.5, now); // 1.5 cycles per second

    lfoGain.gain.setValueAtTime(250, now); // swing between 500Hz and 1000Hz

    sirenLFO.connect(lfoGain);
    lfoGain.connect(sirenOscillator.frequency);

    sirenGain.gain.setValueAtTime(0.2, now);

    sirenOscillator.connect(sirenGain);
    sirenGain.connect(ctx.destination);

    sirenOscillator.start(now);
    sirenLFO.start(now);
  } catch (err) {
    console.warn('Siren start error:', err);
  }
}

export function stopSiren() {
  try {
    if (sirenOscillator) {
      sirenOscillator.stop();
      sirenOscillator.disconnect();
      sirenOscillator = null;
    }
    if (sirenLFO) {
      sirenLFO.stop();
      sirenLFO.disconnect();
      sirenLFO = null;
    }
    if (sirenGain) {
      sirenGain.disconnect();
      sirenGain = null;
    }
  } catch (err) {
    console.warn('Siren stop error:', err);
  }
}

// Generates a simple chiptune melody using Web Audio API
export function createMusicPlayer() {
  let audioContext: AudioContext | null = null;
  let isPlaying = false;
  let intervalId: number | null = null;
  let masterGain: GainNode | null = null;

  const notes = [
    523.25, 587.33, 659.25, 698.46, 783.99, 880.0, 987.77, 1046.5, // C5 to C6
  ];

  // Simple MSM-style melody pattern (-1 = rest)
  const melody = [0, 2, 4, 5, 4, 2, 0, 2, 4, 7, 5, 4, 2, 0, -1, 0];

  function playNote(freq: number, duration: number, time: number) {
    if (!audioContext || !masterGain) return;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = "square";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.08, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(time);
    osc.stop(time + duration);
  }

  function start() {
    if (isPlaying) return;
    audioContext = new AudioContext();
    masterGain = audioContext.createGain();
    masterGain.gain.value = 0.5;
    masterGain.connect(audioContext.destination);
    isPlaying = true;
    let noteIndex = 0;

    function playNextBeat() {
      if (!audioContext || !isPlaying) return;
      const idx = melody[noteIndex % melody.length];
      if (idx >= 0) {
        playNote(notes[idx], 0.2, audioContext.currentTime);
      }
      noteIndex++;
    }

    playNextBeat();
    intervalId = window.setInterval(playNextBeat, 300);
  }

  function stop() {
    isPlaying = false;
    if (intervalId) clearInterval(intervalId);
    if (audioContext) audioContext.close();
    audioContext = null;
    masterGain = null;
  }

  function setVolume(vol: number) {
    if (masterGain) {
      masterGain.gain.value = Math.max(0, Math.min(1, vol));
    }
  }

  return { start, stop, setVolume, isPlaying: () => isPlaying };
}

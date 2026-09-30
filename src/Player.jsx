import { useEffect, useRef, useState } from 'react';
import { tapes } from './content.js';

const BARS = 26;

// Plays Hideaway on repeat, and draws it as a live soundwave.
export default function Player() {
  const audio = useRef(null);
  const canvas = useRef(null);
  const graph = useRef(null);
  const playingRef = useRef(false);
  const index = 0;
  const [playing, setPlaying] = useState(false);

  // the analyser can only be built after a gesture, or the audio would route into a silent context
  const ensureGraph = () => {
    if (graph.current) {
      graph.current.ctx.resume();
      return;
    }
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.8;
    ctx.createMediaElementSource(audio.current).connect(analyser).connect(ctx.destination);
    graph.current = { ctx, analyser, data: new Uint8Array(analyser.frequencyBinCount) };
    ctx.resume();
  };

  useEffect(() => {
    const a = new Audio(new URL(tapes[0].src, window.location.href).href);
    a.preload = 'none';
    a.loop = true;
    a.volume = 0.45;
    audio.current = a;
    const onGesture = (e) => {
      window.removeEventListener('pointerdown', onGesture);
      window.removeEventListener('keydown', onGesture);
      ensureGraph();
      // browsers keep sound off until a first gesture, so that is when the music starts
      if (!e.target.closest?.('.player-controls')) setPlaying(true);
    };
    window.addEventListener('pointerdown', onGesture);
    window.addEventListener('keydown', onGesture);
    a.play().then(() => setPlaying(true)).catch(() => {});
    return () => {
      window.removeEventListener('pointerdown', onGesture);
      window.removeEventListener('keydown', onGesture);
      a.pause();
      a.src = '';
      graph.current?.ctx.close();
      graph.current = null;
    };
  }, []);

  useEffect(() => {
    const a = audio.current;
    const src = new URL(tapes[index].src, window.location.href).href;
    if (a.src !== src) a.src = src;
    playingRef.current = playing;
    if (playing) a.play().catch(() => setPlaying(false));
    else a.pause();
  }, [index, playing]);

  useEffect(() => {
    const c = canvas.current;
    const g = c.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = c.clientWidth * dpr;
    c.height = c.clientHeight * dpr;
    const levels = new Float32Array(BARS);
    let raf;
    const draw = (time) => {
      const w = c.width, h = c.height;
      const gr = graph.current;
      if (gr && playingRef.current) gr.analyser.getByteFrequencyData(gr.data);
      for (let i = 0; i < BARS; i++) {
        let target;
        if (!playingRef.current) target = 0.08 + 0.05 * Math.sin(i * 0.9);
        else if (gr) target = gr.data[Math.floor(Math.pow(i / BARS, 1.6) * (gr.data.length * 0.7))] / 255;
        else target = 0.25 + 0.5 * Math.abs(Math.sin(time / 260 + i * 0.7) * Math.sin(time / 410 + i * 0.3));
        levels[i] += (target - levels[i]) * 0.25;
      }
      g.clearRect(0, 0, w, h);
      g.fillStyle = '#ffffff';
      const step = w / BARS, bw = Math.max(1.5 * dpr, step * 0.42);
      for (let i = 0; i < BARS; i++) {
        const bh = Math.max(1.5 * dpr, levels[i] * h);
        g.fillRect(i * step + (step - bw) / 2, (h - bh) / 2, bw, bh);
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  const track = tapes[index];

  return (
    <div className={`player ${playing ? 'is-playing' : ''}`}>
      <canvas ref={canvas} className="wave" aria-hidden="true" />
      <div className="player-meta">
        <span className="player-side">{playing ? 'Now playing' : 'Paused'}</span>
        <span className="player-title">{track.title}</span>
      </div>
      <div className="player-controls">
        <button
          type="button"
          onClick={() => {
            ensureGraph();
            setPlaying((p) => !p);
          }}
          aria-label={playing ? `Pause ${track.title}` : `Play ${track.title}`}
        >
          <svg viewBox="0 0 12 12" aria-hidden="true">
            {playing ? <path d="M3 2h2v8H3zM7 2h2v8H7z" /> : <path d="M3 1.8 10 6 3 10.2Z" />}
          </svg>
        </button>
      </div>
    </div>
  );
}

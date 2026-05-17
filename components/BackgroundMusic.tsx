'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const PREF_KEY = 'qiaopi:bgm-enabled';
const THEME_SRC = '/ama-letter-theme.mp3';
const NOTES = [261.63, 293.66, 329.63, 392.0, 440.0, 392.0, 329.63, 293.66];

type WebKitAudioWindow = Window & {
  webkitAudioContext?: typeof AudioContext;
};

function idle(callback: () => void) {
  if ('requestIdleCallback' in window) {
    const id = window.requestIdleCallback(callback, { timeout: 1800 });
    return () => window.cancelIdleCallback(id);
  }
  const id = globalThis.setTimeout(callback, 800);
  return () => globalThis.clearTimeout(id);
}

export function BackgroundMusic() {
  const [hydrated, setHydrated] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const timerRef = useRef<number | null>(null);
  const stepRef = useRef(0);
  const enabledRef = useRef(true);
  const startingRef = useRef(false);
  const playingRef = useRef(false);
  const themeAvailableRef = useRef<boolean | null>(null);

  useEffect(() => {
    try {
      setEnabled(localStorage.getItem(PREF_KEY) !== 'off');
    } catch {
      setEnabled(true);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    enabledRef.current = enabled;
    if (!hydrated) return;
    try {
      localStorage.setItem(PREF_KEY, enabled ? 'on' : 'off');
    } catch {
      // Ignore private browsing storage errors.
    }
  }, [enabled, hydrated]);

  const stopAll = useCallback(() => {
    playingRef.current = false;
    startingRef.current = false;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (contextRef.current) {
      void contextRef.current.close();
      contextRef.current = null;
      masterRef.current = null;
    }
  }, []);

  const checkThemeFile = useCallback(async () => {
    if (themeAvailableRef.current !== null) return themeAvailableRef.current;
    try {
      const res = await fetch(THEME_SRC, { method: 'HEAD', cache: 'force-cache' });
      const type = res.headers.get('content-type') ?? '';
      themeAvailableRef.current = res.ok && type.startsWith('audio/');
    } catch {
      themeAvailableRef.current = false;
    }
    return themeAvailableRef.current;
  }, []);

  const playNote = useCallback((ctx: AudioContext, master: GainNode, step: number) => {
    const now = ctx.currentTime;
    const freq = NOTES[step % NOTES.length];
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = step % 4 === 0 ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.028, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.25);

    osc.connect(gain);
    gain.connect(master);
    osc.start(now);
    osc.stop(now + 1.35);

    if (step % 4 === 0) {
      const bass = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bass.type = 'sine';
      bass.frequency.setValueAtTime(freq / 2, now);
      bassGain.gain.setValueAtTime(0.0001, now);
      bassGain.gain.linearRampToValueAtTime(0.018, now + 0.08);
      bassGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
      bass.connect(bassGain);
      bassGain.connect(master);
      bass.start(now);
      bass.stop(now + 1.9);
    }
  }, []);

  const startSynth = useCallback(async () => {
    if (!enabledRef.current || playingRef.current) return;
    const AudioContextCtor = window.AudioContext ?? (window as WebKitAudioWindow).webkitAudioContext;
    if (!AudioContextCtor) return;
    const ctx = new AudioContextCtor();
    const master = ctx.createGain();
    master.gain.value = 0.42;
    master.connect(ctx.destination);
    contextRef.current = ctx;
    masterRef.current = master;
    if (ctx.state === 'suspended') await ctx.resume();
    playingRef.current = true;
    playNote(ctx, master, stepRef.current++);
    timerRef.current = window.setInterval(() => {
      if (!contextRef.current || !masterRef.current || !enabledRef.current) return;
      playNote(contextRef.current, masterRef.current, stepRef.current++);
    }, 1150);
  }, [playNote]);

  const startMusic = useCallback(async () => {
    if (!enabledRef.current || playingRef.current || startingRef.current) return;
    startingRef.current = true;
    const hasTheme = await checkThemeFile();
    if (!enabledRef.current) {
      startingRef.current = false;
      return;
    }

    if (hasTheme) {
      const audio = audioRef.current ?? new Audio(THEME_SRC);
      audioRef.current = audio;
      audio.loop = true;
      audio.preload = 'none';
      audio.volume = 0.32;
      try {
        await audio.play();
        playingRef.current = true;
        startingRef.current = false;
        return;
      } catch {
        // Autoplay can fail before user interaction. Fall back to WebAudio on gesture.
      }
    }

    try {
      await startSynth();
    } finally {
      startingRef.current = false;
    }
  }, [checkThemeFile, startSynth]);

  useEffect(() => {
    if (!hydrated) return;
    if (!enabled) {
      stopAll();
      return;
    }
    const cancelIdle = idle(() => {
      void startMusic();
    });
    const resume = () => {
      void startMusic();
    };
    window.addEventListener('pointerdown', resume, { once: true, capture: true });
    window.addEventListener('keydown', resume, { once: true, capture: true });
    return () => {
      cancelIdle();
      window.removeEventListener('pointerdown', resume, { capture: true });
      window.removeEventListener('keydown', resume, { capture: true });
    };
  }, [enabled, hydrated, startMusic, stopAll]);

  useEffect(() => () => stopAll(), [stopAll]);

  return (
    <button
      type="button"
      aria-label={enabled ? '关闭背景音乐' : '打开背景音乐'}
      onClick={() => setEnabled((value) => !value)}
      className="fixed bottom-4 right-4 z-40 border border-ink/25 bg-paper/90 px-3 py-2 text-[10px] tracking-[0.25em] text-ink/70 shadow-[0_10px_24px_-18px_rgba(60,40,20,0.7)] backdrop-blur transition-colors hover:border-ink/50 hover:text-ink"
    >
      {enabled ? '乐 关' : '乐 开'}
    </button>
  );
}

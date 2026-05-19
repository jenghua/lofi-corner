"use client";

import { useState, useEffect, useRef } from "react";

interface Sound { id: string; name: string; emoji: string; color: string; }

const SOUNDS: Sound[] = [
  { id: "rain",     name: "Rain",      emoji: "🌧️", color: "#06b6d4" },
  { id: "cafe",     name: "Café",      emoji: "☕",  color: "#d97706" },
  { id: "fire",     name: "Fireplace", emoji: "🔥", color: "#ef4444" },
  { id: "forest",   name: "Forest",    emoji: "🌲", color: "#10b981" },
  { id: "ocean",    name: "Ocean",     emoji: "🌊", color: "#3b82f6" },
  { id: "keyboard", name: "Keyboard",  emoji: "⌨️", color: "#8b5cf6" },
];

const useNoise = (id: string, active: boolean, volume: number) => {
  const ctxRef  = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (!active) return;

    const ctx = ctxRef.current ?? new AudioContext();
    ctxRef.current = ctx;
    if (ctx.state === "suspended") ctx.resume();

    const gain = ctx.createGain();
    gain.gain.value = volume / 100;
    gain.connect(ctx.destination);
    gainRef.current = gain;

    const len = ctx.sampleRate * 4;
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);

    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      if (id === "rain" || id === "ocean") {
        for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * 0.45;
      } else if (id === "fire") {
        let last = 0;
        for (let i = 0; i < len; i++) {
          const w = Math.random() * 2 - 1;
          d[i] = (last + 0.02 * w) / 1.02 * 3.5;
          last = d[i] / 3.5;
        }
      } else {
        let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
        for (let i = 0; i < len; i++) {
          const w = Math.random() * 2 - 1;
          b0 = 0.99886*b0 + w*0.0555179; b1 = 0.99332*b1 + w*0.0750759;
          b2 = 0.96900*b2 + w*0.1538520; b3 = 0.86650*b3 + w*0.3104856;
          b4 = 0.55000*b4 + w*0.5329522; b5 =-0.76160*b5 - w*0.0168980;
          d[i] = (b0+b1+b2+b3+b4+b5+b6+w*0.5362)*0.11;
          b6 = w * 0.115926;
        }
      }
    }

    const src = ctx.createBufferSource();
    src.buffer = buf; src.loop = true;
    src.connect(gain); src.start();

    return () => { try { src.stop(); } catch {} gain.disconnect(); };
  }, [id, active]);

  useEffect(() => {
    if (gainRef.current) gainRef.current.gain.value = volume / 100;
  }, [volume]);
};

const SoundRow = ({ sound, active, volume, onChange }: {
  sound: Sound; active: boolean; volume: number;
  onChange: (active: boolean, volume: number) => void;
}) => {
  useNoise(sound.id, active, volume);

  return (
    <div style={{
      borderRadius: 12, overflow: "hidden",
      border: `1px solid ${active ? sound.color + "50" : "rgba(255,255,255,0.06)"}`,
      background: active ? `${sound.color}12` : "rgba(255,255,255,0.03)",
      transition: "border-color 0.2s, background 0.2s",
    }}>
      {/* Row */}
      <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px" }}>
        <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0 }}>{sound.emoji}</span>
        <span style={{ flex: 1, fontSize: 13, color: active ? "#e2e8f0" : "#94a3b8", fontWeight: active ? 500 : 400 }}>
          {sound.name}
        </span>
        {/* Toggle */}
        <button
          onClick={() => onChange(!active, volume)}
          style={{
            position: "relative", flexShrink: 0,
            width: 38, height: 22, borderRadius: 11, border: "none", cursor: "pointer",
            background: active ? sound.color : "rgba(255,255,255,0.12)",
            transition: "background 0.2s",
            padding: 0,
          }}
        >
          <div style={{
            position: "absolute",
            top: 4, left: active ? 20 : 4,
            width: 14, height: 14, borderRadius: "50%",
            background: "white",
            boxShadow: "0 1px 3px rgba(0,0,0,0.35)",
            transition: "left 0.18s ease",
          }} />
        </button>
      </div>

      {/* Volume slider — only when active */}
      {active && (
        <div style={{ padding: "0 12px 10px" }}>
          <input
            type="range" min={0} max={100} value={volume}
            onChange={e => onChange(true, +e.target.value)}
            style={{
              background: `linear-gradient(to right,${sound.color} 0%,${sound.color} ${volume}%,rgba(255,255,255,0.12) ${volume}%)`,
            }}
          />
        </div>
      )}
    </div>
  );
};

const AmbientMixer = () => {
  const [states, setStates] = useState<Record<string, { active: boolean; volume: number }>>(
    Object.fromEntries(SOUNDS.map(s => [s.id, { active: false, volume: 50 }]))
  );

  const activeCount = Object.values(states).filter(s => s.active).length;

  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 14, padding: "14px 16px",
      display: "flex", flexDirection: "column", gap: 10,
    }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <span style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Ambient Sounds
        </span>
        {activeCount > 0 && (
          <span style={{
            fontSize: 11, padding: "2px 8px", borderRadius: 20,
            background: "rgba(124,58,237,0.25)", color: "#a78bfa",
          }}>
            {activeCount} on
          </span>
        )}
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
        {SOUNDS.map(sound => (
          <SoundRow
            key={sound.id}
            sound={sound}
            active={states[sound.id].active}
            volume={states[sound.id].volume}
            onChange={(active, volume) =>
              setStates(prev => ({ ...prev, [sound.id]: { active, volume } }))
            }
          />
        ))}
      </div>
    </div>
  );
};

export default AmbientMixer;

"use client";

import { useState, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

type Mode = "focus" | "short" | "long";

const MODES: { id: Mode; label: string; short: string; minutes: number; color: string }[] = [
  { id: "focus", label: "Focus",       short: "Focus",  minutes: 25, color: "#7c3aed" },
  { id: "short", label: "Short Break", short: "Short",  minutes:  5, color: "#06b6d4" },
  { id: "long",  label: "Long Break",  short: "Long",   minutes: 15, color: "#10b981" },
];

const beep = () => {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(660, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.start(); osc.stop(ctx.currentTime + 0.6);
  } catch {}
};

const PomodoroTimer = () => {
  const [mode, setMode] = useState<Mode>("focus");
  const [secs, setSecs] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);

  const current = MODES.find(m => m.id === mode)!;
  const total = current.minutes * 60;
  const progress = 1 - secs / total;

  const reset = useCallback((m: Mode = mode) => {
    const data = MODES.find(x => x.id === m)!;
    setSecs(data.minutes * 60);
    setRunning(false);
  }, [mode]);

  const switchMode = (m: Mode) => { setMode(m); reset(m); };

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setSecs(s => {
        if (s <= 1) {
          setRunning(false);
          if (mode === "focus") setSessions(n => n + 1);
          beep();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running, mode]);

  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");

  const R = 52, C = 2 * Math.PI * R;
  const dash = C * (1 - progress);

  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 14, padding: "14px 16px",
      display: "flex", flexDirection: "column", gap: 14,
    }}>
      {/* Mode tabs */}
      <div style={{
        display: "flex", gap: 4, padding: 4,
        background: "rgba(0,0,0,0.2)", borderRadius: 10,
      }}>
        {MODES.map(m => (
          <button key={m.id} onClick={() => switchMode(m.id)} style={{
            flex: 1, padding: "6px 0", borderRadius: 7, border: "none", cursor: "pointer",
            fontSize: 12, fontWeight: mode === m.id ? 600 : 400,
            color: mode === m.id ? "#f1f5f9" : "#64748b",
            background: mode === m.id ? `${m.color}30` : "transparent",
            outline: mode === m.id ? `1px solid ${m.color}50` : "1px solid transparent",
            transition: "all 0.15s",
          }}>
            {m.short}
          </button>
        ))}
      </div>

      {/* Circle timer */}
      <div style={{ display:"flex", justifyContent:"center" }}>
        <div style={{ position:"relative", width:130, height:130 }}>
          <svg width={130} height={130} style={{ transform:"rotate(-90deg)" }}>
            <circle cx={65} cy={65} r={R} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={6} />
            <circle
              cx={65} cy={65} r={R} fill="none"
              stroke={current.color} strokeWidth={6} strokeLinecap="round"
              strokeDasharray={C} strokeDashoffset={dash}
              style={{ transition:"stroke-dashoffset 1s linear", filter:`drop-shadow(0 0 5px ${current.color})` }}
            />
          </svg>
          <div style={{
            position:"absolute", inset:0,
            display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
          }}>
            <div style={{ fontSize:30, fontWeight:700, fontFamily:"'Courier New',monospace", color:"#f1f5f9", letterSpacing:"0.04em" }}>
              {mm}:{ss}
            </div>
            <div style={{ fontSize:11, color:"#64748b", marginTop:4 }}>{current.label}</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12 }}>
        <button onClick={() => reset()} style={{
          background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
          borderRadius:10, cursor:"pointer", color:"#64748b", padding:"8px 10px", display:"flex",
          transition:"all 0.15s",
        }}
          onMouseOver={e => (e.currentTarget.style.color = "#e2e8f0")}
          onMouseOut={e => (e.currentTarget.style.color = "#64748b")}
        >
          <RotateCcw size={16} />
        </button>
        <button onClick={() => setRunning(!running)} style={{
          padding: "10px 32px", borderRadius: 10, border: "none", cursor: "pointer",
          background: `linear-gradient(135deg,${current.color},${current.color}aa)`,
          boxShadow: running ? "none" : `0 4px 18px ${current.color}40`,
          color: "white", display: "flex", alignItems: "center", gap: 6,
          fontSize: 14, fontWeight: 600, transition: "all 0.15s",
        }}>
          {running ? <Pause size={16} /> : <Play size={16} style={{ marginLeft:2 }} />}
          {running ? "Pause" : "Start"}
        </button>
      </div>

      {/* Sessions */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <span style={{ fontSize:12, color:"#475569" }}>Sessions</span>
        <div style={{ display:"flex", gap:5, alignItems:"center" }}>
          {Array.from({ length: Math.max(sessions, 4) }).map((_, i) => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: "50%",
              background: i < sessions ? current.color : "rgba(255,255,255,0.08)",
              boxShadow: i < sessions ? `0 0 5px ${current.color}` : "none",
              transition: "all 0.3s",
            }} />
          ))}
          {sessions > 4 && <span style={{ fontSize:11, color:"#475569" }}>+{sessions-4}</span>}
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;

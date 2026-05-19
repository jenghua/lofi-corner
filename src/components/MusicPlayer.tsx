"use client";

import { useState, useRef, useCallback } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from "lucide-react";
import { STATIONS, Station } from "@/lib/stations";

const S = {
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 14,
    padding: "14px 16px",
    display: "flex",
    flexDirection: "column" as const,
    gap: 14,
  },
  label: { fontSize: 11, color: "#64748b", textTransform: "uppercase" as const, letterSpacing: "0.1em" },
};

const MusicPlayer = () => {
  const [station, setStation] = useState<Station>(STATIONS[0]);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [volume, setVolume] = useState(70);
  const [muted, setMuted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const idx = STATIONS.findIndex((s) => s.id === station.id);

  const play = useCallback(() => { setPlaying(true); setLoading(true); }, []);
  const pause = useCallback(() => setPlaying(false), []);

  const changeStation = (s: Station) => {
    setStation(s);
    if (playing) setLoading(true);
  };

  const src = playing
    ? `https://www.youtube.com/embed/${station.youtubeId}?autoplay=1&mute=${muted ? 1 : 0}&controls=0&loop=1&playlist=${station.youtubeId}`
    : "";

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      {/* Now playing card */}
      <div style={S.card}>
        <div style={{ fontSize: 11, color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Now Playing
        </div>

        {/* Station info */}
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
            background: `${station.color}22`, border: `1px solid ${station.color}44`,
          }}>
            {station.emoji}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
              {station.name}
            </div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
              {station.description}
            </div>
          </div>
          {/* Wave animation */}
          {playing && (
            <div style={{ display:"flex", alignItems:"flex-end", gap:2, height:20, flexShrink:0 }}>
              {[0.1,0.4,0.2,0.6,0.3,0.5,0.15].map((d, i) => (
                <div key={i} style={{
                  width: 3, height: 20, borderRadius: 2,
                  background: station.color,
                  transformOrigin: "bottom",
                  animation: `wave ${0.6 + d}s ${d}s ease-in-out infinite`,
                }} />
              ))}
            </div>
          )}
        </div>

        {/* Controls */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12 }}>
          <button
            onClick={() => changeStation(STATIONS[(idx - 1 + STATIONS.length) % STATIONS.length])}
            style={{ background:"none", border:"none", cursor:"pointer", color:"#64748b", padding:6, borderRadius:8, display:"flex" }}
            onMouseOver={e => (e.currentTarget.style.color = "#e2e8f0")}
            onMouseOut={e => (e.currentTarget.style.color = "#64748b")}
          >
            <SkipBack size={18} />
          </button>

          <button
            onClick={playing ? pause : play}
            style={{
              width: 48, height: 48, borderRadius: "50%", border: "none", cursor: "pointer",
              background: `linear-gradient(135deg,${station.color},#9333ea)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 0 20px ${station.color}50`,
              color: "white", flexShrink: 0,
            }}
          >
            {loading && playing
              ? <div style={{ width:18,height:18,border:"2px solid white",borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.8s linear infinite" }} />
              : playing ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: 2 }} />
            }
          </button>

          <button
            onClick={() => changeStation(STATIONS[(idx + 1) % STATIONS.length])}
            style={{ background:"none", border:"none", cursor:"pointer", color:"#64748b", padding:6, borderRadius:8, display:"flex" }}
            onMouseOver={e => (e.currentTarget.style.color = "#e2e8f0")}
            onMouseOut={e => (e.currentTarget.style.color = "#64748b")}
          >
            <SkipForward size={18} />
          </button>
        </div>

        {/* Volume */}
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <button
            onClick={() => setMuted(!muted)}
            style={{ background:"none", border:"none", cursor:"pointer", color:"#64748b", padding:0, display:"flex", flexShrink:0 }}
          >
            {muted || volume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
          <input
            type="range" min={0} max={100} value={muted ? 0 : volume}
            onChange={e => { setVolume(+e.target.value); setMuted(false); }}
            style={{ background: `linear-gradient(to right,#7c3aed 0%,#7c3aed ${muted ? 0 : volume}%,rgba(255,255,255,0.15) ${muted ? 0 : volume}%)` }}
          />
          <span style={{ fontSize:11, color:"#64748b", width:28, textAlign:"right", flexShrink:0 }}>
            {muted ? 0 : volume}%
          </span>
        </div>
      </div>

      {/* Station picker */}
      <div style={S.card}>
        <div style={S.label}>Stations</div>
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          {STATIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => changeStation(s)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "8px 10px", borderRadius: 10, border: "none", cursor: "pointer",
                background: s.id === station.id ? `${s.color}18` : "rgba(255,255,255,0.03)",
                outline: s.id === station.id ? `1px solid ${s.color}44` : "1px solid transparent",
                transition: "all 0.15s",
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: 18 }}>{s.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: s.id === station.id ? "#f1f5f9" : "#94a3b8", fontWeight: s.id === station.id ? 600 : 400 }}>
                  {s.name}
                </div>
                <div style={{ fontSize: 11, color: "#475569" }}>{s.description}</div>
              </div>
              {s.id === station.id && playing && (
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: s.color, flexShrink: 0,
                  boxShadow: `0 0 6px ${s.color}` }} />
              )}
            </button>
          ))}
        </div>
      </div>

      {playing && (
        <iframe ref={iframeRef} src={src}
          style={{ position:"fixed", left:"-9999px", top:0, width:1, height:1 }}
          allow="autoplay; encrypted-media"
          onLoad={() => setLoading(false)} />
      )}
    </div>
  );
};

export default MusicPlayer;

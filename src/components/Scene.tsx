"use client";

import { useState, useEffect } from "react";

const STARS = Array.from({ length: 70 }, (_, i) => {
  const r = (n: number) => ((Math.sin(n * 9301 + 49297) * 49297) % 1 + 1) % 1;
  return {
    id: i,
    x: r(i) * 100,
    y: r(i + 100) * 58,
    size: r(i + 200) > 0.75 ? 3 : 2,
    delay: r(i + 300) * 3,
    duration: 1.5 + r(i + 400) * 2,
  };
});

type Phase = "night" | "dawn" | "day" | "dusk";

const getPhase = (h: number): Phase => {
  if (h >= 6  && h < 8)  return "dawn";
  if (h >= 8  && h < 18) return "day";
  if (h >= 18 && h < 21) return "dusk";
  return "night";
};

interface SunProps { left: string; top: string; gradient: string; glow: string; size: number; }
interface Theme {
  sky: string;
  starsOpacity: number;
  showMoon: boolean;
  sun?: SunProps;
  cloudOpacity: [number, number];
  // city
  backBuilding: string;
  frontBuilding: string;
  windowYellow: number;   // opacity 0–1
  windowCyan: number;
  streetLightOpacity: number;
}

const THEMES: Record<Phase, Theme> = {
  night: {
    sky: "#0d0d1a",
    starsOpacity: 1, showMoon: true,
    cloudOpacity: [0.12, 0.07],
    backBuilding: "#0b1220", frontBuilding: "#0f1828",
    windowYellow: 0.55, windowCyan: 0.38, streetLightOpacity: 1,
  },
  dawn: {
    sky: "#2d1060",
    starsOpacity: 0.25, showMoon: false,
    cloudOpacity: [0.2, 0.14],
    sun: { left: "12%", top: "66%", size: 54,
      gradient: "radial-gradient(circle at 45% 45%, #fff7e6, #fbbf24, #f97316)",
      glow: "rgba(249,115,22,0.55)" },
    backBuilding: "#1c2e48", frontBuilding: "#16253c",
    windowYellow: 0.3, windowCyan: 0.18, streetLightOpacity: 0.6,
  },
  day: {
    sky: "#2e8bc0",
    starsOpacity: 0, showMoon: false,
    cloudOpacity: [0.55, 0.40],
    sun: { left: "70%", top: "7%", size: 64,
      gradient: "radial-gradient(circle at 38% 38%, #ffffff, #fef08a, #fbbf24)",
      glow: "rgba(251,191,36,0.32)" },
    backBuilding: "#4a6585", frontBuilding: "#3a5070",
    windowYellow: 0, windowCyan: 0, streetLightOpacity: 0,
  },
  dusk: {
    sky: "#6b1a3a",
    starsOpacity: 0.18, showMoon: false,
    cloudOpacity: [0.2, 0.14],
    sun: { left: "80%", top: "63%", size: 54,
      gradient: "radial-gradient(circle at 50% 50%, #fef3c7, #fb923c, #ef4444)",
      glow: "rgba(239,68,68,0.6)" },
    backBuilding: "#1a2438", frontBuilding: "#141e30",
    windowYellow: 0.4, windowCyan: 0.25, streetLightOpacity: 0.7,
  },
};

const Scene = () => {
  const [phase, setPhase] = useState<Phase>(() => getPhase(new Date().getHours()));

  useEffect(() => {
    const tick = () => setPhase(getPhase(new Date().getHours()));
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  const t = THEMES[phase];

  return (
    <div style={{ position:"fixed", inset:0, overflow:"hidden", pointerEvents:"none", zIndex:0 }}>
      {/* Sky */}
      <div style={{ position:"absolute", inset:0, background:t.sky, transition:"background 3s ease" }} />

      {/* Stars */}
      {STARS.map((s) => (
        <div key={s.id} style={{
          position:"absolute", left:`${s.x}%`, top:`${s.y}%`,
          width:s.size, height:s.size, borderRadius:"50%", background:"white",
          opacity: t.starsOpacity,
          transition: "opacity 3s ease",
          animation:`twinkle ${s.duration}s ${s.delay}s ease-in-out infinite`,
        }} />
      ))}

      {/* Moon */}
      {t.showMoon && (
        <div style={{ position:"absolute", left:"13%", top:"7%", animation:"float 5s ease-in-out infinite" }}>
          <div style={{
            width:68, height:68, borderRadius:"50%",
            background:"radial-gradient(circle at 38% 38%, #fef9c3, #fbbf24)",
            boxShadow:"0 0 40px rgba(251,191,36,0.25), 0 0 80px rgba(251,191,36,0.08)",
          }}>
            <div style={{ position:"absolute", width:13, height:13, borderRadius:"50%", background:"rgba(0,0,0,0.08)", top:"18%", left:"54%" }} />
            <div style={{ position:"absolute", width:8,  height:8,  borderRadius:"50%", background:"rgba(0,0,0,0.06)", top:"55%", left:"22%" }} />
          </div>
        </div>
      )}

      {/* Sun */}
      {t.sun && (
        <div style={{
          position:"absolute", left:t.sun.left, top:t.sun.top,
          transition:"left 3s ease, top 3s ease",
          animation:"float 6s ease-in-out infinite",
        }}>
          <div style={{
            width:t.sun.size, height:t.sun.size, borderRadius:"50%",
            background:t.sun.gradient,
            boxShadow:`0 0 40px ${t.sun.glow}, 0 0 90px ${t.sun.glow}`,
          }} />
        </div>
      )}

      {/* Clouds */}
      <div style={{ position:"absolute", top:"17%", left:"5%", opacity:t.cloudOpacity[0], transition:"opacity 3s ease" }}>
        <div style={{ width:130, height:42, background:"rgba(255,255,255,0.9)", borderRadius:21 }} />
        <div style={{ width:90,  height:36, background:"rgba(255,255,255,0.9)", borderRadius:18, marginTop:-22, marginLeft:22 }} />
      </div>
      <div style={{ position:"absolute", top:"11%", left:"33%", opacity:t.cloudOpacity[1], transition:"opacity 3s ease" }}>
        <div style={{ width:110, height:36, background:"rgba(255,255,255,0.9)", borderRadius:18 }} />
        <div style={{ width:70,  height:30, background:"rgba(255,255,255,0.9)", borderRadius:15, marginTop:-18, marginLeft:18 }} />
      </div>

      {/* City skyline */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"46%" }}>
        <svg viewBox="0 0 1440 400" preserveAspectRatio="none" style={{ width:"100%", height:"100%", display:"block" }}>
          <defs>
            <linearGradient id="gnd" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#1a3050" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#060810" stopOpacity="1"   />
            </linearGradient>
          </defs>

          {/* Back buildings */}
          <g fill={t.backBuilding} opacity="0.95">
            {[
              [0,195,65],[70,215,48],[125,175,58],[190,235,42],[240,185,62],
              [310,205,52],[370,165,72],[450,225,47],[505,195,57],[570,215,62],
              [640,175,52],[700,205,67],[775,185,52],[835,225,57],[900,195,47],
              [955,165,62],[1025,215,52],[1085,185,57],[1150,205,62],[1220,175,52],
              [1280,225,47],[1335,195,57],[1400,215,42],
            ].map(([x,y,w],i) => <rect key={i} x={x} y={y} width={w} height={400-Number(y)} />)}
            {[[15,155,32],[135,138,37],[250,148,42],[380,128,52],[515,158,37],
              [650,138,32],[785,148,32],[965,128,42],[1095,148,37],[1230,138,32],
            ].map(([x,y,w],i) => <rect key={`n${i}`} x={x} y={y} width={w} height={42} />)}
          </g>

          {/* Front buildings */}
          <g fill={t.frontBuilding}>
            {[
              [0,255,82],[90,272,72],[170,245,92],[270,265,78],[355,235,88],
              [450,268,72],[530,250,82],[620,265,88],[715,240,78],[800,268,82],
              [890,250,72],[970,260,88],[1065,245,82],[1155,265,78],[1240,250,87],[1335,260,72],[1415,268,26],
            ].map(([x,y,w],i) => <rect key={i} x={x} y={y} width={w} height={400-Number(y)} />)}
            {[[10,215,62],[180,205,72],[365,198,68],[540,212,62],[725,202,58],
              [980,222,68],[1165,228,58],[1345,222,52],
            ].map(([x,y,w],i) => <rect key={`f${i}`} x={x} y={y} width={w} height={42} />)}
          </g>

          {/* Yellow windows */}
          <g fill="#fbbf24" opacity={t.windowYellow}>
            {[[20,165],[36,165],[20,180],[82,222],[97,222],[82,237],
              [147,145],[162,145],[147,160],[202,245],[217,245],
              [258,155],[273,155],[258,170],[273,170],[322,215],[337,215],
              [387,135],[402,135],[387,150],[462,235],[477,235],
              [522,165],[537,165],[522,180],[537,180],[582,225],[597,225],
              [657,145],[672,145],[657,160],[712,215],[727,215],[712,230],
              [792,155],[807,155],[792,170],[847,235],[862,235],
              [912,205],[927,205],[912,220],[967,135],[982,135],
              [1037,225],[1052,225],[1037,240],[1097,155],[1112,155],
              [1162,215],[1177,215],[1162,230],[1232,145],[1247,145],
              [1292,235],[1307,235],[1352,165],[1367,165],[1352,180],
            ].map(([x,y],i) => <rect key={i} x={x} y={y} width={8} height={5} rx={1} />)}
          </g>

          {/* Cyan accent windows */}
          <g fill="#06b6d4" opacity={t.windowCyan}>
            {[[27,190],[92,252],[152,170],[267,185],[332,230],[397,160],[532,190],[602,240],[717,240],[802,180],
              [922,230],[1002,150],[1117,170],[1182,245],[1302,250],
            ].map(([x,y],i) => <rect key={i} x={x} y={y} width={8} height={5} rx={1} />)}
          </g>

          {/* Street */}
          <rect x="0" y="382" width="1440" height="18" fill="#06080f" />

          {/* Street lights */}
          {[80,230,390,550,710,870,1030,1190,1350].map((x,i) => (
            <g key={i} opacity={t.streetLightOpacity}>
              <rect x={x}   y={352} width={3}  height={30} fill="#2d3b52" />
              <rect x={x-9} y={350} width={21} height={4}  rx={2} fill="#374558" />
              <circle cx={x+1} cy={350} r={5}  fill="#fef9c3" opacity="0.92" />
              <circle cx={x+1} cy={350} r={12} fill="#fbbf24" opacity="0.15" />
            </g>
          ))}

          <rect x="0" y="375" width="1440" height="25" fill="url(#gnd)" />
        </svg>
      </div>

    </div>
  );
};

export default Scene;

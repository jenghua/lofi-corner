"use client";

import Scene from "@/components/Scene";
import Sidebar from "@/components/Sidebar";
import Clock from "@/components/Clock";

const Home = () => {
  return (
    <div style={{ position:"relative", width:"100vw", height:"100dvh", overflow:"hidden" }}>
      {/* Background */}
      <Scene />

      {/* Vignette */}
      <div style={{
        position:"fixed", inset:0, pointerEvents:"none", zIndex:1,
        background:"radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.5) 100%)",
      }} />

      {/* Clock — always full-screen centered */}
      <div style={{
        position:"fixed", inset:0, zIndex:2,
        display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
        gap:12, pointerEvents:"none",
      }}>
        <Clock />
        <div style={{
          fontSize:12, color:"#94a3b8", padding:"5px 14px",
          borderRadius:20,
          background:"rgba(255,255,255,0.04)",
          border:"1px solid rgba(255,255,255,0.07)",
          backdropFilter:"blur(8px)",
          letterSpacing:"0.04em",
        }}>
          🎵 your cozy corner to focus & vibe
        </div>
      </div>

      {/* Sidebar — fixed right edge */}
      <div style={{ position:"fixed", right:0, top:0, height:"100%", zIndex:10 }}>
        <Sidebar />
      </div>

      {/* Footer */}
      <div style={{
        position:"fixed", bottom:14, left:"50%", transform:"translateX(-50%)",
        fontSize:11, color:"#64748b", letterSpacing:"0.06em",
        zIndex:3, pointerEvents:"none", userSelect:"none",
      }}>
        lofi corner
      </div>
    </div>
  );
};

export default Home;

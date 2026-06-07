"use client";

import { useState, useEffect } from "react";

const Clock = () => {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const hh = String(time.getHours()).padStart(2, "0");
  const mm = String(time.getMinutes()).padStart(2, "0");
  const date = time.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });

  return (
    <div style={{ textAlign: "center", userSelect: "none", pointerEvents: "none" }}>
      <div style={{
        fontSize: 88,
        fontWeight: 700,
        fontFamily: "'Courier New', monospace",
        letterSpacing: "0.04em",
        lineHeight: 1,
        background: "linear-gradient(135deg,#e2e8f0 0%,#a78bfa 45%,#38bdf8 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        filter: "drop-shadow(0 0 24px rgba(124,58,237,0.35))",
      }}>
        {hh}
        <span style={{ color: "rgba(241,245,249,0.7)", margin: "0 6px" }}>:</span>
        {mm}
      </div>
      <div style={{ marginTop: 8, fontSize: 13, color: "#94a3b8", letterSpacing: "0.06em" }}>
        {date}
      </div>
    </div>
  );
};

export default Clock;

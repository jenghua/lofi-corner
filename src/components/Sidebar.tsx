"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Timer, CheckSquare } from "lucide-react";
import MusicPlayer from "./MusicPlayer";
import PomodoroTimer from "./PomodoroTimer";
import TodoList from "./TodoList";

const TABS = [
  { id: "music",   Icon: Music,        label: "Music"   },
  { id: "timer",   Icon: Timer,        label: "Timer"   },
  { id: "tasks",   Icon: CheckSquare,  label: "Tasks"   },
] as const;

type TabId = typeof TABS[number]["id"];

const Sidebar = () => {
  const [active, setActive] = useState<TabId | null>("music");

  const toggle = (id: TabId) => setActive(prev => prev === id ? null : id);

  return (
    <div style={{ display:"flex", height:"100%", alignItems:"stretch" }}>
      {/* Content panel */}
      <AnimatePresence>
        {active && (
          <motion.div
            key={active}
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              width: 290,
              height: "100%",
              overflowY: "auto",
              padding: "20px 12px 20px 16px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              background: "rgba(6,8,18,0.65)",
              backdropFilter: "blur(24px)",
              borderLeft: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {active === "music"   && <MusicPlayer />}
            {active === "timer"   && <PomodoroTimer />}
            {active === "tasks"   && <TodoList />}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab strip — always visible */}
      <div style={{
        width: 56,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        background: "rgba(6,8,18,0.55)",
        backdropFilter: "blur(20px)",
        borderLeft: "1px solid rgba(255,255,255,0.07)",
        flexShrink: 0,
      }}>
        {TABS.map(({ id, Icon, label }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => toggle(id)}
              title={label}
              style={{
                width: 40, height: 40, borderRadius: 12,
                border: "none", cursor: "pointer",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: 3,
                background: isActive ? "rgba(124,58,237,0.3)" : "transparent",
                outline: isActive ? "1px solid rgba(124,58,237,0.5)" : "1px solid transparent",
                color: isActive ? "#a78bfa" : "#475569",
                transition: "all 0.15s",
              }}
              onMouseOver={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#94a3b8"; }}
              onMouseOut={e => { if (!isActive) e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = isActive ? "#a78bfa" : "#475569"; }}
            >
              <Icon size={17} />
              <span style={{ fontSize: 9, letterSpacing: "0.04em" }}>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;

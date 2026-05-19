"use client";

import { useState, useRef } from "react";
import { Plus, Trash2, Check } from "lucide-react";

interface Todo { id: string; text: string; done: boolean; }

const INIT: Todo[] = [
  { id: "1", text: "Study for exam",       done: false },
  { id: "2", text: "Finish project report", done: true  },
];

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>(INIT);
  const [input, setInput] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  const add = () => {
    const text = input.trim();
    if (!text) return;
    setTodos(p => [...p, { id: Date.now().toString(), text, done: false }]);
    setInput("");
    ref.current?.focus();
  };

  const toggle = (id: string) => setTodos(p => p.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const remove = (id: string) => setTodos(p => p.filter(t => t.id !== id));
  const clearDone = () => setTodos(p => p.filter(t => !t.done));

  const done = todos.filter(t => t.done).length;
  const total = todos.length;

  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 14, padding: "14px 16px",
      display: "flex", flexDirection: "column", gap: 12,
    }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <span style={{ fontSize:11, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.08em" }}>Tasks</span>
        {done > 0 && (
          <button onClick={clearDone} style={{
            background:"none", border:"none", cursor:"pointer",
            fontSize:11, color:"#475569", transition:"color 0.15s",
          }}
            onMouseOver={e => (e.currentTarget.style.color = "#f87171")}
            onMouseOut={e => (e.currentTarget.style.color = "#475569")}
          >
            Clear done ({done})
          </button>
        )}
      </div>

      {/* Progress */}
      {total > 0 && (
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ flex:1, height:3, borderRadius:2, background:"rgba(255,255,255,0.08)", overflow:"hidden" }}>
            <div style={{
              height:"100%", borderRadius:2, transition:"width 0.4s ease",
              width: `${(done/total)*100}%`,
              background: "linear-gradient(90deg,#7c3aed,#06b6d4)",
            }} />
          </div>
          <span style={{ fontSize:11, color:"#475569", flexShrink:0 }}>{done}/{total}</span>
        </div>
      )}

      {/* List */}
      <div style={{ display:"flex", flexDirection:"column", gap:4, maxHeight:200, overflowY:"auto" }}>
        {todos.length === 0 ? (
          <div style={{ textAlign:"center", padding:"16px 0", fontSize:13, color:"#334155" }}>
            No tasks yet
          </div>
        ) : todos.map(todo => (
          <div
            key={todo.id}
            style={{
              display:"flex", alignItems:"center", gap:10,
              padding:"8px 10px", borderRadius:9,
              background:"rgba(255,255,255,0.03)",
            }}
            className="group"
          >
            {/* Checkbox */}
            <button
              onClick={() => toggle(todo.id)}
              style={{
                width:18, height:18, borderRadius:"50%", flexShrink:0, border:"none", cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center",
                background: todo.done ? "#7c3aed" : "transparent",
                outline: `2px solid ${todo.done ? "#7c3aed" : "rgba(255,255,255,0.18)"}`,
                transition:"all 0.15s",
              }}
            >
              {todo.done && <Check size={10} color="white" strokeWidth={3} />}
            </button>

            <span style={{
              flex:1, fontSize:13,
              color: todo.done ? "#334155" : "#cbd5e1",
              textDecoration: todo.done ? "line-through" : "none",
              transition:"all 0.15s",
            }}>
              {todo.text}
            </span>

            <button
              onClick={() => remove(todo.id)}
              style={{
                background:"none", border:"none", cursor:"pointer",
                color:"#334155", padding:2, display:"flex",
                opacity:0, transition:"opacity 0.15s, color 0.15s",
              }}
              onMouseOver={e => { e.currentTarget.style.opacity="1"; e.currentTarget.style.color="#f87171"; }}
              onMouseOut={e => { e.currentTarget.style.opacity="0"; e.currentTarget.style.color="#334155"; }}
              className="group-hover-show"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={{
        display:"flex", alignItems:"center", gap:8,
        padding:"8px 10px", borderRadius:10,
        background:"rgba(255,255,255,0.05)",
        border:"1px solid rgba(255,255,255,0.09)",
      }}>
        <input
          ref={ref}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && add()}
          placeholder="Add a task…"
          style={{
            flex:1, background:"none", border:"none", outline:"none",
            fontSize:13, color:"#e2e8f0",
          }}
        />
        <button
          onClick={add}
          disabled={!input.trim()}
          style={{
            width:26, height:26, borderRadius:7, border:"none", cursor:"pointer",
            background: input.trim() ? "#7c3aed" : "rgba(255,255,255,0.07)",
            display:"flex", alignItems:"center", justifyContent:"center",
            opacity: input.trim() ? 1 : 0.4, transition:"all 0.15s",
            flexShrink:0,
          }}
        >
          <Plus size={15} color="white" />
        </button>
      </div>
    </div>
  );
};

export default TodoList;

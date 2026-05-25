import { useEffect, useRef, useState } from "react";
import { Tomato } from "./Tomato";
import { Notepad } from "./Notepad";

type Mode = "work" | "break";
type Tab = Mode | "note";

const DURATIONS: Record<Mode, number> = {
  work: 25 * 60,
  break: 5 * 60,
};

const LABELS: Record<Tab, string> = {
  work: "Focus time",
  break: "Take a break",
  note: "Take a note",
};

function format(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function chime() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.frequency.value = 660;
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
    o.start();
    o.stop(ctx.currentTime + 1.2);
  } catch {}
}

export function Pomodoro() {
  const [tab, setTab] = useState<Tab>("work");
  const [mode, setMode] = useState<Mode>("work");
  const [remaining, setRemaining] = useState(DURATIONS.work);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = window.setInterval(() => {
      setRemaining((r) => r - 1);
    }, 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [running]);

  useEffect(() => {
    if (remaining > 0) return;
    chime();
    if (mode === "work") {
      setCompleted((c) => c + 1);
      setMode("break");
      setTab((t) => (t === "note" ? t : "break"));
      setRemaining(DURATIONS.break);
    } else {
      setMode("work");
      setTab((t) => (t === "note" ? t : "work"));
      setRemaining(DURATIONS.work);
    }
  }, [remaining, mode]);

  useEffect(() => {
    document.title =
      tab === "note"
        ? `Notes · Dad's Tomato Timer`
        : `${format(remaining)} · ${LABELS[mode]}`;
  }, [remaining, mode, tab]);

  const progress = 1 - remaining / DURATIONS[mode];

  const selectTab = (next: Tab) => {
    setTab(next);
    if (next !== "note") {
      setMode(next);
      setRemaining(DURATIONS[next]);
      setRunning(false);
    } else {
      setRunning(false);
    }
  };

  const showTimer = tab !== "note";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <header className="text-center mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-tomato-deep font-medium">Pomodoro</p>
        <h1 className="text-5xl md:text-6xl mt-2 text-foreground">Dad's Tomato Timer</h1>
        <p className="mt-3 text-muted-foreground max-w-md mx-auto">
          Work in focused bursts. Rest your eyes when the tomato says so.
        </p>
      </header>

      <div className="flex gap-2 mb-8 bg-cream border border-border rounded-full p-1 shadow-sm">
        {(["work", "break", "note"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => selectTab(t)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition ${
              tab === t
                ? "bg-tomato text-primary-foreground shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {LABELS[t]}
          </button>
        ))}
      </div>

      {showTimer ? (
        <>
          <Tomato progress={progress} mode={mode} />

          <div className="mt-8 text-center">
            <div className="font-display text-7xl md:text-8xl tabular-nums text-tomato-deep">
              {format(remaining)}
            </div>
            <p className="mt-2 text-muted-foreground">
              {mode === "work"
                ? "Stay with one task until the timer rings."
                : "Stand up, stretch, look far away."}
            </p>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              onClick={() => setRunning((r) => !r)}
              className="px-8 py-3 rounded-full bg-tomato text-primary-foreground font-medium shadow-lg shadow-tomato/30 hover:scale-105 transition"
            >
              {running ? "Pause" : "Start"}
            </button>
            <button
              onClick={() => {
                setRunning(false);
                setRemaining(DURATIONS[mode]);
              }}
              className="px-8 py-3 rounded-full bg-card border border-border text-foreground font-medium hover:bg-accent transition"
            >
              Reset
            </button>
          </div>

          <div className="mt-10 flex items-center gap-3 text-sm text-muted-foreground">
            <span>Completed today:</span>
            <div className="flex gap-1">
              {Array.from({ length: Math.max(completed, 4) }).map((_, i) => (
                <span
                  key={i}
                  className={`w-3 h-3 rounded-full ${i < completed ? "bg-tomato" : "bg-border"}`}
                />
              ))}
            </div>
            <span className="font-medium text-foreground">{completed}</span>
          </div>
        </>
      ) : (
        <Notepad />
      )}
    </main>
  );
}


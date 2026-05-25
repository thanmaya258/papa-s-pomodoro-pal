import { useEffect, useState } from "react";

type Task = { id: string; text: string; done: boolean };

const STORAGE_KEY = "dad-pomodoro-tasks";

export function Notepad() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setTasks(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {}
  }, [tasks]);

  const addTask = () => {
    const text = draft.trim();
    if (!text) return;
    setTasks((t) => [
      ...t,
      { id: crypto.randomUUID(), text, done: false },
    ]);
    setDraft("");
  };

  const toggle = (id: string) =>
    setTasks((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));

  const remove = (id: string) =>
    setTasks((t) => t.filter((x) => x.id !== id));

  return (
    <section className="w-full max-w-xl bg-card border border-border rounded-3xl shadow-sm p-6 md:p-8">
      <h2 className="font-display text-3xl text-tomato-deep mb-4">Notepad</h2>

      <div className="flex gap-2 mb-6">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addTask();
          }}
          placeholder="Write a task or a quick note…"
          className="flex-1 px-4 py-3 rounded-full bg-cream border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-tomato/40"
        />
        <button
          onClick={addTask}
          className="px-5 py-3 rounded-full bg-tomato text-primary-foreground font-medium shadow-md shadow-tomato/30 hover:scale-105 transition"
        >
          + Add
        </button>
      </div>

      <h3 className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-3">
        Current Tasks
      </h3>

      {tasks.length === 0 ? (
        <p className="text-muted-foreground text-sm py-6 text-center">
          Nothing yet. Add a task to get started.
        </p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-cream border border-border"
            >
              <button
                onClick={() => toggle(task.id)}
                aria-label={task.done ? "Mark as not done" : "Mark as done"}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                  task.done
                    ? "bg-tomato border-tomato text-primary-foreground"
                    : "border-tomato/50 hover:border-tomato"
                }`}
              >
                {task.done && (
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    className="w-3 h-3"
                    aria-hidden
                  >
                    <path
                      d="M4 10l4 4 8-8"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
              <span
                className={`flex-1 text-foreground ${
                  task.done ? "line-through text-muted-foreground" : ""
                }`}
              >
                {task.text}
              </span>
              <button
                onClick={() => remove(task.id)}
                aria-label="Delete task"
                className="text-muted-foreground hover:text-tomato-deep transition text-sm"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { Pomodoro } from "@/components/Pomodoro";

export const Route = createFileRoute("/")({
  component: Pomodoro,
  head: () => ({
    meta: [
      { title: "Dad's Tomato Timer — Pomodoro" },
      { name: "description", content: "A warm, friendly Pomodoro timer with a tomato visualization for focused work and gentle breaks." },
    ],
  }),
});

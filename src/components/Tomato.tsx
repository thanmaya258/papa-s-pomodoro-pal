interface TomatoProps {
  progress: number; // 0..1 (fill from bottom)
  mode: "work" | "break";
}

export function Tomato({ progress, mode }: TomatoProps) {
  const fillY = 100 - progress * 100;
  const isBreak = mode === "break";

  return (
    <div className="relative">
      <svg viewBox="0 0 200 200" className="w-72 h-72 md:w-96 md:h-96 drop-shadow-2xl">
        <defs>
          <clipPath id="tomatoShape">
            <path d="M100 40 C 55 40, 25 75, 25 120 C 25 165, 60 190, 100 190 C 140 190, 175 165, 175 120 C 175 75, 145 40, 100 40 Z" />
          </clipPath>
          <radialGradient id="skin" cx="40%" cy="35%" r="75%">
            <stop offset="0%" stopColor="oklch(0.78 0.18 30)" />
            <stop offset="60%" stopColor="oklch(0.62 0.22 27)" />
            <stop offset="100%" stopColor="oklch(0.45 0.2 25)" />
          </radialGradient>
          <radialGradient id="fillGrad" cx="50%" cy="100%" r="100%">
            <stop offset="0%" stopColor="oklch(0.72 0.22 30)" />
            <stop offset="100%" stopColor="oklch(0.55 0.22 25)" />
          </radialGradient>
        </defs>

        {/* tomato body (faded background) */}
        <g clipPath="url(#tomatoShape)">
          <rect width="200" height="200" fill="oklch(0.92 0.04 30)" />
          {/* animated fill */}
          <rect
            x="0"
            width="200"
            y={fillY * 2}
            height={400}
            fill="url(#fillGrad)"
            style={{ transition: "y 1s linear" }}
          />
          {/* highlight */}
          <ellipse cx="70" cy="80" rx="22" ry="32" fill="white" opacity="0.18" />
        </g>

        {/* outline */}
        <path
          d="M100 40 C 55 40, 25 75, 25 120 C 25 165, 60 190, 100 190 C 140 190, 175 165, 175 120 C 175 75, 145 40, 100 40 Z"
          fill="none"
          stroke="oklch(0.35 0.15 25)"
          strokeWidth="2"
        />

        {/* leaves */}
        <g transform="translate(100 42)">
          <path
            d="M0 0 C -18 -12, -34 -8, -38 -22 C -22 -22, -10 -16, 0 -6 Z"
            fill="oklch(0.5 0.15 145)"
            stroke="oklch(0.35 0.12 145)"
            strokeWidth="1.2"
          >
            {isBreak && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="-3;3;-3"
                dur="3s"
                repeatCount="indefinite"
              />
            )}
          </path>
          <path
            d="M0 0 C 18 -12, 34 -8, 38 -22 C 22 -22, 10 -16, 0 -6 Z"
            fill="oklch(0.55 0.16 145)"
            stroke="oklch(0.35 0.12 145)"
            strokeWidth="1.2"
          >
            {isBreak && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="3;-3;3"
                dur="3s"
                repeatCount="indefinite"
              />
            )}
          </path>
          <path d="M0 -4 C -2 -14, -1 -22, 2 -28" fill="none" stroke="oklch(0.35 0.12 145)" strokeWidth="3" strokeLinecap="round" />
        </g>
      </svg>

      {isBreak && (
        <>
          <span className="absolute top-6 left-6 w-3 h-3 rounded-full bg-tomato/60 animate-ping" />
          <span className="absolute bottom-12 right-10 w-2 h-2 rounded-full bg-leaf/70 animate-ping [animation-delay:0.6s]" />
          <span className="absolute top-1/3 right-6 w-2 h-2 rounded-full bg-tomato/50 animate-ping [animation-delay:1.2s]" />
        </>
      )}
    </div>
  );
}

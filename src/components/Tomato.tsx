interface TomatoProps {
  progress: number; // 0..1 (fill from bottom)
  mode: "work" | "break";
}

export function Tomato({ progress, mode }: TomatoProps) {
  // fill rises from bottom (y=200) to top (y=0) as progress grows
  const fillTop = 200 - progress * 200;
  const isBreak = mode === "break";

  return (
    <div className="relative">
      <svg viewBox="0 0 200 200" className="w-72 h-72 md:w-96 md:h-96 drop-shadow-2xl">
        <defs>
          <clipPath id="tomatoShape">
            <path d="M100 40 C 55 40, 25 75, 25 120 C 25 165, 60 190, 100 190 C 140 190, 175 165, 175 120 C 175 75, 145 40, 100 40 Z" />
          </clipPath>

          {/* Lucid red liquid gradient (translucent, glossy) */}
          <linearGradient id="liquidGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.78 0.22 28)" stopOpacity="0.85" />
            <stop offset="40%" stopColor="oklch(0.62 0.24 27)" stopOpacity="0.95" />
            <stop offset="100%" stopColor="oklch(0.42 0.2 25)" stopOpacity="1" />
          </linearGradient>

          {/* Empty tomato tint (faint cream/pink) */}
          <radialGradient id="emptyGrad" cx="50%" cy="40%" r="70%">
            <stop offset="0%" stopColor="oklch(0.96 0.04 35)" />
            <stop offset="100%" stopColor="oklch(0.88 0.06 30)" />
          </radialGradient>

          {/* Two wave paths for layered liquid surface */}
          <path
            id="wave1"
            d="M-100 10 Q -75 0 -50 10 T 0 10 T 50 10 T 100 10 T 150 10 T 200 10 T 250 10 T 300 10 V 220 H -100 Z"
          />
          <path
            id="wave2"
            d="M-100 10 Q -75 20 -50 10 T 0 10 T 50 10 T 100 10 T 150 10 T 200 10 T 250 10 T 300 10 V 220 H -100 Z"
          />
        </defs>

        {/* Tomato body */}
        <g clipPath="url(#tomatoShape)">
          {/* empty interior */}
          <rect width="200" height="200" fill="url(#emptyGrad)" />

          {/* Liquid layer with animated translation for smooth rise */}
          <g style={{ transform: `translateY(${fillTop}px)`, transition: "transform 1s linear" }}>
            {/* back wave */}
            <use href="#wave2" fill="url(#liquidGrad)" opacity="0.55">
              <animateTransform
                attributeName="transform"
                type="translate"
                from="-100 0"
                to="0 0"
                dur="5s"
                repeatCount="indefinite"
              />
            </use>
            {/* front wave */}
            <use href="#wave1" fill="url(#liquidGrad)">
              <animateTransform
                attributeName="transform"
                type="translate"
                from="0 0"
                to="-100 0"
                dur="3.5s"
                repeatCount="indefinite"
              />
            </use>
            {/* subtle shimmer on surface */}
            <ellipse cx="80" cy="14" rx="30" ry="3" fill="white" opacity="0.25" />
          </g>

          {/* glassy highlight on tomato skin */}
          <ellipse cx="70" cy="80" rx="22" ry="34" fill="white" opacity="0.16" />
          <ellipse cx="140" cy="160" rx="18" ry="10" fill="white" opacity="0.08" />
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

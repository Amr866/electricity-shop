"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface LogoTraceLoaderProps {
  loading?: boolean;
  isComplete?: boolean;
  size?: number;
  strokeWidth?: number;
  loopDurationSeconds?: number;
  className?: string;
  ariaLabel?: string;
  onDone?: () => void;
}

// Electric bolt & circuit monogram SVG paths
const LOGO_VIEW_BOX = "0 0 100 100";
const TRACE_PATH = "M 55 10 L 25 55 L 50 55 L 42 90 L 75 45 L 50 45 Z";
const FILL_PATHS = [
  "M 55 10 L 25 55 L 50 55 L 42 90 L 75 45 L 50 45 Z",
] as const;

export function LogoTraceLoader({
  loading = true,
  isComplete = false,
  size = 48,
  strokeWidth = 3,
  loopDurationSeconds = 1.4,
  className,
  ariaLabel = "در حال بارگذاری...",
  onDone,
}: LogoTraceLoaderProps) {
  const [phase, setPhase] = useState<"loop" | "closingOutline" | "fadingFill" | "done">("loop");

  useEffect(() => {
    if (!loading || isComplete) {
      setPhase("closingOutline");
      const t1 = setTimeout(() => {
        setPhase("fadingFill");
      }, 300);

      const t2 = setTimeout(() => {
        setPhase("done");
        if (onDone) onDone();
      }, 600);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } else {
      setPhase("loop");
    }
  }, [loading, isComplete, onDone]);

  return (
    <div className={cn("inline-flex items-center justify-center relative select-none", className)}>
      <svg
        role="status"
        aria-label={ariaLabel}
        viewBox={LOGO_VIEW_BOX}
        width={size}
        height={size}
        className="overflow-visible"
      >
        {/* Faint Background Track */}
        <g opacity="0.15">
          <path
            d={TRACE_PATH}
            fill="none"
            stroke="currentColor"
            strokeWidth={Math.max(1, strokeWidth / 2)}
            strokeLinejoin="round"
          />
        </g>

        {/* Animated Moving Stroke Tracer */}
        {phase === "loop" ? (
          <path
            d={TRACE_PATH}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray="0.25 0.75"
            className="animate-spin-slow"
            style={{
              animation: `logo-trace-spin ${loopDurationSeconds}s linear infinite`,
            }}
          />
        ) : null}

        {/* Closing Full Outline */}
        {phase === "closingOutline" ? (
          <path
            d={TRACE_PATH}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300"
          />
        ) : null}

        {/* Resolved Filled Logo */}
        {phase === "fadingFill" || phase === "done"
          ? FILL_PATHS.map((path, idx) => (
              <path
                key={idx}
                d={path}
                fill="currentColor"
                className="animate-in fade-in zoom-in-90 duration-300"
              />
            ))
          : null}
      </svg>

      <style jsx>{`
        @keyframes logo-trace-spin {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -1;
          }
        }
      `}</style>
    </div>
  );
}

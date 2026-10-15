"use client";

import React, {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  useEffect,
  useRef,
} from "react";
import { cn } from "@/lib/utils";

type IridescentFoilProps = ComponentPropsWithoutRef<"div"> & {
  className?: string;
  children: React.ReactNode;
};

export function IridescentFoil({
  children,
  className,
  style,
  ...props
}: IridescentFoilProps) {
  const foilRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const pointerRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const foil = foilRef.current;
    if (!foil) return;

    const applyEffect = () => {
      const { x, y } = pointerRef.current;
      const foilStyle = foil.style;

      foilStyle.setProperty("--foil-shift", `${(x * 60).toFixed(2)}%`);
      foilStyle.setProperty("--foil-y-shift", `${(y * 40).toFixed(2)}%`);
      foilStyle.setProperty("--glare-x", `${(x * 100).toFixed(1)}%`);
      foilStyle.setProperty("--glare-y", `${(y * 100).toFixed(1)}%`);
      foilStyle.setProperty("--shine-angle", `${(110 + x * 50).toFixed(1)}deg`);
      foilStyle.setProperty("--shine-opacity", `${(0.45 + Math.abs(x - 0.5) * 0.35).toFixed(2)}`);

      frameRef.current = null;
    };

    const scheduleEffect = () => {
      if (frameRef.current !== null) return;
      frameRef.current = window.requestAnimationFrame(applyEffect);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = foil.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        pointerRef.current = {
          x: Math.min(Math.max((event.clientX - rect.left) / rect.width, 0.05), 0.95),
          y: Math.min(Math.max((event.clientY - rect.top) / rect.height, 0.05), 0.95),
        };
        scheduleEffect();
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <div
      {...props}
      ref={foilRef}
      className={cn(
        "relative isolate overflow-hidden rounded-2xl border border-amber-400/40 dark:border-amber-500/40 bg-gradient-to-br from-amber-100 via-amber-200 to-amber-300 dark:from-slate-900 dark:via-amber-950/60 dark:to-slate-900 shadow-md transition-shadow select-none",
        className
      )}
      style={
        {
          "--foil-shift": "20%",
          "--foil-y-shift": "10%",
          "--glare-x": "50%",
          "--glare-y": "50%",
          "--shine-angle": "135deg",
          "--shine-opacity": "0.6",
          ...style,
        } as CSSProperties
      }
    >
      {/* 1. Rainbow Interference Spectral Layer */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-full opacity-60 dark:opacity-40 mix-blend-color-dodge transition-opacity duration-300"
        style={{
          background: `linear-gradient(
            var(--shine-angle, 135deg),
            transparent 0%,
            rgba(0, 220, 255, 0.18) 25%,
            rgba(80, 255, 190, 0.22) 35%,
            rgba(255, 230, 70, 0.25) 45%,
            rgba(255, 70, 180, 0.22) 55%,
            rgba(150, 90, 255, 0.20) 65%,
            transparent 85%
          )`,
          transform: "translate3d(var(--foil-shift, 0%), var(--foil-y-shift, 0%), 0)",
        }}
      />

      {/* 2. Metallic Specular Glare following mouse */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-full opacity-70 mix-blend-screen"
        style={{
          background: `radial-gradient(
            circle at var(--glare-x, 50%) var(--glare-y, 50%),
            rgba(255, 255, 255, 0.65) 0%,
            rgba(255, 255, 255, 0.2) 20%,
            transparent 45%
          )`,
        }}
      />

      {/* 3. Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

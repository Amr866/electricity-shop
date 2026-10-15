"use client";

import React, { useMemo, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type CssLength = number | string;

export interface PerforatedStampProps {
  children: ReactNode;
  variant?: "emerald" | "amber" | "rose" | "dark";
  horizontalPerforations?: number;
  verticalPerforations?: number;
  perforationDepth?: number;
  padding?: CssLength;
  className?: string;
  contentClassName?: string;
  style?: CSSProperties;
  rotation?: number; // e.g. -3 or -6 degrees
}

function toCssLength(value: CssLength) {
  return typeof value === "number" ? `${value}px` : value;
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

function createStampClipPath({
  depth,
  horizontalCount,
  verticalCount,
}: {
  depth: number;
  horizontalCount: number;
  verticalCount: number;
}) {
  const resolvedDepth = clamp(depth, 0, 10);
  const resolvedHorizontalCount = clamp(Math.round(horizontalCount), 4, 32);
  const resolvedVerticalCount = clamp(Math.round(verticalCount), 4, 40);
  const horizontalStep = 100 / resolvedHorizontalCount;
  const verticalStep = 100 / resolvedVerticalCount;
  const points: Array<[number, number]> = [[0, 0]];

  // Top edge
  for (let index = 0; index < resolvedHorizontalCount; index += 1) {
    const start = index * horizontalStep;
    points.push([start + horizontalStep * 0.25, 0]);
    points.push([start + horizontalStep * 0.5, resolvedDepth]);
    points.push([start + horizontalStep * 0.75, 0]);
    points.push([start + horizontalStep, 0]);
  }

  // Right edge
  for (let index = 0; index < resolvedVerticalCount; index += 1) {
    const start = index * verticalStep;
    points.push([100, start + verticalStep * 0.25]);
    points.push([100 - resolvedDepth, start + verticalStep * 0.5]);
    points.push([100, start + verticalStep * 0.75]);
    points.push([100, start + verticalStep]);
  }

  // Bottom edge
  for (let index = 0; index < resolvedHorizontalCount; index += 1) {
    const start = 100 - index * horizontalStep;
    points.push([start - horizontalStep * 0.25, 100]);
    points.push([start - horizontalStep * 0.5, 100 - resolvedDepth]);
    points.push([start - horizontalStep * 0.75, 100]);
    points.push([start - horizontalStep, 100]);
  }

  // Left edge
  for (let index = 0; index < resolvedVerticalCount; index += 1) {
    const start = 100 - index * verticalStep;
    points.push([0, start - verticalStep * 0.25]);
    points.push([resolvedDepth, start - verticalStep * 0.5]);
    points.push([0, start - verticalStep * 0.75]);
    points.push([0, start - verticalStep]);
  }

  return `polygon(${points
    .map(([x, y]) => `${x.toFixed(3)}% ${y.toFixed(3)}%`)
    .join(", ")})`;
}

export function PerforatedStamp({
  children,
  variant = "emerald",
  horizontalPerforations = 10,
  verticalPerforations = 8,
  perforationDepth = 3.5,
  padding = 10,
  rotation = -3,
  className,
  contentClassName,
  style,
}: PerforatedStampProps) {
  const clipPath = useMemo(
    () =>
      createStampClipPath({
        depth: perforationDepth,
        horizontalCount: horizontalPerforations,
        verticalCount: verticalPerforations,
      }),
    [perforationDepth, horizontalPerforations, verticalPerforations]
  );

  const variantStyles = {
    emerald: {
      border: "border-emerald-600 dark:border-emerald-500",
      text: "text-emerald-700 dark:text-emerald-300",
      bg: "bg-emerald-50/90 dark:bg-emerald-950/70",
      badge: "border-emerald-500/40 bg-emerald-500/10",
    },
    amber: {
      border: "border-amber-600 dark:border-amber-500",
      text: "text-amber-800 dark:text-amber-300",
      bg: "bg-amber-50/90 dark:bg-amber-950/70",
      badge: "border-amber-500/40 bg-amber-500/10",
    },
    rose: {
      border: "border-rose-600 dark:border-rose-500",
      text: "text-rose-700 dark:text-rose-300",
      bg: "bg-rose-50/90 dark:bg-rose-950/70",
      badge: "border-rose-500/40 bg-rose-500/10",
    },
    dark: {
      border: "border-slate-700 dark:border-slate-500",
      text: "text-slate-800 dark:text-slate-200",
      bg: "bg-slate-100/90 dark:bg-slate-850/80",
      badge: "border-slate-500/40 bg-slate-500/10",
    },
  };

  const v = variantStyles[variant];

  return (
    <div
      className={cn("relative inline-block select-none", className)}
      style={{
        transform: `rotate(${rotation}deg)`,
        filter: "drop-shadow(0 4px 10px rgba(0, 0, 0, 0.12))",
        ...style,
      }}
    >
      <div
        className={cn(
          "relative overflow-hidden transition-all duration-200 border-2",
          v.border,
          v.bg,
          v.text
        )}
        style={{
          clipPath,
          padding: toCssLength(padding),
        }}
      >
        <div
          className={cn(
            "relative flex flex-col items-center justify-center text-center",
            contentClassName
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

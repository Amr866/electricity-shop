"use client";

import React, { useEffect, useState } from "react";
import { toPersianDigits, formatToman } from "@/lib/utils";

interface RollingCounterProps {
  value: number;
  duration?: number;
  formatAsToman?: boolean;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function RollingCounter({
  value,
  duration = 400,
  formatAsToman = false,
  prefix = "",
  suffix = "",
  className = "",
}: RollingCounterProps) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = displayValue;
    const endValue = value;

    if (startValue === endValue) return;

    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + (endValue - startValue) * easeProgress);
      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrameId);
  }, [value, duration]);

  const formatted = formatAsToman
    ? formatToman(displayValue)
    : toPersianDigits(displayValue);

  return (
    <span className={`inline-block tabular-nums font-mono transition-colors duration-150 ${className}`}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

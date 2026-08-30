"use client";

import React, { useEffect, useState } from "react";
import { formatToman } from "@/lib/utils";

interface AnimatedPriceCounterProps {
  amount: number;
  className?: string;
}

export function AnimatedPriceCounter({
  amount,
  className = "",
}: AnimatedPriceCounterProps) {
  const [displayAmount, setDisplayAmount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 900; // 900ms smooth count up
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Ease out cubic: 1 - Math.pow(1 - progress, 3)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeOut * amount);
      setDisplayAmount(current);

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setDisplayAmount(amount);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);

    return () => {
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
    };
  }, [amount]);

  return (
    <span className={`font-mono inline-block transition-all ${className}`}>
      {formatToman(displayAmount)}
    </span>
  );
}

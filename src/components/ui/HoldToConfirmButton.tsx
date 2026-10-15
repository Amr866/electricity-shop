"use client";

import React, {
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export type HoldToConfirmVariant = "rose" | "amber" | "emerald";

export type HoldToConfirmButtonProps = Omit<
  ComponentPropsWithoutRef<"button">,
  "children" | "onClick"
> & {
  children?: ReactNode;
  confirmedContent?: ReactNode;
  duration?: number;
  onConfirm: () => void;
  resetAfter?: number;
  variant?: HoldToConfirmVariant;
  className?: string;
};

export function HoldToConfirmButton({
  children = "نگه دارید تا تایید شود",
  className,
  confirmedContent,
  disabled,
  duration = 1400,
  onConfirm,
  resetAfter = 1800,
  variant = "rose",
  ...buttonProps
}: HoldToConfirmButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const confirmTimerRef = useRef<number | null>(null);
  const resetTimerRef = useRef<number | null>(null);
  const activePointerIdRef = useRef<number | null>(null);
  const isHoldingRef = useRef(false);
  const [status, setStatus] = useState<"idle" | "holding" | "confirmed">("idle");

  const clearConfirmTimer = useCallback(() => {
    if (confirmTimerRef.current !== null) {
      window.clearTimeout(confirmTimerRef.current);
      confirmTimerRef.current = null;
    }
  }, []);

  const completeHold = useCallback(() => {
    if (!isHoldingRef.current) return;

    isHoldingRef.current = false;
    activePointerIdRef.current = null;
    clearConfirmTimer();
    setStatus("confirmed");
    onConfirm();

    if (resetAfter > 0) {
      resetTimerRef.current = window.setTimeout(() => {
        setStatus("idle");
        resetTimerRef.current = null;
      }, resetAfter);
    }
  }, [clearConfirmTimer, onConfirm, resetAfter]);

  const cancelHold = useCallback(() => {
    if (!isHoldingRef.current) return;

    isHoldingRef.current = false;
    activePointerIdRef.current = null;
    clearConfirmTimer();
    setStatus("idle");
  }, [clearConfirmTimer]);

  const startHold = useCallback(() => {
    if (disabled || status === "confirmed" || isHoldingRef.current) return;

    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }

    isHoldingRef.current = true;
    setStatus("holding");
    confirmTimerRef.current = window.setTimeout(completeHold, duration);
  }, [completeHold, disabled, duration, status]);

  useEffect(() => {
    return () => {
      clearConfirmTimer();
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, [clearConfirmTimer]);

  useEffect(() => {
    if (disabled) cancelHold();
  }, [cancelHold, disabled]);

  function handlePointerDown(event: PointerEvent<HTMLButtonElement>) {
    if (!event.isPrimary || event.button !== 0 || disabled) return;
    activePointerIdRef.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    startHold();
  }

  function handlePointerMove(event: PointerEvent<HTMLButtonElement>) {
    if (!isHoldingRef.current || activePointerIdRef.current !== event.pointerId) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const boundaryPadding = 12;
    const isOutside =
      event.clientX < rect.left - boundaryPadding ||
      event.clientX > rect.right + boundaryPadding ||
      event.clientY < rect.top - boundaryPadding ||
      event.clientY > rect.bottom + boundaryPadding;

    if (isOutside) {
      cancelHold();
      if (buttonRef.current?.hasPointerCapture(event.pointerId)) {
        buttonRef.current.releasePointerCapture(event.pointerId);
      }
    }
  }

  function handlePointerEnd(event: PointerEvent<HTMLButtonElement>) {
    if (activePointerIdRef.current !== event.pointerId) return;
    cancelHold();
    if (buttonRef.current?.hasPointerCapture(event.pointerId)) {
      buttonRef.current.releasePointerCapture(event.pointerId);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.repeat || (event.key !== "Enter" && event.key !== " ")) return;
    event.preventDefault();
    startHold();
  }

  function handleKeyUp(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    cancelHold();
  }

  const isConfirmed = status === "confirmed";
  const isHolding = status === "holding";

  // Themes
  const themes = {
    rose: {
      base: "border-rose-300 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300",
      fill: "bg-rose-600 text-white",
      confirmed: "bg-rose-600 text-white border-rose-600",
    },
    amber: {
      base: "border-amber-300 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300",
      fill: "bg-amber-500 text-slate-950 font-black",
      confirmed: "bg-amber-500 text-slate-950 border-amber-500 font-black",
    },
    emerald: {
      base: "border-emerald-300 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300",
      fill: "bg-emerald-600 text-white",
      confirmed: "bg-emerald-600 text-white border-emerald-600",
    },
  };

  const t = themes[variant];

  // RTL progress overlay: in RTL, fills from right to left
  const overlayStyle: React.CSSProperties = {
    clipPath: isHolding ? "inset(0 0 0 0)" : "inset(0 0 0 100%)",
    transitionDuration: isHolding ? `${duration}ms` : "180ms",
    transitionProperty: "clip-path",
    transitionTimingFunction: isHolding ? "linear" : "cubic-bezier(0.23, 1, 0.32, 1)",
  };

  return (
    <button
      {...buttonProps}
      ref={buttonRef}
      type="button"
      aria-busy={isHolding}
      data-status={status}
      disabled={disabled}
      onBlur={cancelHold}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      className={cn(
        "relative isolate inline-flex h-9 min-w-36 touch-none cursor-pointer select-none items-center justify-center overflow-hidden rounded-xl border text-xs font-bold transition-all duration-150 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none active:scale-[0.98]",
        t.base,
        isConfirmed && t.confirmed,
        className
      )}
    >
      {isConfirmed ? (
        <span className="relative z-10 flex items-center justify-center gap-1.5 animate-in zoom-in-75 duration-200">
          {confirmedContent ?? (
            <>
              <Check className="w-4 h-4" />
              <span>تایید شد</span>
            </>
          )}
        </span>
      ) : (
        <>
          {/* Base Unfilled Label */}
          <span className="relative z-10 flex items-center justify-center gap-1.5 px-3">
            {children}
          </span>

          {/* Smooth Sliding Progress Fill Overlay */}
          <span
            aria-hidden="true"
            className={cn("absolute inset-0 flex items-center justify-center gap-1.5 px-3 z-20", t.fill)}
            style={overlayStyle}
          >
            {children}
          </span>
        </>
      )}
    </button>
  );
}

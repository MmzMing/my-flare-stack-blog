"use client";

import { cn } from "@/lib/utils";

interface BlurFadeProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  offset?: number;
  direction?: "up" | "down" | "left" | "right";
  blur?: string;
}

export function BlurFade({
  children,
  className,
  duration = 0.6,
  delay = 0,
  direction = "down",
}: BlurFadeProps) {
  const offsetClass =
    direction === "down"
      ? "-translate-y-4"
      : direction === "up"
        ? "translate-y-4"
        : direction === "left"
          ? "translate-x-4"
          : "-translate-x-4";

  return (
    <div
      className={cn("animate-in fade-in zoom-in", offsetClass, className)}
      style={{
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        animationFillMode: "both",
      }}
    >
      {children}
    </div>
  );
}

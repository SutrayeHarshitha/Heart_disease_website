import React from "react";
import { cn } from "../../lib/utils";

interface BackgroundBeamsWithCollisionProps {
  children: React.ReactNode;
  className?: string;
}

export function BackgroundBeamsWithCollision({ children, className }: BackgroundBeamsWithCollisionProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden rounded-md w-full",
        className
      )}
    >
      <div className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0">
        <div className="absolute inset-auto right-1/2 h-56 w-[30rem] bg-gradient-to-tr from-purple-500 to-blue-500 opacity-50 blur-3xl" />
        <div className="absolute inset-auto left-1/2 h-56 w-[30rem] bg-gradient-to-tr from-rose-500 to-indigo-500 opacity-50 blur-3xl" />
      </div>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      <div className="relative z-10 flex flex-col items-center">{children}</div>
    </div>
  );
} 
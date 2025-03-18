import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="relative min-h-screen w-full bg-black">
      {/* Shiny Background with Grid */}
      <div className="fixed inset-0 w-full h-full">
        {/* Base gradient layer */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900 to-black"></div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-grid-white/[0.02]"></div>
        
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-500/10 to-transparent"></div>
        
        {/* Radial gradient for depth */}
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center [mask-image:radial-gradient(ellipse_at_center,transparent_0%,black)]">
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
      </div>
      
      {/* Content Layer */}
      <div className="relative z-10 min-h-screen text-white/90">
        {children}
      </div>
    </div>
  );
} 
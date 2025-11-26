"use client";

import React,{ JSX } from "react";
import { motion } from "framer-motion";

// Simple className utility
function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

interface TextShimmerProps {
  children: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  duration?: number;
  spread?: number;
}

function TextShimmer({
  children,
  as = "p",
  className,
  duration = 2,
  spread = 2,
}: TextShimmerProps) {
  const dynamicSpread = React.useMemo(
    () => children.length * spread,
    [children, spread]
  );

  // Use motion.custom component instead of union-indexed access
  const MotionComponent = motion(as as any);

  return (
    <MotionComponent
      className={cn(
        "relative inline-block bg-[length:250%_100%,auto] bg-clip-text",
        "text-transparent [--base-color:#a1a1aa] [--base-gradient-color:#000]",
        "[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))] [background-repeat:no-repeat,padding-box]",
        "dark:[--base-color:#71717a] dark:[--base-gradient-color:#ffffff]",
        "dark:[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))]",
        className
      )}
      initial={{ backgroundPosition: "100% center" }}
      animate={{ backgroundPosition: "0% center" }}
      transition={{
        repeat: Infinity,
        duration,
        ease: "linear",
      }}
      style={{
        ["--spread" as any]: `${dynamicSpread}px`,
        backgroundImage:
          "var(--bg), linear-gradient(var(--base-color), var(--base-color))",
      }}
    >
      {children}
    </MotionComponent>
  );
}

export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-center space-y-8">
        <div className="flex flex-col space-y-3">
          <TextShimmer as="h2" className="text-2xl font-bold" duration={1.5}>
            Loading Dashboard
          </TextShimmer>

          <TextShimmer
            as="p"
            className="text-sm font-medium [--base-color:theme(colors.zinc.500)] [--base-gradient-color:theme(colors.zinc.300)] dark:[--base-color:#52525b] dark:[--base-gradient-color:#a1a1aa]"
            duration={2}
            spread={1.5}
          >
            Preparing your workspace...
          </TextShimmer>
        </div>
      </div>
    </div>
  );
}

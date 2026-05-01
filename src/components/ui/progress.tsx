import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number; // 0 to 100
  label?: string;
  className?: string;
}

export function ProgressBar({ progress, label, className }: ProgressBarProps) {
  return (
    <div className={cn("w-full", className)}>
      {label && (
        <div className="flex justify-between mb-2 text-sm font-medium text-gray-300">
          <span>{label}</span>
          <span className="text-neon">{progress}%</span>
        </div>
      )}
      <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-neon h-2.5 rounded-full shadow-[0_0_10px_rgba(0,245,255,0.7)] transition-all duration-500 ease-in-out"
          style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
        ></div>
      </div>
    </div>
  );
}

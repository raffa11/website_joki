import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "neon";
  size?: "default" | "sm" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-neon text-dark hover:bg-neon/90": variant === "default",
            "border border-neon text-neon hover:bg-neon/10": variant === "outline",
            "hover:bg-neon/10 hover:text-neon text-gray-300": variant === "ghost",
            "bg-transparent border border-neon text-neon shadow-[0_0_15px_rgba(0,245,255,0.5)] hover:shadow-[0_0_25px_rgba(0,245,255,0.8)] transition-all duration-300": variant === "neon",
            "h-10 px-4 py-2": size === "default",
            "h-9 rounded-md px-3": size === "sm",
            "h-11 rounded-md px-8 text-lg": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };

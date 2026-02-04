
import * as React from "react";

// Fungsi sederhana untuk menggabungkan className
function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
          variant === "default" && "bg-primary-dark text-white hover:bg-primary-dark/90",
          variant === "outline" && "border-2 border-primary-dark text-primary-dark hover:bg-primary-light/10",
          variant === "ghost" && "hover:bg-primary-light/20",
          size === "default" && "h-10 px-6 py-2 text-sm",
          size === "sm" && "h-9 px-4 text-sm",
          size === "lg" && "h-12 px-8 text-base",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
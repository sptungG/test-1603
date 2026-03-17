import { Loader2 } from "lucide-react";
import React from "react";
import { cn } from "../../utils/utils";

interface TButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, TButtonProps>(
  ({ variant = "primary", size = "md", loading = false, className, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          {
            "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800": variant === "primary",
            "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 active:bg-gray-100": variant === "secondary",
            "text-gray-600 hover:bg-gray-100 active:bg-gray-200": variant === "ghost",
            "bg-red-600 text-white hover:bg-red-700 active:bg-red-800": variant === "danger",
          },
          {
            "px-3 py-1.5 text-xs": size === "sm",
            "px-4 py-2.5 text-sm": size === "md",
            "px-6 py-3 text-base": size === "lg",
          },
          className,
        )}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

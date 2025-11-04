import type * as React from "react";

import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  ref?: React.Ref<HTMLInputElement>;
  helperText?: string;
  helperIcon?: React.ReactNode;
}

function Input({
  className,
  type,
  leftIcon,
  rightIcon,
  helperText,
  helperIcon,
  ref,
  ...props
}: InputProps) {
  return (
    <div className="relative flex items-center">
      {leftIcon && (
        <div className="absolute left-3 flex items-center pointer-events-none text-icon-bgl-dark">
          {leftIcon}
        </div>
      )}
      <input
        type={type}
        data-slot="input"
        ref={ref}
        className={cn(
          "peer! file:text-foreground placeholder:text-gray-500 selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-gray-300 flex h-12 w-full min-w-0 rounded-lg border bg-transparent px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-base",
          "focus-visible:border-ring ",
          "aria-invalid:ring-feed-danger-00 dark:aria-invalid:ring-feed-danger-10 aria-invalid:border-feed-danger-20",
          "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ",
          leftIcon && "pl-10",
          rightIcon && "pr-10",
          className
        )}
        {...props}
      />
      {rightIcon && (
        <div className="absolute right-3 flex items-center pointer-events-none text-icon-bgl-dark">
          {rightIcon}
        </div>
      )}
    </div>
  );
}

export { Input };

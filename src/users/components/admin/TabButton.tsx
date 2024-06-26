import React from "react";
import { twMerge } from "tailwind-merge";

export default function TabButton({
  children,
  isActive = false,
  disabled = false,
  className,
  onClick,
}: {
  children: React.ReactNode;
  isActive?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any;
}) {
  const baseStyle =
    "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-background hover:bg-accent h-10 px-4 py-2 rounded-none";
  const activeStyle =
    "text-yellow-400 border-b-2 border-yellow-400 hover:bg-yellow-400/10 dark:text-yellow-500 dark:border-yellow-500 dark:hover:bg-yellow-500/20";

  return (
    <button
      className={
        isActive
          ? twMerge(baseStyle, activeStyle, className)
          : twMerge(baseStyle, className)
      }
      onClick={(e) => {
        if (onClick) {
          onClick(e);
        }
      }}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

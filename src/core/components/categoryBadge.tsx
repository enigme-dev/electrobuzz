import React from "react";
import { twMerge } from "tailwind-merge";

interface CategoryBadgeProps {
  categoryName: string;
  className?: string;
}

const CategoryBadge = ({ categoryName, className }: CategoryBadgeProps) => {
  return (
    <div
      className={twMerge(
        "bg-blue-500 dark:bg-blue-500 rounded-md px-2 text-xs font-semibold text-white py-1",
        className
      )}
    >
      {categoryName}
    </div>
  );
};

export default CategoryBadge;

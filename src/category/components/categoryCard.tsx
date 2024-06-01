import { Card, CardContent } from "@/core/components/ui/card";
import Link from "next/link";
import React, { ReactNode } from "react";

interface CategoryProps {
  categoryName: string;
  categoryIcon: ReactNode;
}

const CategoryCard = ({ categoryName, categoryIcon }: CategoryProps) => {
  return (
    <div className="grid place-items-center items-center gap-5">
      <Link
        href={`/merchant/search?merchants%5BrefinementList%5D%5B_tags%5D%5B0%5D=${categoryName}`}
      >
        <Card className="hover:shadow-lg hover:shadow-yellow-200 dark:shadow-sm dark:shadow-yellow-200 cursor-pointer transition duration-500">
          <CardContent className="flex items-center justify-center p-6">
            {categoryIcon}
          </CardContent>
        </Card>
      </Link>
      <p className="text-xs sm:text-lg">{categoryName}</p>
    </div>
  );
};

export default CategoryCard;

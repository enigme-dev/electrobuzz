import { Star } from "lucide-react";
import React from "react";

interface StarRatingProps {
  userRating: number;
  maxRating?: number;
  starSize?: number;
  starFill?: string;
  starClassName?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  userRating,
  maxRating = 5,
  starSize = 15,
  starFill = "orange",
  starClassName = "text-yellow-400",
}) => {
  const stars = [];

  for (let i = 1; i <= maxRating; i++) {
    stars.push(
      <Star
        key={i}
        size={starSize}
        fill={i <= userRating ? starFill : "none"}
        strokeWidth={i <= userRating ? 0 : 1}
        className={starClassName}
      />
    );
  }

  return (
    <div className="flex gap-1 items-center text-[0.6rem] sm:text-sm py-1 px-2">
      {stars}
    </div>
  );
};

export default StarRating;

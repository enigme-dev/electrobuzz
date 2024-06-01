import React from "react";
import { Star } from "lucide-react";
interface StarRatingInputProps {
  rating: number;
  onRatingChange: Function;
}
const StarRatingInput = ({ rating, onRatingChange }: StarRatingInputProps) => {
  const handleRating = (rate: any) => {
    onRatingChange(rate);
  };

  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={20}
          fill={star <= rating ? "orange" : "none"}
          stroke="orange"
          className="cursor-pointer"
          onClick={() => handleRating(star)}
        />
      ))}
    </div>
  );
};

export default StarRatingInput;

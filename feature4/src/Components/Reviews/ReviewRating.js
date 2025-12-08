import React from "react";

const ReviewRating = ({ rating, onRatingChange, readOnly = false }) => {
  const stars = [1, 2, 3, 4, 5];
  
  const handleClick = (value) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(value);
    }
  };
  
  return (
    <div className="review-rating">
      {stars.map((star) => (
        <span
          key={star}
          onClick={() => handleClick(star)}
          style={{
            cursor: readOnly ? "default" : "pointer",
            color: star <= rating ? "#FFD700" : "#ccc",
            fontSize: "24px"
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default ReviewRating;
import React, { useState } from "react";
import ReviewRating from "./ReviewRating";
import { createReview } from "../../Common/Services/ReviewService";

const ReviewForm = ({ book, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }
    
    if (reviewText.trim() === "") {
      alert("Please write a review");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const reviewData = {
        bookId: book.id,
        bookTitle: book.title,
        bookAuthor: book.author,
        bookCoverImage: book.imageURL || "",
        rating: rating,
        reviewText: reviewText
      };
      
      await createReview(reviewData);
      alert("Review submitted successfully!");
      setRating(0);
      setReviewText("");
      
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (error) {
      alert("Error submitting review: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="review-form">
      <h3>Write a Review</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Rating:</label>
          <ReviewRating rating={rating} onRatingChange={setRating} />
        </div>
        
        <div className="form-group">
          <label>Review:</label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your thoughts about this book..."
            rows="5"
            style={{ width: "100%", padding: "8px" }}
            required
          />
        </div>
        
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
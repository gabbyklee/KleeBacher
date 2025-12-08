import React, { useState, useEffect } from "react";
import ReviewList from "../Reviews/ReviewList";
import ReviewForm from "../Reviews/ReviewForm";
import ReviewRating from "../Reviews/ReviewRating";
import { getReviewsForBook } from "../Reviews/ReviewService";
import "./BookQuickView.css";

const BookQuickView = ({ book, onClose }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [refreshReviews, setRefreshReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  
  // Fetch reviews and calculate average rating
  useEffect(() => {
    if (!book) return;
    
    const fetchRating = async () => {
      try {
        const reviews = await getReviewsForBook(book.id);
        if (reviews.length > 0) {
          const total = reviews.reduce((sum, review) => sum + review.get("rating"), 0);
          setAverageRating(total / reviews.length);
          setReviewCount(reviews.length);
        } else {
          setAverageRating(0);
          setReviewCount(0);
        }
      } catch (error) {
        console.error("Error calculating average rating:", error);
      }
    };
    
    fetchRating();
  }, [book, refreshReviews]);
  
  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
    setRefreshReviews(prev => prev + 1);
  };
  
  if (!book) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button onClick={onClose} className="modal-close-btn">
          ×
        </button>
        
        {/* Book Info Section */}
        <div className="book-info-section">
          {/* Book Cover */}
          <div className="book-cover-container">
            <img 
              src={book.imageURL || "https://via.placeholder.com/128x192?text=No+Cover"} 
              alt={book.title}
              className="book-cover-image"
            />
          </div>
          
          {/* Book Details */}
          <div className="book-details-container">
            <h2>{book.title}</h2>
            <p className="book-author-text">by {book.author}</p>
            
            {/* Genre */}
            {book.genre && (
              <p className="book-genre-text">{book.genre}</p>
            )}
            
            {/* Average Rating */}
            <div className="book-average-rating">
              <ReviewRating rating={Math.round(averageRating)} readOnly={true} />
              <span className="book-rating-text">
                {averageRating > 0 
                  ? `${averageRating.toFixed(1)} stars (${reviewCount} ${reviewCount === 1 ? 'review' : 'reviews'})` 
                  : "No ratings yet"}
              </span>
            </div>
          </div>
        </div>
        
        {/* Book Description */}
        {(book.description || book.volumeInfo?.description) && (
          <div className="book-description-section">
            <h3>Summary</h3>
            <p>{book.description || book.volumeInfo?.description}</p>
          </div>
        )}
        
        {/* Write Review Button */}
        <div className="write-review-section">
          {!showReviewForm ? (
            <button 
              onClick={() => setShowReviewForm(true)}
              className="write-review-btn"
            >
              Write a Review
            </button>
          ) : (
            <div className="review-form-container">
              <ReviewForm 
                book={book} 
                onReviewSubmitted={handleReviewSubmitted}
              />
              <button 
                onClick={() => setShowReviewForm(false)}
                className="cancel-review-btn"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        
        {/* Reviews Section */}
        <div className="reviews-section">
          <ReviewList 
            bookId={book.id} 
            showPopularOnly={true}
            key={refreshReviews}
          />
        </div>
      </div>
    </div>
  );
};

export default BookQuickView;
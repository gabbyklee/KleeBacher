import React, { useState, useEffect } from "react";
import ReviewList from "../Reviews/ReviewList";
import ReviewForm from "../Reviews/ReviewForm";
import ReviewRating from "../Reviews/ReviewRating";
import { getReviewsForBook } from "../Reviews/ReviewService";

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
  }, [book, refreshReviews]); // Recalculate when reviews refresh
  
  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
    setRefreshReviews(prev => prev + 1); // Trigger review list refresh
  };
  
  if (!book) return null;
  
  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000
      }}
    >
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          maxWidth: "800px",
          maxHeight: "90vh",
          width: "90%",
          overflow: "auto",
          position: "relative",
          padding: "20px"
        }}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: "absolute",
            top: "15px",
            right: "15px",
            background: "none",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
            color: "#666"
          }}
        >
          ×
        </button>
        
        {/* Book Info Section */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
          {/* Book Cover */}
          <div style={{ flexShrink: 0 }}>
            <img 
              src={book.imageURL || "https://via.placeholder.com/128x192?text=No+Cover"} 
              alt={book.title}
              style={{ 
                width: "128px",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}
            />
          </div>
          
          {/* Book Details */}
          <div style={{ flex: 1 }}>
            <h2 style={{ marginTop: 0 }}>{book.title}</h2>
            <p style={{ color: "#666", fontSize: "16px" }}>
              by {book.author}
            </p>
            
            {/* Genre */}
            {book.genre && (
              <p style={{ 
                color: "#007bff", 
                fontSize: "14px",
                fontWeight: "500" 
              }}>
                {book.genre}
              </p>
            )}
            
            {/* Average Rating */}
            <div style={{ marginTop: "10px" }}>
              <ReviewRating rating={Math.round(averageRating)} readOnly={true} />
              <span style={{ marginLeft: "10px", color: "#666" }}>
                {averageRating > 0 ? `${averageRating.toFixed(1)} stars (${reviewCount} ${reviewCount === 1 ? 'review' : 'reviews'})` : "No ratings yet"}
              </span>
            </div>
          </div>
        </div>
        
        {/* Book Description */}
        {book.description && (
          <div style={{ marginBottom: "20px" }}>
            <h3>Summary</h3>
            <p style={{ lineHeight: "1.6" }}>
              {book.description}
            </p>
          </div>
        )}
        
        {/* Write Review Button */}
        <div style={{ marginBottom: "20px" }}>
          {!showReviewForm ? (
            <button 
              onClick={() => setShowReviewForm(true)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              Write a Review
            </button>
          ) : (
            <div>
              <ReviewForm 
                book={book} 
                onReviewSubmitted={handleReviewSubmitted}
              />
              <button 
                onClick={() => setShowReviewForm(false)}
                style={{
                  marginTop: "10px",
                  padding: "8px 16px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        
        {/* Reviews Section */}
        <div>
          <ReviewList 
            bookId={book.id} 
            showPopularOnly={true}
            key={refreshReviews} // Force re-render when new review added
          />
        </div>
      </div>
    </div>
  );
};

export default BookQuickView;
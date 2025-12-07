import React, { useEffect, useState } from "react";
import ReviewCard from "./ReviewCard";
import { getReviewsForBook, getPopularReviewsForBook } from "./ReviewService";

const ReviewList = ({ bookId, showPopularOnly = false, topReviewsLimit = 3 }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showingAll, setShowingAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;
  
  useEffect(() => {
    fetchReviews();
  }, [bookId, showPopularOnly, showingAll]);
  
  const fetchReviews = async () => {
    setLoading(true);
    try {
      if (showPopularOnly && !showingAll) {
        // Show top 3 popular reviews
        const results = await getPopularReviewsForBook(bookId, topReviewsLimit);
        setReviews(results);
      } else {
        // Show all reviews sorted by date
        const results = await getReviewsForBook(bookId);
        setReviews(results);
      }
    } catch (error) {
      console.error("Error loading reviews:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLikeUpdate = () => {
    // Refresh reviews to update sorting
    fetchReviews();
  };
  
  const handleViewAll = () => {
    setShowingAll(true);
    setCurrentPage(1);
  };
  
  const handleViewPopular = () => {
    setShowingAll(false);
    setCurrentPage(1);
  };
  
  // Pagination logic
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = showingAll 
    ? reviews.slice(indexOfFirstReview, indexOfLastReview)
    : reviews;
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  if (loading) {
    return <div>Loading reviews...</div>;
  }
  
  if (reviews.length === 0) {
    return <div>No reviews yet. Be the first to review this book!</div>;
  }
  
  return (
    <div className="review-list">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h3 style={{ margin: 0 }}>
          {showingAll ? `All Reviews (${reviews.length})` : `Top ${topReviewsLimit} Popular Reviews`}
        </h3>
        
        {!showingAll && reviews.length >= topReviewsLimit && (
          <button
            onClick={handleViewAll}
            style={{
              padding: "8px 16px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            View All Reviews
          </button>
        )}
        
        {showingAll && showPopularOnly && (
          <button
            onClick={handleViewPopular}
            style={{
              padding: "8px 16px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            View Popular Only
          </button>
        )}
      </div>
      
      {currentReviews.map((review) => (
        <ReviewCard 
          key={review.id} 
          review={review} 
          onLikeUpdate={handleLikeUpdate}
        />
      ))}
      
      {/* Pagination Controls */}
      {showingAll && totalPages > 1 && (
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          gap: "15px",
          marginTop: "20px" 
        }}>
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            style={{
              padding: "8px 16px",
              backgroundColor: currentPage === 1 ? "#ccc" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: currentPage === 1 ? "not-allowed" : "pointer"
            }}
          >
            Previous
          </button>
          
          <span style={{ color: "#666" }}>
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            style={{
              padding: "8px 16px",
              backgroundColor: currentPage === totalPages ? "#ccc" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer"
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
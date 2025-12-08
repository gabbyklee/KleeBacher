import React, { useEffect, useState } from "react";
import ReviewCard from "./ReviewCard";
import { getReviewsForBook, getPopularReviewsForBook } from "./ReviewService";
import "./ReviewList.css";

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
      <div className="review-list-header">
        <h3>
          {showingAll ? `All Reviews (${reviews.length})` : `Top ${topReviewsLimit} Popular Reviews`}
        </h3>
        
        {!showingAll && reviews.length >= topReviewsLimit && (
          <button
            onClick={handleViewAll}
            className="review-list-view-btn view-all"
          >
            View All Reviews
          </button>
        )}
        
        {showingAll && showPopularOnly && (
          <button
            onClick={handleViewPopular}
            className="review-list-view-btn view-popular"
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
        <div className="review-list-pagination">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`review-list-pagination-btn ${currentPage === 1 ? "disabled" : "active"}`}
          >
            Previous
          </button>
          
          <span className="review-list-pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`review-list-pagination-btn ${currentPage === totalPages ? "disabled" : "active"}`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
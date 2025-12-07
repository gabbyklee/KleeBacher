import React, { useState } from "react";
import ReviewRating from "./ReviewRating";
import { likeReview } from "./ReviewService";

const ReviewCard = ({ review, onLikeUpdate }) => {
  const user = review.get("user");
  const rating = review.get("rating");
  const reviewText = review.get("reviewText");
  const createdAt = review.get("createdAt");
  
  const [likes, setLikes] = useState(review.get("likes") || 0);
  const [isLiking, setIsLiking] = useState(false);
  
  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      const updatedReview = await likeReview(review.id);
      setLikes(updatedReview.get("likes"));
      
      // Notify parent component that likes changed (for re-sorting)
      if (onLikeUpdate) {
        onLikeUpdate();
      }
    } catch (error) {
      console.error("Error liking review:", error);
      alert("Failed to like review");
    } finally {
      setIsLiking(false);
    }
  };
  
  return (
    <div className="review-card" style={{ 
      border: "1px solid #ddd", 
      padding: "15px", 
      marginBottom: "15px",
      borderRadius: "8px"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <strong>{user?.get("firstName") || "Anonymous"} {user?.get("lastName") || ""}</strong>
          <ReviewRating rating={rating} readOnly={true} />
        </div>
        <div style={{ color: "#666", fontSize: "14px" }}>
          {createdAt?.toLocaleDateString()}
        </div>
      </div>
      
      <p style={{ marginTop: "10px" }}>{reviewText}</p>
      
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
        <button
          onClick={handleLike}
          disabled={isLiking}
          style={{
            padding: "5px 15px",
            backgroundColor: isLiking ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: isLiking ? "not-allowed" : "pointer",
            fontSize: "14px"
          }}
        >
          👍 Like
        </button>
        <span style={{ color: "#666", fontSize: "14px" }}>
          {likes} {likes === 1 ? "like" : "likes"}
        </span>
      </div>
    </div>
  );
};

export default ReviewCard;
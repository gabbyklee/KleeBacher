import React, { useEffect, useState } from "react";
import Parse from "parse";
import { getCurrentUserReviews } from "../Reviews/ReviewService";
import ReviewRating from "../Reviews/ReviewRating";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = Parse.User.current();
        if (currentUser) {
          setUser({
            firstName: currentUser.get("firstName"),
            lastName: currentUser.get("lastName"),
            email: currentUser.get("email"),
            username: currentUser.get("username"),
          });

          // Fetch user's reviews
          const userReviews = await getCurrentUserReviews();
          setReviews(userReviews);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Loading profile...</h2>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Please log in to view your profile</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      {/* User Info Section */}
      <div
        style={{
          backgroundColor: "#f8f9fa",
          padding: "30px",
          borderRadius: "12px",
          marginBottom: "30px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: "10px" }}>
          {user.firstName} {user.lastName}
        </h1>
        <p style={{ color: "#666", fontSize: "16px", margin: "5px 0" }}>
          <strong>Email:</strong> {user.email}
        </p>
        <p style={{ color: "#666", fontSize: "16px", margin: "5px 0" }}>
          <strong>Username:</strong> {user.username}
        </p>
        <p style={{ color: "#666", fontSize: "16px", margin: "5px 0" }}>
          <strong>Total Reviews:</strong> {reviews.length}
        </p>
      </div>

      {/* Reviews Section */}
      <div>
        <h2 style={{ marginBottom: "20px", color: "white" }}>My Reviews</h2>

        {reviews.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
            }}
          >
            <p style={{ color: "#666", fontSize: "18px" }}>
              You haven't written any reviews yet.
            </p>
            <p style={{ color: "#999", fontSize: "14px" }}>
              Start exploring books and share your thoughts!
            </p>
          </div>
        ) : (
          <div>
            {/* Paginated Reviews */}
            {(() => {
              const indexOfLastReview = currentPage * reviewsPerPage;
              const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
              const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
              const totalPages = Math.ceil(reviews.length / reviewsPerPage);

              return (
                <>
                  {currentReviews.map((review) => {
                    const book = review.get("book");
                    const rating = review.get("rating");
                    const reviewText = review.get("reviewText");
                    const createdAt = review.get("createdAt");

                    return (
                      <div
                        key={review.id}
                        style={{
                          border: "1px solid #ddd",
                          borderRadius: "8px",
                          padding: "20px",
                          marginBottom: "20px",
                          backgroundColor: "white",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: "20px",
                            marginBottom: "15px",
                          }}
                        >
                          {/* Book Cover */}
                          {book.coverImage && (
                            <div style={{ flexShrink: 0 }}>
                              <img
                                src={book.coverImage}
                                alt={book.title}
                                style={{
                                  width: "80px",
                                  borderRadius: "4px",
                                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                }}
                              />
                            </div>
                          )}

                          {/* Book Info */}
                          <div style={{ flex: 1 }}>
                            <h3 style={{ marginTop: 0, marginBottom: "5px" }}>
                              {book.title}
                            </h3>
                            <p
                              style={{
                                color: "#666",
                                fontSize: "14px",
                                marginBottom: "10px",
                              }}
                            >
                              by {book.author}
                            </p>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                              }}
                            >
                              <ReviewRating rating={rating} readOnly={true} />
                              <span style={{ color: "#666", fontSize: "14px" }}>
                                {createdAt?.toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Review Text */}
                        <div style={{ marginTop: "15px" }}>
                          <p style={{ lineHeight: "1.6", margin: 0 }}>
                            {reviewText}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "15px",
                        marginTop: "30px",
                        flexWrap: "wrap",
                      }}
                    >
                      <button
                        onClick={() => {
                          if (currentPage > 1) {
                            setCurrentPage(currentPage - 1);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }
                        }}
                        disabled={currentPage === 1}
                        style={{
                          padding: "10px 20px",
                          backgroundColor: currentPage === 1 ? "#ccc" : "#007bff",
                          color: "white",
                          border: "none",
                          borderRadius: "5px",
                          cursor: currentPage === 1 ? "not-allowed" : "pointer",
                          fontSize: "16px",
                        }}
                      >
                        ← Previous
                      </button>

                      <span style={{ color: "white", fontSize: "16px" }}>
                        Page {currentPage} of {totalPages}
                      </span>

                      <button
                        onClick={() => {
                          if (currentPage < totalPages) {
                            setCurrentPage(currentPage + 1);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }
                        }}
                        disabled={currentPage === totalPages}
                        style={{
                          padding: "10px 20px",
                          backgroundColor:
                            currentPage === totalPages ? "#ccc" : "#007bff",
                          color: "white",
                          border: "none",
                          borderRadius: "5px",
                          cursor:
                            currentPage === totalPages ? "not-allowed" : "pointer",
                          fontSize: "16px",
                        }}
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
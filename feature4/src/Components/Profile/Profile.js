import React, { useEffect, useState } from "react";
import Parse from "parse";
import { getCurrentUserReviews } from "../Reviews/ReviewService";
import ReviewRating from "../Reviews/ReviewRating";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

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
        <h2 style={{ marginBottom: "20px", color: "white"}}>My Reviews</h2>

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
            {reviews.map((review) => {
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
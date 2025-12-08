import React, { useEffect, useState } from "react";
import Parse from "parse";
import { getCurrentUserReviews } from "../Reviews/ReviewService";
import ReviewRating from "../Reviews/ReviewRating";
import ProfileSettings from "./ProfileSettings";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const currentUser = Parse.User.current();
      if (currentUser) {
        setUser({
          firstName: currentUser.get("firstName"),
          lastName: currentUser.get("lastName"),
          email: currentUser.get("email"),
          username: currentUser.get("username"),
          profilePicture: currentUser.get("profilePicture") || "",
          reviewsAnonymous: currentUser.get("reviewsAnonymous") || false
        });

        const userReviews = await getCurrentUserReviews();
        setReviews(userReviews);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = () => {
    setLoading(true);
    fetchUserData();
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <h2>Loading profile...</h2>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-not-logged-in">
        <h2>Please log in to view your profile</h2>
      </div>
    );
  }

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  return (
    <div className="profile-container">
      {/* User Info Section */}
      <div className="profile-user-info">
        {/* Profile Picture */}
        {user.profilePicture && (
          <div className="profile-picture-container">
            <img
              src={user.profilePicture}
              alt="Profile"
              className="profile-picture"
            />
          </div>
        )}
        
        <h1 className={user.profilePicture ? "centered" : ""}>
          {user.firstName} {user.lastName}
        </h1>
        <p>
          <strong>Username:</strong> @{user.username}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Total Reviews:</strong> {reviews.length}
        </p>
        <p>
          <strong>Anonymous Reviews:</strong> {user.reviewsAnonymous ? "Enabled" : "Disabled"}
        </p>

        <ProfileSettings user={user} onProfileUpdate={handleProfileUpdate} />
      </div>

      {/* Reviews Section */}
      <div className="profile-reviews-section">
        <h2>My Reviews</h2>

        {reviews.length === 0 ? (
          <div className="profile-no-reviews">
            <p>You haven't written any reviews yet.</p>
            <p>Start exploring books and share your thoughts!</p>
          </div>
        ) : (
          <div>
            {/* Paginated Reviews */}
            {currentReviews.map((review) => {
              const book = review.get("book");
              const rating = review.get("rating");
              const reviewText = review.get("reviewText");
              const createdAt = review.get("createdAt");

              return (
                <div key={review.id} className="profile-review-card">
                  <div className="profile-review-header">
                    {/* Book Cover */}
                    {book.coverImage && (
                      <div className="profile-review-cover">
                        <img
                          src={book.coverImage}
                          alt={book.title}
                        />
                      </div>
                    )}

                    {/* Book Info */}
                    <div className="profile-review-book-info">
                      <h3>{book.title}</h3>
                      <p className="profile-review-author">by {book.author}</p>
                      <div className="profile-review-meta">
                        <ReviewRating rating={rating} readOnly={true} />
                        <span className="profile-review-date">
                          {createdAt?.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Review Text */}
                  <div className="profile-review-text">
                    <p>{reviewText}</p>
                  </div>
                </div>
              );
            })}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="profile-pagination">
                <button
                  onClick={() => {
                    if (currentPage > 1) {
                      setCurrentPage(currentPage - 1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  disabled={currentPage === 1}
                  className={`profile-pagination-btn ${currentPage === 1 ? "disabled" : "active"}`}
                >
                  ← Previous
                </button>

                <span className="profile-pagination-info">
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
                  className={`profile-pagination-btn ${currentPage === totalPages ? "disabled" : "active"}`}
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
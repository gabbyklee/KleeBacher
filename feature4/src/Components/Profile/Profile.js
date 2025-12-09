"use client"

import { useEffect, useState } from "react"
import Parse from "parse"
import { getCurrentUserReviews } from "../Reviews/ReviewService"
import ReviewRating from "../Reviews/ReviewRating"
import ProfileSettings from "./ProfileSettings"
import UserBookListService from "../../Common/Services/UserBookListService"
import "./Profile.css"

const Profile = () => {
  const [user, setUser] = useState(null)
  const [reviews, setReviews] = useState([])
  const [readList, setReadList] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const reviewsPerPage = 5
  const [activeTab, setActiveTab] = useState("reviews")

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const currentUser = Parse.User.current()
      if (currentUser) {
        setUser({
          firstName: currentUser.get("firstName"),
          lastName: currentUser.get("lastName"),
          email: currentUser.get("email"),
          username: currentUser.get("username"),
          profilePicture: currentUser.get("profilePicture") || "",
          reviewsAnonymous: currentUser.get("reviewsAnonymous") || false,
        })

        const userReviews = await getCurrentUserReviews()
        setReviews(userReviews)

        const userReadList = await UserBookListService.getReadList()
        setReadList(userReadList)

        const userWishlist = await UserBookListService.getWishlist()
        setWishlist(userWishlist)
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }

  const handleProfileUpdate = () => {
    fetchUserData()
  }

  const handleRemoveFromReadList = async (bookId) => {
    try {
      await UserBookListService.removeFromReadList(bookId)
      setReadList(readList.filter((book) => book.bookId !== bookId))
    } catch (error) {
      console.error("Error removing from read list:", error)
      alert("Error removing book. Please try again.")
    }
  }

  const handleRemoveFromWishlist = async (bookId) => {
    try {
      await UserBookListService.removeFromWishlist(bookId)
      setWishlist(wishlist.filter((book) => book.bookId !== bookId))
    } catch (error) {
      console.error("Error removing from wishlist:", error)
      alert("Error removing book. Please try again.")
    }
  }

  if (!user) {
    return (
      <div className="profile-not-logged-in">
        <h2>Please log in to view your profile</h2>
      </div>
    )
  }

  const indexOfLastReview = currentPage * reviewsPerPage
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview)
  const totalPages = Math.ceil(reviews.length / reviewsPerPage)

  return (
    <div className="profile-container">
      {/* User Info Section */}
      <div className="profile-user-info">
        {/* Profile Picture */}
        {user.profilePicture && (
          <div className="profile-picture-container">
            <img src={user.profilePicture || "/placeholder.svg"} alt="Profile" className="profile-picture" />
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
          <strong>Books Read:</strong> {readList.length}
        </p>
        <p>
          <strong>Books on Wishlist:</strong> {wishlist.length}
        </p>
        <p>
          <strong>Anonymous Reviews:</strong> {user.reviewsAnonymous ? "Enabled" : "Disabled"}
        </p>

        <ProfileSettings user={user} onProfileUpdate={handleProfileUpdate} />
      </div>

      <div className="profile-tabs">
        <button
          className={`profile-tab ${activeTab === "reviews" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("reviews")
            setCurrentPage(1)
          }}
        >
          My Reviews ({reviews.length})
        </button>
        <button className={`profile-tab ${activeTab === "read" ? "active" : ""}`} onClick={() => setActiveTab("read")}>
          Books Read ({readList.length})
        </button>
        <button
          className={`profile-tab ${activeTab === "wishlist" ? "active" : ""}`}
          onClick={() => setActiveTab("wishlist")}
        >
          Wishlist ({wishlist.length})
        </button>
      </div>

      {activeTab === "reviews" && (
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
                const book = review.get("book")
                const rating = review.get("rating")
                const reviewText = review.get("reviewText")
                const createdAt = review.get("createdAt")

                return (
                  <div key={review.id} className="profile-review-card">
                    <div className="profile-review-header">
                      {/* Book Cover */}
                      {book.coverImage && (
                        <div className="profile-review-cover">
                          <img src={book.coverImage || "/placeholder.svg"} alt={book.title} />
                        </div>
                      )}

                      {/* Book Info */}
                      <div className="profile-review-book-info">
                        <h3>{book.title}</h3>
                        <p className="profile-review-author">by {book.author}</p>
                        <div className="profile-review-meta">
                          <ReviewRating rating={rating} readOnly={true} />
                          <span className="profile-review-date">{createdAt?.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Review Text */}
                    <div className="profile-review-text">
                      <p>{reviewText}</p>
                    </div>
                  </div>
                )
              })}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="profile-pagination">
                  <button
                    onClick={() => {
                      if (currentPage > 1) {
                        setCurrentPage(currentPage - 1)
                        window.scrollTo({ top: 0, behavior: "smooth" })
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
                        setCurrentPage(currentPage + 1)
                        window.scrollTo({ top: 0, behavior: "smooth" })
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
      )}

      {activeTab === "read" && (
        <div className="profile-book-list-section">
          <h2>Books I've Read</h2>

          {readList.length === 0 ? (
            <div className="profile-no-books">
              <p>You haven't added any books to your read list yet.</p>
              <p>Click the book icon on any book card to add it here!</p>
            </div>
          ) : (
            <div className="profile-book-grid">
              {readList.map((book) => (
                <div key={book.id} className="profile-book-item">
                  {book.coverImage && (
                    <img src={book.coverImage || "/placeholder.svg"} alt={book.title} className="profile-book-cover" />
                  )}
                  <h4 className="profile-book-title">{book.title}</h4>
                  <p className="profile-book-author">{book.author}</p>
                  <p className="profile-book-date">Added: {book.addedAt?.toLocaleDateString()}</p>
                  <button className="profile-book-remove-btn" onClick={() => handleRemoveFromReadList(book.bookId)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "wishlist" && (
        <div className="profile-book-list-section">
          <h2>My Wishlist</h2>

          {wishlist.length === 0 ? (
            <div className="profile-no-books">
              <p>You haven't added any books to your wishlist yet.</p>
              <p>Click the heart icon on any book card to add it here!</p>
            </div>
          ) : (
            <div className="profile-book-grid">
              {wishlist.map((book) => (
                <div key={book.id} className="profile-book-item">
                  {book.coverImage && (
                    <img src={book.coverImage || "/placeholder.svg"} alt={book.title} className="profile-book-cover" />
                  )}
                  <h4 className="profile-book-title">{book.title}</h4>
                  <p className="profile-book-author">{book.author}</p>
                  <p className="profile-book-date">Added: {book.addedAt?.toLocaleDateString()}</p>
                  <button className="profile-book-remove-btn" onClick={() => handleRemoveFromWishlist(book.bookId)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Profile

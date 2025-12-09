"use client"

import { useEffect, useState, useCallback } from "react"
import Parse from "parse"
import { getCurrentUserReviews } from "../../Common/Services/ReviewService"
import ReviewRating from "../Reviews/ReviewRating"
import ProfileSettings from "./ProfileSettings"
import UserBookListService from "../../Common/Services/UserBookListService"
import { getBooksByGenre } from "../../Common/Services/GoogleBooksService"
import "./Profile.css"

const Profile = () => {
  const [user, setUser] = useState(null)
  const [reviews, setReviews] = useState([])
  const [readList, setReadList] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const reviewsPerPage = 5
  const [activeTab, setActiveTab] = useState("reviews")
  const [genreRecommendations, setGenreRecommendations] = useState([])
  const [preferenceRecommendations, setPreferenceRecommendations] = useState([])
  const [isEditingPreferences, setIsEditingPreferences] = useState(false)
  const [selectedGenrePreferences, setSelectedGenrePreferences] = useState([])

  const availableGenres = [
    "Fiction",
    "Mystery",
    "Romance",
    "Science Fiction",
    "Fantasy",
    "Thriller",
    "Horror",
    "Biography",
    "History",
    "Self-Help",
    "Business",
    "Poetry",
  ]

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchRecommendations = useCallback(async () => {
    try {
      // Get genres from read books
      const readBookIds = readList.map((book) => book.bookId)

      // Fetch one book per genre from read list
      const genreRecs = []
      const processedGenres = new Set()

      for (const book of readList) {
        // Extract genres from the book's categories
        const bookCategories = book.categories || []

        if (bookCategories.length > 0) {
          // Use the first category that hasn't been processed yet
          for (const category of bookCategories) {
            if (!processedGenres.has(category)) {
              processedGenres.add(category)

              // Fetch books in the same genre
              try {
                const booksInGenre = await getBooksByGenre(category, 10)
                // Filter out books already read
                const unreadBooks = booksInGenre.filter((b) => !readBookIds.includes(b.id))
                if (unreadBooks.length > 0) {
                  genreRecs.push(unreadBooks[0])
                }
              } catch (err) {
                console.log("Error fetching genre books:", err)
              }

              break // Only use first category per book
            }
          }
        }

        // Limit to reasonable number
        if (genreRecs.length >= 6) break
      }

      setGenreRecommendations(genreRecs)

      // Fetch books based on genre preferences
      if (selectedGenrePreferences.length > 0) {
        const prefRecs = []
        for (const genre of selectedGenrePreferences.slice(0, 3)) {
          try {
            const booksInGenre = await getBooksByGenre(genre, 5)
            const unreadBooks = booksInGenre.filter((b) => !readBookIds.includes(b.id))
            prefRecs.push(...unreadBooks.slice(0, 3))
          } catch (err) {
            console.log("Error fetching preference books:", err)
          }
        }
        setPreferenceRecommendations(prefRecs)
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error)
    }
  }, [readList, selectedGenrePreferences])

  useEffect(() => {
    if (activeTab === "recommendations" && readList.length > 0) {
      fetchRecommendations()
    }
  }, [activeTab, readList, fetchRecommendations])

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
          genrePreferences: currentUser.get("genrePreferences") || [],
        })

        setSelectedGenrePreferences(currentUser.get("genrePreferences") || [])

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

  const handleGenrePreferenceToggle = (genre) => {
    setSelectedGenrePreferences((prev) => {
      if (prev.includes(genre)) {
        return prev.filter((g) => g !== genre)
      } else {
        return [...prev, genre]
      }
    })
  }

  const handleSaveGenrePreferences = async () => {
    try {
      const currentUser = Parse.User.current()
      if (currentUser) {
        currentUser.set("genrePreferences", selectedGenrePreferences)
        await currentUser.save()
        setUser({ ...user, genrePreferences: selectedGenrePreferences })
        setIsEditingPreferences(false)
        // Refresh recommendations
        fetchRecommendations()
      }
    } catch (error) {
      console.error("Error saving genre preferences:", error)
      alert("Error saving preferences. Please try again.")
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
    <div className="profile-layout">
      {/* Left Sidebar - User Info Card */}
      <div className="profile-sidebar">
        <div className="profile-user-card">
          {user.profilePicture && (
            <div className="profile-picture-container">
              <img src={user.profilePicture || "/placeholder.svg"} alt="Profile" className="profile-picture" />
            </div>
          )}

          <h1>
            {user.firstName} {user.lastName}
          </h1>
          <div className="profile-user-details">
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
          </div>

          <ProfileSettings user={user} onProfileUpdate={handleProfileUpdate} />
        </div>
      </div>

      {/* Right Panel - Tabs and Content */}
      <div className="profile-main-panel">
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
          <button
            className={`profile-tab ${activeTab === "read" ? "active" : ""}`}
            onClick={() => setActiveTab("read")}
          >
            Books Read ({readList.length})
          </button>
          <button
            className={`profile-tab ${activeTab === "wishlist" ? "active" : ""}`}
            onClick={() => setActiveTab("wishlist")}
          >
            Wishlist ({wishlist.length})
          </button>
          <button
            className={`profile-tab ${activeTab === "recommendations" ? "active" : ""}`}
            onClick={() => setActiveTab("recommendations")}
          >
            Recommendations
          </button>
        </div>

        <div className="profile-tab-content">
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
                  {currentReviews.map((review) => {
                    const book = review.get("book")
                    const rating = review.get("rating")
                    const reviewText = review.get("reviewText")
                    const createdAt = review.get("createdAt")

                    return (
                      <div key={review.id} className="profile-review-card">
                        <div className="profile-review-header">
                          {book.coverImage && (
                            <div className="profile-review-cover">
                              <img src={book.coverImage || "/placeholder.svg"} alt={book.title} />
                            </div>
                          )}

                          <div className="profile-review-book-info">
                            <h3>{book.title}</h3>
                            <p className="profile-review-author">by {book.author}</p>
                            <div className="profile-review-meta">
                              <ReviewRating rating={rating} readOnly={true} />
                              <span className="profile-review-date">{createdAt?.toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="profile-review-text">
                          <p>{reviewText}</p>
                        </div>
                      </div>
                    )
                  })}

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
                        <img
                          src={book.coverImage || "/placeholder.svg"}
                          alt={book.title}
                          className="profile-book-cover"
                        />
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
                        <img
                          src={book.coverImage || "/placeholder.svg"}
                          alt={book.title}
                          className="profile-book-cover"
                        />
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

          {activeTab === "recommendations" && (
            <div className="profile-recommendations-section">
              {/* Genre Preferences Section */}
              <div className="profile-preferences-section">
                <div className="profile-preferences-header">
                  <h3>Your Genre Preferences</h3>
                  {!isEditingPreferences ? (
                    <button className="profile-edit-preferences-btn" onClick={() => setIsEditingPreferences(true)}>
                      Edit Preferences
                    </button>
                  ) : (
                    <div className="profile-preferences-actions">
                      <button className="profile-save-preferences-btn" onClick={handleSaveGenrePreferences}>
                        Save
                      </button>
                      <button
                        className="profile-cancel-preferences-btn"
                        onClick={() => {
                          setSelectedGenrePreferences(user.genrePreferences || [])
                          setIsEditingPreferences(false)
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {isEditingPreferences ? (
                  <div className="profile-genre-selector">
                    {availableGenres.map((genre) => (
                      <label key={genre} className="profile-genre-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedGenrePreferences.includes(genre)}
                          onChange={() => handleGenrePreferenceToggle(genre)}
                        />
                        <span>{genre}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="profile-current-preferences">
                    {selectedGenrePreferences.length > 0 ? (
                      selectedGenrePreferences.map((genre) => (
                        <span key={genre} className="profile-preference-tag">
                          {genre}
                        </span>
                      ))
                    ) : (
                      <p className="profile-no-preferences">
                        No genre preferences set. Click "Edit Preferences" to add some!
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Recommendations based on preferences */}
              {selectedGenrePreferences.length > 0 && preferenceRecommendations.length > 0 && (
                <div className="profile-recommendation-group">
                  <h3>Based on Your Preferences</h3>
                  <div className="profile-book-grid">
                    {preferenceRecommendations.map((book) => (
                      <div key={book.id} className="profile-book-item">
                        {book.imageURL && (
                          <img
                            src={book.imageURL || "/placeholder.svg"}
                            alt={book.title}
                            className="profile-book-cover"
                          />
                        )}
                        <h4 className="profile-book-title">{book.title}</h4>
                        <p className="profile-book-author">{book.author}</p>
                        {book.genre && <p className="profile-book-genre">{book.genre}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations based on read books */}
              {genreRecommendations.length > 0 && (
                <div className="profile-recommendation-group">
                  <h3>Based on Books You've Read</h3>
                  <div className="profile-book-grid">
                    {genreRecommendations.map((book) => (
                      <div key={book.id} className="profile-book-item">
                        {book.imageURL && (
                          <img
                            src={book.imageURL || "/placeholder.svg"}
                            alt={book.title}
                            className="profile-book-cover"
                          />
                        )}
                        <h4 className="profile-book-title">{book.title}</h4>
                        <p className="profile-book-author">{book.author}</p>
                        {book.genre && <p className="profile-book-genre">{book.genre}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {readList.length === 0 && selectedGenrePreferences.length === 0 && (
                <div className="profile-no-books">
                  <p>Start reading books and set your genre preferences to get personalized recommendations!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile

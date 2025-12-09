"use client"

import { useState, useEffect } from "react"
import Parse from "parse"
import UserBookListService from "../../Common/Services/UserBookListService"
import ReviewRating from "../Reviews/ReviewRating"
import "./BookCard.css"

const BookCard = ({ book, rating, onClick }) => {
  const [isInReadList, setIsInReadList] = useState(false)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const checkUserAndLists = async () => {
      const currentUser = Parse.User.current()
      setIsLoggedIn(!!currentUser)

      if (currentUser && book.id) {
        const inReadList = await UserBookListService.isInReadList(book.id)
        const inWishlist = await UserBookListService.isInWishlist(book.id)
        setIsInReadList(inReadList)
        setIsInWishlist(inWishlist)
      }
    }

    checkUserAndLists()
  }, [book.id])

  const handleReadListClick = async (e) => {
    e.stopPropagation()

    if (!isLoggedIn) {
      alert("Please log in to add books to your read list")
      return
    }

    try {
      if (isInReadList) {
        await UserBookListService.removeFromReadList(book.id)
        setIsInReadList(false)
      } else {
        await UserBookListService.addToReadList(book)
        setIsInReadList(true)
      }
    } catch (error) {
      console.error("Error updating read list:", error)
      alert("Error updating read list. Please try again.")
    }
  }

  const handleWishlistClick = async (e) => {
    e.stopPropagation()

    if (!isLoggedIn) {
      alert("Please log in to add books to your wishlist")
      return
    }

    try {
      if (isInWishlist) {
        await UserBookListService.removeFromWishlist(book.id)
        setIsInWishlist(false)
      } else {
        await UserBookListService.addToWishlist(book)
        setIsInWishlist(true)
      }
    } catch (error) {
      console.error("Error updating wishlist:", error)
      alert("Error updating wishlist. Please try again.")
    }
  }

  // Function to handle image loading errors
  const handleImageError = (event) => {
    // Hide the broken image and show the fallback
    event.target.style.display = "none"
    if (event.target.nextSibling) {
      event.target.nextSibling.style.display = "flex"
    }
  }

  return (
    <div className="book-card" onClick={onClick}>
      <div className="book-cover">
        {book.imageURL ? (
          <>
            <img
              src={book.imageURL || "/placeholder.svg"}
              alt={`${book.title} cover`}
              className="book-cover-image"
              onError={handleImageError}
            />
            <div className="book-cover-fallback">{book.title}</div>
          </>
        ) : (
          <span>{book.title}</span>
        )}
      </div>

      <div className="book-title">{book.title}</div>
      <div className="book-author">by {book.author}</div>
      <div className="book-genre">{book.genre}</div>

      {/* Rating Display */}
      {rating && (
        <div className="book-rating-display">
          <ReviewRating rating={Math.round(rating.average)} readOnly={true} />
          {rating.count > 0 && <span className="book-rating-count">({rating.count})</span>}
        </div>
      )}

      {/* Action buttons for logged-in users */}
      {isLoggedIn && (
        <div className="book-card-actions">
          <button
            className={`book-card-icon-btn ${isInReadList ? "active" : ""}`}
            onClick={handleReadListClick}
            title={isInReadList ? "Remove from read list" : "Add to read list"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={isInReadList ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
              {isInReadList && <polyline points="9 10 12 13 16 9"></polyline>}
            </svg>
          </button>

          <button
            className={`book-card-icon-btn ${isInWishlist ? "active" : ""}`}
            onClick={handleWishlistClick}
            title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={isInWishlist ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}

export default BookCard

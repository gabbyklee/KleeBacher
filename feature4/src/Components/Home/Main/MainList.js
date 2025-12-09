"use client"

import { useState, useEffect } from "react"
import BookQuickView from "../../Books/BookQuickView"
import BookCard from "../../Books/BookCard"
import Parse from "parse"

const MainList = ({ fbooks }) => {
  const [selectedBook, setSelectedBook] = useState(null)
  const [bookRatings, setBookRatings] = useState({})

  useEffect(() => {
    const fetchAllRatings = async () => {
      try {
        const Review = Parse.Object.extend("Review")
        const query = new Parse.Query(Review)
        query.limit(1000)

        const allReviews = await query.find()

        const ratings = {}

        allReviews.forEach((review) => {
          const bookData = review.get("book")
          const bookId = bookData.bookId
          const rating = review.get("rating")

          if (!ratings[bookId]) {
            ratings[bookId] = { total: 0, count: 0 }
          }

          ratings[bookId].total += rating
          ratings[bookId].count += 1
        })

        const finalRatings = {}
        Object.keys(ratings).forEach((bookId) => {
          finalRatings[bookId] = {
            average: ratings[bookId].total / ratings[bookId].count,
            count: ratings[bookId].count,
          }
        })

        setBookRatings(finalRatings)
      } catch (error) {
        console.error("Error fetching ratings:", error)
      }
    }

    if (fbooks.length > 0) {
      fetchAllRatings()
    }
  }, [fbooks])

  const handleBookClick = (book) => {
    setSelectedBook(book)
  }

  const handleCloseModal = () => {
    setSelectedBook(null)
  }

  return (
    <>
      <div className="books-grid">
        {fbooks.map((book) => {
          const rating = bookRatings[book.id]

          return <BookCard key={book.id} book={book} rating={rating} onClick={() => handleBookClick(book)} />
        })}
      </div>

      {selectedBook && <BookQuickView book={selectedBook} onClose={handleCloseModal} />}
    </>
  )
}

export default MainList

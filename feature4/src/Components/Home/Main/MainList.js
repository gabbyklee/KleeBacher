import { useState, useEffect } from 'react';
import BookQuickView from '../../Books/BookQuickView';
import Parse from 'parse';
import ReviewRating from '../../Reviews/ReviewRating';

const MainList = ({ fbooks }) => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [bookRatings, setBookRatings] = useState({});

  // Fetch all reviews at once and calculate ratings
  useEffect(() => {
    const fetchAllRatings = async () => {
      try {
        // Fetch all reviews at once
        const Review = Parse.Object.extend("Review");
        const query = new Parse.Query(Review);
        query.limit(1000); // Adjust based on your needs
        
        const allReviews = await query.find();
        
        // Calculate ratings per book
        const ratings = {};
        
        allReviews.forEach(review => {
          const bookData = review.get("book");
          const bookId = bookData.bookId;
          const rating = review.get("rating");
          
          if (!ratings[bookId]) {
            ratings[bookId] = { total: 0, count: 0 };
          }
          
          ratings[bookId].total += rating;
          ratings[bookId].count += 1;
        });
        
        // Calculate averages
        const finalRatings = {};
        Object.keys(ratings).forEach(bookId => {
          finalRatings[bookId] = {
            average: ratings[bookId].total / ratings[bookId].count,
            count: ratings[bookId].count
          };
        });
        
        setBookRatings(finalRatings);
      } catch (error) {
        console.error("Error fetching ratings:", error);
      }
    };
    
    if (fbooks.length > 0) {
      fetchAllRatings();
    }
  }, [fbooks]);

  // Function to handle image loading errors
  const handleImageError = (event) => {
    // Hide the broken image and show the fallback
    event.target.style.display = "none";
    event.target.nextSibling.style.display = "flex";
  };

  const handleBookClick = (book) => {
    setSelectedBook(book);
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
  };

  return (
    <>
      <div className="books-grid">
        {fbooks.map((book) => {
          const rating = bookRatings[book.id];
          
          return (
            <div 
              key={book.id} 
              className="book-card"
              onClick={() => handleBookClick(book)}
            >
              <div className="book-cover">
                {book.imageURL ? (
                  <>
                    <img
                      src={book.imageURL}
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
                  <ReviewRating 
                    rating={Math.round(rating.average)} 
                    readOnly={true} 
                  />
                  {rating.count > 0 && (
                    <span className="book-rating-count">
                      ({rating.count})
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal for book details and reviews */}
      {selectedBook && (
        <BookQuickView 
          book={selectedBook} 
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default MainList;
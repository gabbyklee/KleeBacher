const MainList = ({ fbooks }) => {
  // Function to handle image loading errors
  const handleImageError = (event) => {
    // Hide the broken image and show the fallback
    event.target.style.display = "none";
    event.target.nextSibling.style.display = "flex";
  };

  return (
    <div className="books-grid">
      {fbooks.map((book) => (
        <div key={book.id} className="book-card">
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
        </div>
      ))}
    </div>
  );
};

export default MainList;
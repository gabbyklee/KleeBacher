import { useEffect, useState } from 'react';
import BookModel from '../../../Common/Services/BookModel';
import MainList from './MainList';
import SearchAndFilter from './SearchAndFilter/SearchAndFilter';

const Main = () => {
  const [fbooks, setFBooks] = useState([]);
  const [displayedBooks, setDisplayedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    BookModel.getAllBooks()
      .then((books) => {
        console.log('Books loaded from Parse:', books);
        setFBooks(books);
        setDisplayedBooks(books);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading books:", error);
        setLoading(false);
      });
  }, []);

  const handleFilteredBooks = (filtered) => {
    setDisplayedBooks(filtered);
  };

  if (loading) {
    return (
      <div className="main-content" style={{ textAlign: 'center', color: 'white' }}>
        <h2>Loading books from Parse database...</h2>
      </div>
    );
  }

  return (
    <div>
      <div className="main-content">
        <section className="hero-section">
          <h1>Welcome to Literary Lounge</h1>
          <p>Discover, review, and share your favorite books with a community of passionate readers</p>
        </section>

        <SearchAndFilter 
          books={fbooks} 
          onFilteredBooksChange={handleFilteredBooks}
        />

        <section>
          <h2 className="section-title">Featured Books</h2>
          {displayedBooks.length === 0 && fbooks.length > 0 ? (
            <p className="no-results">No books found matching your filters</p>
          ) : (
            <MainList fbooks={displayedBooks} />
          )}
        </section>
      </div>
    </div>
  );
};

export default Main;
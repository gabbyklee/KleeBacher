import { useEffect, useState } from 'react';
import { getFeaturedBooks } from '../../Services/FeaturedBooks';
import MainList from './MainList';
import SearchAndFilter from '../SearchAndFilter/SearchAndFilter';

const Main = () => {
  // fbooks data passed down
  const [fbooks, setFBooks] = useState([]);
  const [displayedBooks, setDisplayedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getFeaturedBooks()
      .then((fbooks) => {
        setFBooks(fbooks);
        setDisplayedBooks(fbooks); // Initially show all books
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading books:", error);
        setLoading(false);
      });
  }, []);

  // Function to handle filtered books from SearchAndFilter component
  const handleFilteredBooks = (filtered) => {
    setDisplayedBooks(filtered);
  };

  if (loading) {
    return (
      <div className="main-content" style={{ textAlign: 'center', color: 'white' }}>
        <h2>Loading books...</h2>
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

        {/* Search and Filter Component */}
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
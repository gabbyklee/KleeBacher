import { useEffect, useState } from 'react';
import { getPopularBooks } from '../../../Common/Services/GoogleBooksService';
import MainList from './MainList';
import SearchAndFilter from './SearchAndFilter/SearchAndFilter';

const Main = () => {
  const [allBooks, setAllBooks] = useState([]);
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [displayedBooks, setDisplayedBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const booksPerPage = 12; // Show 12 books per page

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    setLoading(true);
    try {
      // Fetch popular books for featured section (top 3)
      const popular = await getPopularBooks('bestseller', 3);
      setFeaturedBooks(popular);
      
      // Fetch all books (mix of different genres)
      const fiction = await getPopularBooks('fiction', 15);
      const mystery = await getPopularBooks('mystery', 10);
      const romance = await getPopularBooks('romance', 10);
      const scifi = await getPopularBooks('scifi', 10);
      const fantasy = await getPopularBooks('fantasy', 10);
      const nonfiction = await getPopularBooks('nonfiction', 10);
      
      // Combine all books and shuffle for variety
      const combined = [...fiction, ...mystery, ...romance, ...scifi, ...fantasy, ...nonfiction];
      const shuffled = combined.sort(() => Math.random() - 0.5);
      
      console.log('Total books loaded:', shuffled.length);
      setAllBooks(shuffled);
      setDisplayedBooks(shuffled);
    } catch (error) {
      console.error("Error loading books:", error);
      alert("Failed to load books from Google Books API");
    } finally {
      setLoading(false);
    }
  };

  const handleFilteredBooks = (filtered) => {
    setDisplayedBooks(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Pagination logic
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = displayedBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(displayedBooks.length / booksPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePageClick = (pageNum) => {
    setCurrentPage(pageNum);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // takes a while to load from Google API so show loading message instead of spazzing
  if (loading) {
    return (
      <div className="main-content" style={{ textAlign: 'center', color: 'white' }}>
        <h2>Loading books from Google Books API...</h2>
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

        {/* Featured Popular Books Section */}
        <section style={{ marginBottom: '40px' }}>
          <h2 className="section-title" style={{ 
            fontSize: '28px', 
            marginBottom: '20px',
            textAlign: 'center' 
          }}>
            Most Popular Books This Week
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '30px',
            maxWidth: '1000px',
            margin: '0 auto',
            padding: '20px'
          }}>
            {featuredBooks.map((book, index) => (
              <div 
                key={book.id}
                style={{
                  border: '2px solid #ffd700',
                  borderRadius: '12px',
                  padding: '20px',
                  backgroundColor: '#fff',
                  boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                {/* Ranking Badge */}
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '-10px',
                  backgroundColor: '#ffd700',
                  color: '#000',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}>
                  #{index + 1}
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <img 
                    src={book.imageURL || "https://via.placeholder.com/128x192?text=No+Cover"}
                    alt={book.title}
                    style={{
                      width: '150px',
                      height: '225px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      marginBottom: '15px',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }}
                  />
                  <h3 style={{ 
                    fontSize: '18px', 
                    marginBottom: '8px',
                    color: '#333'
                  }}>
                    {book.title}
                  </h3>
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#666',
                    marginBottom: '8px'
                  }}>
                    by {book.author}
                  </p>
                  <p style={{ 
                    fontSize: '12px', 
                    color: '#999',
                    fontStyle: 'italic'
                  }}>
                    {book.genre}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <SearchAndFilter 
          books={allBooks} 
          onFilteredBooksChange={handleFilteredBooks}
        />

        {/* All Books Section with Pagination */}
        <section>
          <h2 className="section-title">
            All Books ({displayedBooks.length})
          </h2>
          
          {displayedBooks.length === 0 && allBooks.length > 0 ? (
            <p className="no-results">No books found matching your filters</p>
          ) : (
            <>
              <MainList fbooks={currentBooks} />
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '15px',
                  marginTop: '40px',
                  marginBottom: '40px',
                  flexWrap: 'wrap'
                }}>
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: currentPage === 1 ? '#ccc' : '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      fontSize: '16px'
                    }}
                  >
                    ← Previous
                  </button>
                  
                  {/* Page Numbers */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNum = index + 1;
                      // Show first page, last page, current page, and pages around current
                      if (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageClick(pageNum)}
                            style={{
                              padding: '10px 15px',
                              backgroundColor: currentPage === pageNum ? '#007bff' : '#6c757d',
                              color: 'white',
                              border: 'none',
                              borderRadius: '5px',
                              cursor: 'pointer',
                              fontSize: '16px',
                              fontWeight: currentPage === pageNum ? 'bold' : 'normal'
                            }}
                          >
                            {pageNum}
                          </button>
                        );
                      } else if (
                        pageNum === currentPage - 2 ||
                        pageNum === currentPage + 2
                      ) {
                        return <span key={pageNum} style={{ color: '#666' }}>...</span>;
                      }
                      return null;
                    })}
                  </div>
                  
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: currentPage === totalPages ? '#ccc' : '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      fontSize: '16px'
                    }}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default Main;
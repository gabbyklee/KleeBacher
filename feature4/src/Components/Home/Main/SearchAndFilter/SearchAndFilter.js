import { useState } from 'react';

const SearchAndFilter = ({ books, onFilteredBooksChange }) => {
  // States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [sortBy, setSortBy] = useState("title");

  // Get unique genres from books
  const genres = [
    "all",
    ...new Set(books.map((book) => book.genre.toLowerCase())),
  ];

  // Search input
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    applyFilters(value, selectedGenre, sortBy);
  };

  // Genre selection
  const handleGenreChange = (e) => {
    const genre = e.target.value;
    setSelectedGenre(genre);
    applyFilters(searchTerm, genre, sortBy);
  };

  // Sort selection
  const handleSortChange = (e) => {
    const sort = e.target.value;
    setSortBy(sort);
    applyFilters(searchTerm, selectedGenre, sort);
  };

  // Clear all filters button
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedGenre("all");
    setSortBy("title");
    onFilteredBooksChange(books);
  };

  // Apply all filters and sorting
  const applyFilters = (search, genre, sort) => {
    let filtered = [...books];

    // Filter by search term (title, author, or genre)
    if (search) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(search.toLowerCase()) ||
          book.author.toLowerCase().includes(search.toLowerCase()) ||
          book.genre.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by genre
    if (genre !== "all") {
      filtered = filtered.filter(
        (book) => book.genre.toLowerCase() === genre.toLowerCase()
      );
    }

    // Sort books
    filtered.sort((a, b) => {
      if (sort === "title") {
        return a.title.localeCompare(b.title);
      } else if (sort === "author") {
        return a.author.localeCompare(b.author);
      }
      return 0;
    });

    // Pass filtered books back to parent component
    onFilteredBooksChange(filtered);
  };

  return (
    <div className="search-and-filter">
      <div className="search-section">
        <h3 className="filter-heading">Search & Filter Books</h3>

        {/* INPUT 1: Search Bar */}
        <div className="search-container-main">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-bar-main"
            placeholder="Search by title, author, or genre..."
            value={searchTerm}
            onInput={handleSearchChange}
          />
        </div>

        <div className="filter-controls">
          {/* INPUT 2: Genre Select Dropdown */}
          <div className="filter-group">
            <label htmlFor="genre-select">Filter by Genre:</label>
            <select
              id="genre-select"
              className="filter-select"
              value={selectedGenre}
              onChange={handleGenreChange}
            >
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre === "all"
                    ? "All Genres"
                    : genre.charAt(0).toUpperCase() + genre.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* INPUT 3: Sort Select Dropdown */}
          <div className="filter-group">
            <label htmlFor="sort-select">Sort by:</label>
            <select
              id="sort-select"
              className="filter-select"
              value={sortBy}
              onChange={handleSortChange}
            >
              <option value="title">Title (A-Z)</option>
              <option value="author">Author (A-Z)</option>
            </select>
          </div>

          {/* INPUT 4: Clear Filters Button */}
          <button className="clear-filters-btn" onClick={handleClearFilters}>
            Clear Filters
          </button>
        </div>

        
      </div>
    </div>
  );
};

export default SearchAndFilter;
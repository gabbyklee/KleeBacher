// Google Books API Service

const GOOGLE_BOOKS_API_BASE = "https://www.googleapis.com/books/v1/volumes";

/**
 * Search for books by query
 * @param {string} query - Search term (title, author, etc.)
 * @param {number} maxResults - Number of results to return (default 20)
 * @param {string} orderBy - Sort order: 'relevance' or 'newest'
 * @returns {Promise<Array>} Array of book objects
 */
export const searchBooks = async (query, maxResults = 20, orderBy = "relevance") => {
  try {
    const url = `${GOOGLE_BOOKS_API_BASE}?q=${encodeURIComponent(query)}&maxResults=${maxResults}&orderBy=${orderBy}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Google Books API error: ${response.status}`);
    }
    
    const data = await response.json();
    return formatBookData(data.items || []);
  } catch (error) {
    console.error("Error searching books:", error);
    throw error;
  }
};

/**
 * Get popular/featured books (bestsellers, popular fiction, etc.)
 * @param {string} category - Category to fetch (e.g., 'fiction', 'bestseller', 'science')
 * @param {number} maxResults - Number of results
 * @returns {Promise<Array>} Array of book objects
 */
export const getPopularBooks = async (category = "bestseller", maxResults = 20) => {
  try {
    // Use subject or special queries to get popular books
    const queries = {
      bestseller: "subject:fiction&orderBy=relevance",
      fiction: "subject:fiction&orderBy=newest",
      nonfiction: "subject:nonfiction&orderBy=relevance",
      mystery: "subject:mystery&orderBy=relevance",
      romance: "subject:romance&orderBy=relevance",
      scifi: "subject:science+fiction&orderBy=relevance",
      fantasy: "subject:fantasy&orderBy=relevance"
    };
    
    const query = queries[category] || queries.bestseller;
    const url = `${GOOGLE_BOOKS_API_BASE}?q=${query}&maxResults=${maxResults}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Google Books API error: ${response.status}`);
    }
    
    const data = await response.json();
    return formatBookData(data.items || []);
  } catch (error) {
    console.error("Error fetching popular books:", error);
    throw error;
  }
};

/**
 * Get a specific book by ID
 * @param {string} bookId - Google Books ID
 * @returns {Promise<Object>} Book object
 */
export const getBookById = async (bookId) => {
  try {
    const url = `${GOOGLE_BOOKS_API_BASE}/${bookId}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Google Books API error: ${response.status}`);
    }
    
    const data = await response.json();
    return formatSingleBook(data);
  } catch (error) {
    console.error("Error fetching book by ID:", error);
    throw error;
  }
};

/**
 * Get books by author
 * @param {string} author - Author name
 * @param {number} maxResults - Number of results
 * @returns {Promise<Array>} Array of book objects
 */
export const getBooksByAuthor = async (author, maxResults = 20) => {
  return searchBooks(`inauthor:${author}`, maxResults);
};

/**
 * Get books by genre/subject
 * @param {string} genre - Genre/subject
 * @param {number} maxResults - Number of results
 * @returns {Promise<Array>} Array of book objects
 */
export const getBooksByGenre = async (genre, maxResults = 20) => {
  return searchBooks(`subject:${genre}`, maxResults);
};

/**
 * Format book data from Google Books API to match our app's structure
 * @param {Array} items - Raw items from Google Books API
 * @returns {Array} Formatted book objects
 */
const formatBookData = (items) => {
  return items.map(item => formatSingleBook(item));
};

/**
 * Format a single book object
 * @param {Object} item - Raw book item from Google Books API
 * @returns {Object} Formatted book object
 */
const formatSingleBook = (item) => {
  const volumeInfo = item.volumeInfo || {};
  const imageLinks = volumeInfo.imageLinks || {};
  
  return {
    id: item.id,
    title: volumeInfo.title || "Unknown Title",
    author: volumeInfo.authors?.join(", ") || "Unknown Author",
    authors: volumeInfo.authors || ["Unknown Author"],
    description: volumeInfo.description || "No description available.",
    genre: volumeInfo.categories?.join(", ") || "General",
    categories: volumeInfo.categories || [],
    imageURL: imageLinks.thumbnail || imageLinks.smallThumbnail || "",
    publishedDate: volumeInfo.publishedDate || "",
    pageCount: volumeInfo.pageCount || 0,
    averageRating: volumeInfo.averageRating || 0,
    ratingsCount: volumeInfo.ratingsCount || 0,
    language: volumeInfo.language || "en",
    previewLink: volumeInfo.previewLink || "",
    infoLink: volumeInfo.infoLink || "",
    // Keep the original volumeInfo for BookQuickView compatibility
    volumeInfo: volumeInfo
  };
};

export default {
  searchBooks,
  getPopularBooks,
  getBookById,
  getBooksByAuthor,
  getBooksByGenre
};
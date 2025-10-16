import Parse from '../ParseConfig';

class BookModel {
  // CREATE - Add a new book (for admin use)
  static async createBook(bookData) {
    const Book = Parse.Object.extend("Book");
    const book = new Book();
    
    book.set("title", bookData.title);
    book.set("author", bookData.author);
    book.set("genre", bookData.genre);
    book.set("imageURL", bookData.imageURL);
    book.set("description", bookData.description || "");
    
    try {
      const result = await book.save();
      console.log('Book created:', result);
      return result;
    } catch (error) {
      console.error('Error creating book:', error);
      throw error;
    }
  }

  // READ - Get all books
  static async getAllBooks() {
    const query = new Parse.Query("Book");
    query.limit(100); // Get up to 100 books
    
    try {
      const results = await query.find();
      console.log('Books fetched:', results.length);
      
      // Convert Parse objects to plain JavaScript objects
      return results.map(book => ({
        id: book.id,
        title: book.get('title'),
        author: book.get('author'),
        genre: book.get('genre'),
        imageURL: book.get('imageURL'),
        description: book.get('description')
      }));
    } catch (error) {
      console.error('Error fetching books:', error);
      throw error;
    }
  }

  // READ - Get one book by ID
  static async getBookById(bookId) {
    const query = new Parse.Query("Book");
    
    try {
      const book = await query.get(bookId);
      return {
        id: book.id,
        title: book.get('title'),
        author: book.get('author'),
        genre: book.get('genre'),
        imageURL: book.get('imageURL'),
        description: book.get('description')
      };
    } catch (error) {
      console.error('Error fetching book:', error);
      throw error;
    }
  }

  // READ - Search books by title, author, or genre
  static async searchBooks(searchTerm) {
    const titleQuery = new Parse.Query("Book");
    titleQuery.matches("title", searchTerm, "i");
    
    const authorQuery = new Parse.Query("Book");
    authorQuery.matches("author", searchTerm, "i");
    
    const genreQuery = new Parse.Query("Book");
    genreQuery.matches("genre", searchTerm, "i");
    
    const mainQuery = Parse.Query.or(titleQuery, authorQuery, genreQuery);
    
    try {
      const results = await mainQuery.find();
      return results.map(book => ({
        id: book.id,
        title: book.get('title'),
        author: book.get('author'),
        genre: book.get('genre'),
        imageURL: book.get('imageURL'),
        description: book.get('description')
      }));
    } catch (error) {
      console.error('Error searching books:', error);
      throw error;
    }
  }

  // UPDATE - Update a book
  static async updateBook(bookId, updates) {
    const query = new Parse.Query("Book");
    
    try {
      const book = await query.get(bookId);
      
      // Update fields
      Object.keys(updates).forEach(key => {
        book.set(key, updates[key]);
      });
      
      const result = await book.save();
      console.log('Book updated:', result);
      return result;
    } catch (error) {
      console.error('Error updating book:', error);
      throw error;
    }
  }

  // DELETE - Delete a book
  static async deleteBook(bookId) {
    const query = new Parse.Query("Book");
    
    try {
      const book = await query.get(bookId);
      await book.destroy();
      console.log('Book deleted');
      return true;
    } catch (error) {
      console.error('Error deleting book:', error);
      throw error;
    }
  }
}

export default BookModel;
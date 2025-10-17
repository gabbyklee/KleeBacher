import Parse from 'parse';

/**
 * ReviewModel - Handles all review operations
 * Review feature not yet implemented in UI 
 */
class ReviewModel {
    // CREATE - Create a new review
    static async createReview(reviewData) {
        const Review = Parse.Object.extend("Review");
        const review = new Review();
        
        review.set("title", reviewData.title);
        review.set("content", reviewData.content);
        review.set("rating", reviewData.rating);
        
        try {
          const result = await review.save();
          
          // Add review to book's reviews array
          const BookModel = require('./BookModel').default;
          await BookModel.addReviewToBook(reviewData.bookId, result.id);
          
          return {
            id: result.id,
            title: result.get('title'),
            content: result.get('content'),
            rating: result.get('rating')
          };
        } catch (error) {
          console.error('Error creating review:', error);
          throw error;
        }
      }

  // READ - Get all reviews for a specific book
  static async getReviewsByBook(bookId) {
    const query = new Parse.Query("Review");
    query.equalTo("bookId", bookId);
    query.descending("createdAt");
    query.limit(50);
    
    try {
      const results = await query.find();
      console.log(`Reviews fetched for book ${bookId}:`, results.length);
      
      return results.map(review => ({
        id: review.id,
        title: review.get('title'),
        content: review.get('content'),
        rating: review.get('rating'),
        bookId: review.get('bookId'),
        createdAt: review.get('createdAt')
      }));
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  }

  // UPDATE - Update an exisiting review
  static async updateReview(reviewId, updates) {
    const query = new Parse.Query("Review");
    
    try {
      const review = await query.get(reviewId);
      
      if (updates.title) review.set("title", updates.title);
      if (updates.content) review.set("content", updates.content);
      if (updates.rating !== undefined) review.set("rating", updates.rating);
      
      const result = await review.save();
      return {
        id: result.id,
        title: result.get('title'),
        content: result.get('content'),
        rating: result.get('rating'),
        bookId: result.get('bookId')
      };
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  }

  // DELETE - Delete a review
  static async deleteReview(reviewId) {
    const query = new Parse.Query("Review");
    
    try {
      const review = await query.get(reviewId);
      await review.destroy();
      console.log('Review deleted:', reviewId);
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  }
}

export default ReviewModel;

import Parse from "parse";

// Create a new review
export const createReview = async (reviewData) => {
  const Review = Parse.Object.extend("Review");
  const review = new Review();
  
  review.set("book", {
    bookId: reviewData.bookId,
    title: reviewData.bookTitle,
    author: reviewData.bookAuthor,
    coverImage: reviewData.bookCoverImage
  });
  review.set("user", Parse.User.current());
  review.set("rating", reviewData.rating);
  review.set("reviewText", reviewData.reviewText);
  review.set("likes", 0);
  
  try {
    const result = await review.save();
    return result;
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
};

// Get all reviews for a specific book
export const getReviewsForBook = async (bookId) => {
  const Review = Parse.Object.extend("Review");
  const query = new Parse.Query(Review);
  
  query.equalTo("book.bookId", bookId);
  query.include("user");
  query.descending("createdAt");
  
  try {
    const results = await query.find();
    return results;
  } catch (error) {
    console.error("Error fetching book reviews:", error);
    throw error;
  }
};

// Get popular reviews for a book (sorted by likes)
export const getPopularReviewsForBook = async (bookId, limit = 5) => {
  const Review = Parse.Object.extend("Review");
  const query = new Parse.Query(Review);
  
  query.equalTo("book.bookId", bookId);
  query.include("user");
  query.descending("likes");
  query.limit(limit);
  
  try {
    const results = await query.find();
    return results;
  } catch (error) {
    console.error("Error fetching popular reviews:", error);
    throw error;
  }
};

// Get all reviews by a specific user
export const getReviewsByUser = async (userId) => {
  const Review = Parse.Object.extend("Review");
  const query = new Parse.Query(Review);
  
  const user = new Parse.User();
  user.id = userId;
  
  query.equalTo("user", user);
  query.descending("createdAt");
  
  try {
    const results = await query.find();
    return results;
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    throw error;
  }
};

// Get current user's reviews
export const getCurrentUserReviews = async () => {
  const currentUser = Parse.User.current();
  if (!currentUser) {
    throw new Error("No user logged in");
  }
  
  const Review = Parse.Object.extend("Review");
  const query = new Parse.Query(Review);
  
  query.equalTo("user", currentUser);
  query.descending("createdAt");
  
  try {
    const results = await query.find();
    return results;
  } catch (error) {
    console.error("Error fetching current user reviews:", error);
    throw error;
  }
};

// Update a review
export const updateReview = async (reviewId, updatedData) => {
  const Review = Parse.Object.extend("Review");
  const query = new Parse.Query(Review);
  
  try {
    const review = await query.get(reviewId);
    
    if (updatedData.rating !== undefined) {
      review.set("rating", updatedData.rating);
    }
    if (updatedData.reviewText !== undefined) {
      review.set("reviewText", updatedData.reviewText);
    }
    
    const result = await review.save();
    return result;
  } catch (error) {
    console.error("Error updating review:", error);
    throw error;
  }
};

// Delete a review
export const deleteReview = async (reviewId) => {
  const Review = Parse.Object.extend("Review");
  const query = new Parse.Query(Review);
  
  try {
    const review = await query.get(reviewId);
    await review.destroy();
    return true;
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
};

// Like a review (increment likes)
export const likeReview = async (reviewId) => {
  const Review = Parse.Object.extend("Review");
  const query = new Parse.Query(Review);
  
  try {
    const review = await query.get(reviewId);
    review.increment("likes");
    const result = await review.save();
    return result;
  } catch (error) {
    console.error("Error liking review:", error);
    throw error;
  }
};
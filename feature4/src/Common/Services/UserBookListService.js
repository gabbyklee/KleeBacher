import Parse from "parse"

class UserBookListService {
  // Add book to user's read list
  static async addToReadList(bookData) {
    try {
      const currentUser = Parse.User.current()
      if (!currentUser) {
        throw new Error("User must be logged in")
      }

      const ReadBook = Parse.Object.extend("ReadBook")
      const readBook = new ReadBook()

      readBook.set("user", currentUser)
      readBook.set("bookId", bookData.id)
      readBook.set("title", bookData.volumeInfo?.title || "Unknown Title")
      readBook.set("author", bookData.volumeInfo?.authors?.join(", ") || "Unknown Author")
      readBook.set(
        "coverImage",
        bookData.volumeInfo?.imageLinks?.thumbnail || bookData.volumeInfo?.imageLinks?.smallThumbnail || "",
      )
      readBook.set("description", bookData.volumeInfo?.description || "")
      // Store genre/categories for recommendations
      readBook.set("genre", bookData.volumeInfo?.categories?.join(", ") || "General")
      readBook.set("categories", bookData.volumeInfo?.categories || [])

      const result = await readBook.save()
      console.log("Book added to read list:", result)
      return result
    } catch (error) {
      console.error("Error adding book to read list:", error)
      throw error
    }
  }

  // Add book to user's wishlist
  static async addToWishlist(bookData) {
    try {
      const currentUser = Parse.User.current()
      if (!currentUser) {
        throw new Error("User must be logged in")
      }

      const WishlistBook = Parse.Object.extend("WishlistBook")
      const wishlistBook = new WishlistBook()

      wishlistBook.set("user", currentUser)
      wishlistBook.set("bookId", bookData.id)
      wishlistBook.set("title", bookData.volumeInfo?.title || "Unknown Title")
      wishlistBook.set("author", bookData.volumeInfo?.authors?.join(", ") || "Unknown Author")
      wishlistBook.set(
        "coverImage",
        bookData.volumeInfo?.imageLinks?.thumbnail || bookData.volumeInfo?.imageLinks?.smallThumbnail || "",
      )
      wishlistBook.set("description", bookData.volumeInfo?.description || "")
      // Store genre/categories
      wishlistBook.set("genre", bookData.volumeInfo?.categories?.join(", ") || "General")
      wishlistBook.set("categories", bookData.volumeInfo?.categories || [])

      const result = await wishlistBook.save()
      console.log("Book added to wishlist:", result)
      return result
    } catch (error) {
      console.error("Error adding book to wishlist:", error)
      throw error
    }
  }

  // Remove book from read list
  static async removeFromReadList(bookId) {
    try {
      const currentUser = Parse.User.current()
      if (!currentUser) {
        throw new Error("User must be logged in")
      }

      const query = new Parse.Query("ReadBook")
      query.equalTo("user", currentUser)
      query.equalTo("bookId", bookId)

      const readBook = await query.first()
      if (readBook) {
        await readBook.destroy()
        console.log("Book removed from read list")
        return true
      }
      return false
    } catch (error) {
      console.error("Error removing book from read list:", error)
      throw error
    }
  }

  // Remove book from wishlist
  static async removeFromWishlist(bookId) {
    try {
      const currentUser = Parse.User.current()
      if (!currentUser) {
        throw new Error("User must be logged in")
      }

      const query = new Parse.Query("WishlistBook")
      query.equalTo("user", currentUser)
      query.equalTo("bookId", bookId)

      const wishlistBook = await query.first()
      if (wishlistBook) {
        await wishlistBook.destroy()
        console.log("Book removed from wishlist")
        return true
      }
      return false
    } catch (error) {
      console.error("Error removing book from wishlist:", error)
      throw error
    }
  }

  // Get user's read list
  static async getReadList() {
    try {
      const currentUser = Parse.User.current()
      if (!currentUser) {
        throw new Error("User must be logged in")
      }

      const query = new Parse.Query("ReadBook")
      query.equalTo("user", currentUser)
      query.descending("createdAt")

      const results = await query.find()
      return results.map((book) => ({
        id: book.id,
        bookId: book.get("bookId"),
        title: book.get("title"),
        author: book.get("author"),
        coverImage: book.get("coverImage"),
        description: book.get("description"),
        genre: book.get("genre"),
        categories: book.get("categories") || [],
        addedAt: book.get("createdAt"),
      }))
    } catch (error) {
      console.error("Error fetching read list:", error)
      throw error
    }
  }

  // Get user's wishlist
  static async getWishlist() {
    try {
      const currentUser = Parse.User.current()
      if (!currentUser) {
        throw new Error("User must be logged in")
      }

      const query = new Parse.Query("WishlistBook")
      query.equalTo("user", currentUser)
      query.descending("createdAt")

      const results = await query.find()
      return results.map((book) => ({
        id: book.id,
        bookId: book.get("bookId"),
        title: book.get("title"),
        author: book.get("author"),
        coverImage: book.get("coverImage"),
        description: book.get("description"),
        genre: book.get("genre"),
        categories: book.get("categories") || [],
        addedAt: book.get("createdAt"),
      }))
    } catch (error) {
      console.error("Error fetching wishlist:", error)
      throw error
    }
  }

  // Check if book is in read list
  static async isInReadList(bookId) {
    try {
      const currentUser = Parse.User.current()
      if (!currentUser) {
        return false
      }

      const query = new Parse.Query("ReadBook")
      query.equalTo("user", currentUser)
      query.equalTo("bookId", bookId)

      const count = await query.count()
      return count > 0
    } catch (error) {
      console.error("Error checking read list:", error)
      return false
    }
  }

  // Check if book is in wishlist
  static async isInWishlist(bookId) {
    try {
      const currentUser = Parse.User.current()
      if (!currentUser) {
        return false
      }

      const query = new Parse.Query("WishlistBook")
      query.equalTo("user", currentUser)
      query.equalTo("bookId", bookId)

      const count = await query.count()
      return count > 0
    } catch (error) {
      console.error("Error checking wishlist:", error)
      return false
    }
  }
}

export default UserBookListService

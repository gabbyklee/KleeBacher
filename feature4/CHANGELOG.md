# Changelog

All notable changes to this project will be documented in this file.

## [0.6.0] - 2025-12-08

### Added (Kylie)
- Book Club feature with real-time chat using Parse Live Query
- Personal book lists: Wishlist and Read List
- Book recommendations based on user's reading history
- BookClub, Message, UserClubs, WishlistBook, and ReadBook Parse classes

### Added (Gabby)
- Friends system with search, friend requests, and friends list
- FriendService for friend management operations
- FriendRequest and Friendship Parse classes
- Three-tab interface: Search Users, Requests, My Friends
- Profile picture display in navbar and throughout app

### Changed
- Renamed Explore page to Friends
- Fixed user ACL to enable public read access for search functionality
- Refactored all components to use external CSS files instead of inline styles
- Improved code organization and maintainability

## [0.5.0] - 2025-12-07

### Added
- User profile page with review history and settings
- Profile editing (username, profile picture, anonymous reviews toggle)
- Review system now links reviews to users
- ProfileSettings component for editing user information

### Changed
- Reviews now display username or "Anonymous" based on user preference
- Updated Review Parse class to include user pointer

## [0.4.0] - 2025-12-03

### Added
- Book review system with 1-5 star ratings
- ReviewList component with pagination
- ReviewForm for writing reviews
- ReviewCard for displaying reviews
- Google Books API integration for book data
- BookQuickView modal for book details
- Review Parse class

### Changed
- Replaced static book data with dynamic Google Books API
- Books now fetched on-demand instead of stored in Parse

## [0.3.0] - 2025-11-7

### Added
- ProtectedRoute component to handle authentication-required routes
- Parse authentication service (AuthService.js) with user registration, login, and authentication check methods
- AuthRegister component for new user registration
- AuthLogin component for existing user login
- AuthForm component for reusable login/registration form UI
- AuthModule component as authentication landing page
- Route protection preventing unauthenticated access to protected routes
- Automatic redirection to authentication page for unauthenticated users attempting to access protected routes
- Automatic redirection to home page for authenticated users attempting to access login/signup pages

### Changed
- Updated routing structure to include authentication flow
- Protected main application routes requiring authentication

## [0.2.0] - 2025-10-17

### Added
- Migrated from Preact to React
- Parse Server backend integration via Back4App
- BookModel with CRUD operations
- ReviewModel with CRUD operations (not implemented in UI yet)
- Parse initialization configuration
- Asynchronous data loading with loading states
- Error handling for all Parse queries
- React Router for navigation
- Search and filter functionality integrated with Parse

### Changed
- Replaced local JSON data storage with Parse database
- Updated all components from Preact htm syntax to React JSX
- Migrated from axios to Parse SDK for data fetching
- Refactored FeaturedBooks service to use BookModel
- Updated navigation to use React Router Links



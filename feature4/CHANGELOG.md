# Changelog

All notable changes to this project will be documented in this file.

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

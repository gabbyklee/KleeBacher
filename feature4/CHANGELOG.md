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


import React from "react";
import "./BookCard.css";

const BookCard = ({ book, onClick }) => {
  const volumeInfo = book.volumeInfo || {};
  const imageLinks = volumeInfo.imageLinks || {};
  
  return (
    <div 
      className="book-card"
      onClick={() => onClick(book)}
    >
      <img 
        src={imageLinks.thumbnail || imageLinks.smallThumbnail || "https://via.placeholder.com/128x192?text=No+Cover"} 
        alt={volumeInfo.title}
        className="book-card-image"
      />
      <h4 className="book-card-title">
        {volumeInfo.title}
      </h4>
      <p className="book-card-author">
        {volumeInfo.authors?.join(", ") || "Unknown Author"}
      </p>
    </div>
  );
};

export default BookCard;
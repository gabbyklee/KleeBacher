import React from "react";

const BookCard = ({ book, onClick }) => {
  const volumeInfo = book.volumeInfo || {};
  const imageLinks = volumeInfo.imageLinks || {};
  
  return (
    <div 
      className="book-card"
      onClick={() => onClick(book)}
      style={{
        cursor: "pointer",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "10px",
        transition: "transform 0.2s, box-shadow 0.2s",
        textAlign: "center"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <img 
        src={imageLinks.thumbnail || imageLinks.smallThumbnail || "https://via.placeholder.com/128x192?text=No+Cover"} 
        alt={volumeInfo.title}
        style={{
          width: "100%",
          maxWidth: "128px",
          borderRadius: "4px",
          marginBottom: "10px"
        }}
      />
      <h4 style={{ 
        fontSize: "14px", 
        margin: "5px 0",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }}>
        {volumeInfo.title}
      </h4>
      <p style={{ 
        fontSize: "12px", 
        color: "#666",
        margin: "5px 0",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }}>
        {volumeInfo.authors?.join(", ") || "Unknown Author"}
      </p>
    </div>
  );
};

export default BookCard;
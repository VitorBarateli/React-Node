import React from "react";

const MovieCard = ({ title, description, poster, rating, year }) => {
  return (
    <div className="movie-card">
      <img src={poster} alt={title} />
      <h3>{title} {year && `(${year})`}</h3>
      <p>{description}</p>
      <p>⭐ {rating}</p>
    </div>
  );
};

export default MovieCard;
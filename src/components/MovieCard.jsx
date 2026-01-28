import React from "react";

const MovieCard = ({ title, description, poster, rating }) => {
  return (
    <div className="movie-card">
      <img src={poster} alt={title} />
      <h3>{title}</h3>
      <p>{description}</p>
      <p>⭐ {rating}</p>
    </div>
  );
};

export default MovieCard;
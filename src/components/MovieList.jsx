import React, { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import Filter from "./Filter";
import Pagination from "./Pagination";

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 4;

  useEffect(() => {
    fetch("/videos.json")
      .then((response) => response.json())
      .then((data) => setMovies(data))
      .catch((error) => console.error("Erro ao carregar os filmes:", error));
  }, []);

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  const sortedMovies = [...filteredMovies].sort((a, b) => {
    return sortOrder === "asc" ? a.rating - b.rating : b.rating - a.rating;
  });

  const totalPages = Math.ceil(sortedMovies.length / moviesPerPage);
  const startIndex = (currentPage - 1) * moviesPerPage;
  const selectedMovies = sortedMovies.slice(startIndex, startIndex + moviesPerPage);

  return (
    <>
      <Filter search={search} setSearch={setSearch} sortOrder={sortOrder} setSortOrder={setSortOrder} />

      <div className="movie-list">
        {selectedMovies.length > 0 ? (
          selectedMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              title={movie.title}
              description={movie.description}
              poster={movie.poster}
              rating={movie.rating}
            />
          ))
        ) : (
          <p>Nenhum filme encontrado</p>
        )}
      </div>

      <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </>
  );
};

export default MovieList;
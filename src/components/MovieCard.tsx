import React from "react";

interface Movie {
  movie: {
    Title: string;
    Year: string;
    Genre: string;
    Director: string;
    Writer: string;
    Actors: string;
    Plot: string;
    Poster: string;
    imdbRating: string;
  };
}

export const MovieCard = ({ movie }: Movie) => {
  return (
    <>
      <div className="movieCardContainer">
        <div className="movieTitle">{movie.Title}</div>
        <img className="moviePoster" src={movie.Poster}></img>
        <div className="movieDescr">
          <div>
            <span className="movieDir">감독:</span> {movie.Director}
          </div>
          <div>
            <span className="movieDir">개봉일:</span> {movie.Year}
          </div>
          <div>
            <span className="movieDir">장르:</span> {movie.Genre}
          </div>
          <div>
            <span className="movieDir">평점:</span> {movie.imdbRating}/10
          </div>
        </div>
      </div>
    </>
  );
};

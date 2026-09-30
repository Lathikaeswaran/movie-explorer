import { useState } from "react";
import "./App.css";

function App() {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);

  const searchMovies = async () => {
    if (!search.trim()) {
      setError("Please enter a movie name.");
      setMovies([]);
      return;
    }

    setLoading(true);
    setError("");
    setSelectedMovie(null);

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${
          import.meta.env.VITE_TMDB_API_KEY
        }&query=${encodeURIComponent(search)}`
      );

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        setMovies(data.results);
      } else {
        setMovies([]);
        setError("No movies found.");
      }
    } catch (error) {
      setMovies([]);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1 className="title">🎬 Movie Explorer</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              searchMovies();
            }
          }}
        />

        <button onClick={searchMovies}>Search 🔍</button>
      </div>

      {loading && <p className="message">🎬 Loading movies...</p>}

      {error && <p className="message">{error}</p>}

      <div className="movie-grid">
        {movies.map((movie) => (
          <div className="movie-card" key={movie.id}>
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title}
              />
            ) : (
              <div className="no-poster">No Poster</div>
            )}

            <h2>{movie.title}</h2>

            <p>
              📅 Release:{" "}
              {movie.release_date || "N/A"}
            </p>

            <p>
              ⭐ Rating: {movie.vote_average.toFixed(1)}/10
            </p>

            <p>
              🌍 Language:{" "}
              {movie.original_language
                ? movie.original_language.toUpperCase()
                : "N/A"}
            </p>

            <p>
              🔥 Popularity:{" "}
              {movie.popularity
                ? movie.popularity.toFixed(0)
                : "N/A"}
            </p>

            <p>
              🎭 Genre IDs:{" "}
              {movie.genre_ids && movie.genre_ids.length > 0
                ? movie.genre_ids.join(", ")
                : "N/A"}
            </p>

            <button
              className="details-btn"
              onClick={() => setSelectedMovie(movie)}
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {selectedMovie && (
        <div className="details-overlay">
          <div className="details-box">
            <button
              className="close-btn"
              onClick={() => setSelectedMovie(null)}
            >
              ✕
            </button>

            {selectedMovie.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w300${selectedMovie.poster_path}`}
                alt={selectedMovie.title}
              />
            )}

            <h2>{selectedMovie.title}</h2>

            <p>
              <strong>Release Date:</strong>{" "}
              {selectedMovie.release_date || "N/A"}
            </p>

            <p>
              <strong>Rating:</strong>{" "}
              ⭐ {selectedMovie.vote_average.toFixed(1)}/10
            </p>

            <p>
              <strong>Language:</strong>{" "}
              {selectedMovie.original_language
                ? selectedMovie.original_language.toUpperCase()
                : "N/A"}
            </p>

            <p>
              <strong>Popularity:</strong>{" "}
              {selectedMovie.popularity
                ? selectedMovie.popularity.toFixed(0)
                : "N/A"}
            </p>

            <p>
              <strong>Overview:</strong>
            </p>

            <p>
              {selectedMovie.overview ||
                "No overview available."}
            </p>

            <button
              className="close-details"
              onClick={() => setSelectedMovie(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
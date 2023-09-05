import { useEffect, useState } from "react";
const key = "ca78726a";
export function useMovies(query, callback) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(
    function () {
      callback?.();
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${key}&s=${query}`,
            { signal: controller.signal }
          );
          if (!res.ok)
            throw new Error("Something went wrong please try again later!!");
          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");
          setMovies(() => data.Search);
          setError("");
        } catch (err) {
          console.error(err);
          if (err.name !== "AbortError") {
            setError(() => err.message);
          }
        } finally {
          setLoading(() => false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      //   handleCLoseMovies();
      fetchMovies();
      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return { movies, loading, error };
}

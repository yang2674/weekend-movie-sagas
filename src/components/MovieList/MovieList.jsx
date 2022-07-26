import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './MovieList.css';
import MovieItem from '../MovieItem/MovieItem';

function MovieList() {
    //const
    const dispatch = useDispatch();
    const movies = useSelector((store) => store.movies);

    //useEffect => on page load, GET all movies
    useEffect(() => {
        dispatch({ type: 'FETCH_MOVIES' });
    }, []);

    return (
        <main>
            <section className="movies">
                {movies.map((movie, i) => {
                    return <MovieItem key={i} movie={movie} />;
                })}
            </section>
        </main>
    );
}

export default MovieList;

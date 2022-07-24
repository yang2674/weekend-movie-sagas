import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App.js';
import { createStore, combineReducers, applyMiddleware } from 'redux';
// Provider allows us to use redux within our react app
import { Provider } from 'react-redux';
import logger from 'redux-logger';
// Import saga middleware
import createSagaMiddleware from 'redux-saga';
import { takeEvery, put } from 'redux-saga/effects';
import axios from 'axios';

// Create the rootSaga generator function
function* rootSaga() {
    yield takeEvery('FETCH_MOVIES', fetchAllMovies);
    //change this action type
    yield takeEvery('FETCH_DETAILS', fetchMovie);
    yield takeEvery('FETCH_GENRES', fetchGenres);
}

//! GET => REFRESH DOM
function* fetchAllMovies() {
    // get all movies from the DB
    try {
        const movies = yield axios.get('/api/movie');
        console.log('get all:', movies.data);
        //! storing in redux
        yield put({ type: 'SET_MOVIES', payload: movies.data });
        yield put({ type: 'SET_GENRES', payload: genres.data });
    } catch {
        console.log('ERR in fetchAllMovies');
    }
}

//! How does it know which movie to pull from?
function* fetchMovie() {
    //* get specific movie
    try {
        const movies = yield axios.get('/api/movie');
        yield put({ type: 'FETCH_DETAILS', payload: movies.id });
    } catch {
        console.log('ERR in fetchMovie');
    }
}
//genre
function* fetchGenres(action) {
    // get specific movie
    try {
        const genres = yield axios.get(`/api/genre/${action.payload}`);
        yield put({ type: 'SET_GENRES', payload: genres.data });
    } catch {
        console.log('ERR in fetchGenres');
    }
}

// Create sagaMiddleware
const sagaMiddleware = createSagaMiddleware();

// Used to store movies returned from the server
const movies = (state = [], action) => {
    switch (action.type) {
        case 'SET_MOVIES':
            return action.payload;
        default:
            return state;
    }
};

// Used to store the movie genres
const genres = (state = [''], action) => {
    switch (action.type) {
        case 'SET_GENRES':
            return action.payload;
        default:
            return state;
    }
};

// Create one store that all components can use
const storeInstance = createStore(
    combineReducers({
        movies,
        genres,
    }),
    // Add sagaMiddleware to our store
    applyMiddleware(sagaMiddleware, logger)
);

// Pass rootSaga into our sagaMiddleware
sagaMiddleware.run(rootSaga);

ReactDOM.render(
    <React.StrictMode>
        <Provider store={storeInstance}>
            <App />
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

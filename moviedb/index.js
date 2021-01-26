const { moviedbApikey } = require('../config.json');
const { MovieDb } = require('moviedb-promise');
const moviedb = new MovieDb(moviedbApikey);


const findMovie = async title => {
	// Equivalant to { query: title }
	const res = await moviedb.searchMovie(title);
	return res;
};

const configuration = async () => {
	const res = await moviedb.configuration();
	return res;
};

const getImageUrl = async path => {
	const res = await moviedb.configuration();
	// todo: make below line more readable.
	return `${res.images.base_url}${res.images.poster_sizes[4]}/${path}`;
};

module.exports = {
	moviedb: moviedb,
	findMovie: findMovie,
	configuration: configuration,
	getImageUrl: getImageUrl,
};
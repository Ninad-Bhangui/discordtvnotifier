const { moviedbApikey } = require('../config.js')
import { MovieDb } from 'moviedb-promise'
const moviedb = new MovieDb(moviedbApikey!)

const findMovie = async (title: string) => {
  // Equivalant to { query: title }
  const res = await moviedb.searchMovie({query:title})
  return res
}

const findTv = async (title: string) => {
  const res = await moviedb.searchTv({query:title})
  return res
}

const configuration = async () => {
  const res = await moviedb.configuration()
  return res
}

const getImageUrl = async (path: string) => {
  const res = await moviedb.configuration()
  // todo: make below line more readable.
  return `${res.images.base_url}${res.images.poster_sizes![4]}/${path}`
}

module.exports = {
  moviedb: moviedb,
  findMovie: findMovie,
  findTv: findTv,
  configuration: configuration,
  getImageUrl: getImageUrl,
}

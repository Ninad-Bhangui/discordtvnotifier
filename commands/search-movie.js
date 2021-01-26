const Discord = require('discord.js');
const { findMovie, getImageUrl } = require('../moviedb');

module.exports = {
	name: 'searchmovie',
	description: 'Search movie!',
	cooldown: 10,
	// eslint-disable-next-line no-unused-vars
	async execute (message, args) {
		try {
			const movies = await findMovie(args[0]);
			// Use the most popular movie from list
			if (movies.total_results > 0) {
				const movie = movies.results.reduce((p, c) => p.popularity > c.popularity ? p : c);
				const movieEmbed = new Discord.MessageEmbed()
					.setColor('#0099ff')
					.setTitle(movie.title)
					.setDescription(movie.overview)
					.setImage(await getImageUrl(movie.poster_path));
				message.channel.send(movieEmbed);
			}
			else {
				message.channel.send(`Movie: ${args[0]} not found`);
			}
		}
		catch (error) {
			message.channel.send(`MovieDB Error: ${error}`);
		}
	},
};
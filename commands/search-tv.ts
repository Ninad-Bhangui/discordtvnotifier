const Discord = require('discord.js');
const { findTv, getImageUrl } = require('../moviedb');
import { Command, Message } from 'discord.js'
module.exports = {
	name: 'searchtv',
	description: 'Search tv!',
	cooldown: 10,
	// eslint-disable-next-line no-unused-vars
	async execute (message: Message, args: string[]) {
		try {
			const entries = await findTv(args[0]);
			// Use the most popular movie from list
			if (entries.total_results > 0) {
				const entry = entries.results.reduce((p, c) => p.popularity > c.popularity ? p : c);
				console.log(entry)
				const tvEmbed = new Discord.MessageEmbed()
					.setColor('#0099ff')
					.setTitle(entry.name)
					.setDescription(entry.overview)
					.setImage(await getImageUrl(entry.poster_path));
				message.channel.send(tvEmbed);
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
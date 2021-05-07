import { Command, Message } from 'discord.js'
module.exports = {
  name: 'ping',
  description: 'Ping!',
  cooldown: 5,
  // eslint-disable-next-line no-unused-vars
  execute(message: Message, args: string[]) {
    message.channel.send('Pong.')
  },
}

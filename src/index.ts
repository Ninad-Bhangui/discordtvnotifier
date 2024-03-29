import fs from 'fs'
const { prefix, token } = require('./config.js')
// require the discord.js module
import {Client, Collection, TextChannel, Command} from 'discord.js'
// create a new Discord client
const client = new Client()
client.commands = new Collection()
const commandFiles = fs
  .readdirSync(`${__dirname}/commands`)
  .filter(file => file.endsWith('.js'))
console.log(`commands found: ${commandFiles}`)
for (const file of commandFiles) {
  const command = require(`${__dirname}/commands/${file}`)
  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  client.commands.set(command.name, command)
}

const cooldowns: Collection<string, Collection<string,number>> = new Collection()
// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
  console.log('Ready!')
})
client.on('message', message => {
  if (!message.content.startsWith(prefix!) || message.author.bot) return
  const args = message.content.slice(prefix!.length).trim().split(/ +/)

  const commandName = args.shift()!.toLowerCase()
  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      cmd => cmd.aliases && cmd.aliases.includes(commandName)
    )
  if (!command) return

  if (command.guildOnly && message.channel.type === 'dm') {
    return message.reply("I can't execute that command inside DMs!")
  }

  if (command.permissions) {
    const authorPerms = (message.channel as TextChannel).permissionsFor(message.author)
    if (!authorPerms || !authorPerms.has(command.permissions)) {
      return message.reply('You can do this!')
    }
  }
  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}`

    if (command.usage) {
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``
    }
    return message.channel.send(reply)
  }

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Collection())
  }

  const now = Date.now()
  const timestamps = cooldowns.get(command.name)
  const cooldownAmount = (command.cooldown || 3) * 1000

  if (timestamps!.has(message.author.id)) {
    const expirationTime = timestamps!.get(message.author.id)! + cooldownAmount

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000
      return message.reply(
        `please wait ${timeLeft.toFixed(
          1
        )} more second(s) before reusing the \`${command.name}\` command`
      )
    }
  }
  timestamps!.set(message.author.id, now)
  setTimeout(() => timestamps!.delete(message.author.id), cooldownAmount)

  try {
    command.execute(message, args)
  } catch (error) {
    console.error(error)
    message.reply('there was an error trying to execute that command!')
  }
})

// login to Discord with your app's token
client.login(token)

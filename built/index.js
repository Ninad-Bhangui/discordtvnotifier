"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var _a = require('./config.js'), prefix = _a.prefix, token = _a.token;
// require the discord.js module
var discord_js_1 = require("discord.js");
// create a new Discord client
var client = new discord_js_1.Client();
client.commands = new discord_js_1.Collection();
var commandFiles = fs_1.default
    .readdirSync(__dirname + "/commands")
    .filter(function (file) { return file.endsWith('.js'); });
console.log("commands found: " + commandFiles);
for (var _i = 0, commandFiles_1 = commandFiles; _i < commandFiles_1.length; _i++) {
    var file = commandFiles_1[_i];
    var command = require(__dirname + "/commands/" + file);
    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}
var cooldowns = new discord_js_1.Collection();
// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', function () {
    console.log('Ready!');
});
client.on('message', function (message) {
    if (!message.content.startsWith(prefix) || message.author.bot)
        return;
    var args = message.content.slice(prefix.length).trim().split(/ +/);
    var commandName = args.shift().toLowerCase();
    var command = client.commands.get(commandName) ||
        client.commands.find(function (cmd) { return cmd.aliases && cmd.aliases.includes(commandName); });
    if (!command)
        return;
    if (command.guildOnly && message.channel.type === 'dm') {
        return message.reply("I can't execute that command inside DMs!");
    }
    if (command.permissions) {
        var authorPerms = message.channel.permissionsFor(message.author);
        if (!authorPerms || !authorPerms.has(command.permissions)) {
            return message.reply('You can do this!');
        }
    }
    if (command.args && !args.length) {
        var reply = "You didn't provide any arguments, " + message.author;
        if (command.usage) {
            reply += "\nThe proper usage would be: `" + prefix + command.name + " " + command.usage + "`";
        }
        return message.channel.send(reply);
    }
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new discord_js_1.Collection());
    }
    var now = Date.now();
    var timestamps = cooldowns.get(command.name);
    var cooldownAmount = (command.cooldown || 3) * 1000;
    if (timestamps.has(message.author.id)) {
        var expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        if (now < expirationTime) {
            var timeLeft = (expirationTime - now) / 1000;
            return message.reply("please wait " + timeLeft.toFixed(1) + " more second(s) before reusing the `" + command.name + "` command");
        }
    }
    timestamps.set(message.author.id, now);
    setTimeout(function () { return timestamps.delete(message.author.id); }, cooldownAmount);
    try {
        command.execute(message, args);
    }
    catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});
// login to Discord with your app's token
client.login(token);

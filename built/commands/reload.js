"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    name: 'reload',
    description: 'Reloads a command',
    execute: function (message, args) {
        var commandName = args[0].toLowerCase();
        var command = message.client.commands.get(commandName)
            || message.client.commands.find(function (cmd) { return cmd.aliases && cmd.aliases.includes(commandName); });
        if (!command)
            return message.channel.send("There is no command with name or alias `" + commandName + "`, " + message.author + "!");
        delete require.cache[require.resolve("./" + command.name + ".js")];
        try {
            var newCommand = require("./" + command.name + ".js");
            message.client.commands.set(newCommand.name, newCommand);
            message.channel.send("Command `" + command.name + "` was reloaded!");
        }
        catch (error) {
            console.error(error);
            message.channel.send("There was an error while reloading a command `" + command.name + "`:\n`" + error.message + "`");
        }
    },
};

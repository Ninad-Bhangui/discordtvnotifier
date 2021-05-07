"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    name: 'ping',
    description: 'Ping!',
    cooldown: 5,
    // eslint-disable-next-line no-unused-vars
    execute: function (message, args) {
        message.channel.send('Pong.');
    },
};

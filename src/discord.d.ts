import {Message, Permissions} from 'discord.js'
//Extended typings for discord client
declare module "discord.js" {
    export interface Client {
        commands: Collection<string, Command>
    } 

    export interface Command {
        name: string,
        description: string,
        aliases: string[],
        guildOnly: boolean,
        cooldown: number,
        permissions: Permissions,
        usage: string,
        args: string[],
        execute: (message: Message, args: string[]) => void // Can be `Promise<SomeType>` if using async
    }
}

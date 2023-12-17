const {ActivityType} = require('discord.js')

module.exports = (argument, client, handler) => {
    console.log(`${client.user.tag} is online.`)
    client.user.setPresence({ activities: [{ name: 'for rule breakers', type: ActivityType.Watching }] })
}
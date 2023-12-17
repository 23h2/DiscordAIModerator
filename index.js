require("dotenv").config()
const { Client, IntentsBitField } = require('discord.js')
const { CommandHandler } = require('djs-commander')
const path = require('path')

const RealClient = new Client({
  intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.MessageContent, IntentsBitField.Flags.GuildMessages]
})

new CommandHandler({
  client: RealClient, 
  commandsPath: path.join(__dirname, 'commands'),
  eventsPath: path.join(__dirname, 'events'),
  validationsPath: path.join(__dirname, 'validations'),
  testServer: process.env["GUILD_ID"]
})

RealClient.login(process.env["TOKEN"])
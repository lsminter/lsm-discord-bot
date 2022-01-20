import { Client, Intents } from "discord.js"
import { ReacordDiscordJs, Button } from "reacord"
import dotenv from 'dotenv'
dotenv.config()

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const reacord = new ReacordDiscordJs(client)
const channelId = process.env.CHANNEL_ID

client.on("ready", () => {
  client.application?.commands.create({
    name: "ping",
    description: "pong!",
  })
})

client.on("interactionCreate", (interaction) => {
  if (interaction.isCommand() && interaction.commandName == "ping") {
    // U=se the reply() function instead of send
    reacord.reply(interaction, 'pong!')
  }
})
await client.login(process.env.BOT_TOKEN)
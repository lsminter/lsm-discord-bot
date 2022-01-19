import { Client, Intents } from "discord.js"
import { ReacordDiscordJs, Button } from "reacord"
import { ge } from 'osrs-json-api'
import dotenv from 'dotenv'
dotenv.config()

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const reacord = new ReacordDiscordJs(client)
const channelId = process.env.CHANNEL_ID



client.on("ready", () => {
  reacord.send(channelId, `{return: 1}`)
})

await client.login(process.env.BOT_TOKEN)
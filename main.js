import { Client, Intents } from "discord.js"
import dotenv from 'dotenv'
dotenv.config()

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on("messageCreate", async function(message) {
  const prefix = "!"
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();

  if (command === "eventhelp") {
    message.reply(`To work the !event command, type !event, how many people you want, and how many minutes until you want to do the event.`)
  }

  else if (command === "event") {
    
    const allArgs = args.map(x => x)
    const event = allArgs[0]
    const numberOfPeople = allArgs[1]
    const duration = allArgs[2]
    const adding = Math.round((new Date()).getTime() / 1000)
    const remainingTime = `<t:${adding + (duration * 60)}:R>`
    console.log(remainingTime)

    
    message.reply(`${message.author} is looking for a group of ${numberOfPeople} to do ${event} ${remainingTime}! Reply to this message with 👆 if you are interested.`)

  }
});

await client.login(process.env.BOT_TOKEN)
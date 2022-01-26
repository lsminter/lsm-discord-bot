import { Client, Intents } from "discord.js"
import dotenv from 'dotenv'
dotenv.config()

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.once('ready', () => {
	console.log('Ready!');
});

client.on("messageCreate", async message => {
  const prefix = "!"
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();

  if (command === "eventhelp") {
    message.reply(`To work the !event command, type !event, the event you want to do (keep in mind it has to be one word), how many people you want, and how many minutes until you want to do the event. Here is a template: !event Corp 4 20`)
  }

  else if (command === "event") {
    
    const allArgs = args.map(x => x)
    const event = allArgs[0]
    const numberOfPeople = allArgs[1]
    const duration = allArgs[2]
    const currentTime = Math.round((new Date()).getTime() / 1000)
    const remainingTime = `<t:${currentTime + (duration * 60)}:R>`
    const deleteTimer = (duration * 60000) + 60000

    //simple error handling
    if (remainingTime === '<t:NaN:R>'){
      message.reply('Your minutes has to be only a number. Check your command and try again.')
    } else {
      const sentMessage = await message.reply({content: `${message.author} is looking for a group of ${numberOfPeople} to do ${event} ${remainingTime}! Reply to this message with 👆 if you are interested.`})
        sentMessage.react('👆')
        //deletes the bot's message
        setTimeout(() => {sentMessage.delete()}, deleteTimer)
        //deletes the user's message
        setTimeout(() => {message.delete()}, deleteTimer)
    }    
  }
});

await client.login(process.env.BOT_TOKEN)
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
    const sentMessage = await message.reply(`To work the !event command, type !event, the event you want to do (it can be as many words as you want), how many people you want, and how many minutes until you want to do the event. Here is a template: !event Corp 4 20`)

    //deletes the user's message instantly
   message.delete()
        
    //deletes the bot's message after 2 minutes
    setTimeout(() => {sentMessage.delete()}, 120000)
  }

  else if (command === "event") {
    
    const minutes = args.pop()
    const numberOfPeople = args.pop()
    const event = args.join(" ")




    //gets the current time and converts it to unix timestamp
    const currentTime = Math.round((new Date()).getTime() / 1000)
    /*takes the number that the user gives, multiplies it by 60 to change it to seconds, 
    then adds it to the current time */
    const remainingTime = `<t:${currentTime + (minutes * 60)}:R>`

    //Calculates how long until the event starts in milliseconds then adds one minute. 
    const deleteTimer = (minutes * 60000) + 60000

    //simple error handling
    if (remainingTime === '<t:NaN:R>'){
      const sentMessage = await message.reply('Your minutes has to be only a number. Check your command and try again.')
      
      //deletes the user's message after 30s
      setTimeout(() => {message.delete()}, 30000)
        
      //deletes the bot's message after 30s
      setTimeout(() => {sentMessage.delete()}, 30000)
    } else {
      const sentMessage = await message.reply({content: `${message.author} is looking for a group of ${numberOfPeople} to do ${event} ${remainingTime}! Reply to this message with 👆 if you are interested.`})
        sentMessage.react('👆')
        
        //deletes the user's message
        message.delete()
        
        //deletes the bot's message
        setTimeout(() => {sentMessage.delete()}, deleteTimer)
        
    }
  }
});

await client.login(process.env.BOT_TOKEN)
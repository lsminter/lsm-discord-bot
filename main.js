import { Client, Intents } from "discord.js"
import fetch from "node-fetch";
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

  if (command === "allcommands") {
    message.reply({content: "The commands are !eventhelp, !event, and !eventstats."})
  }
  else if (command === "eventhelp") {
    const sentMessage = await message.reply(`To work the !event command, type !event, the event you want to do (it can be as many words as you want), how many people you want, and how many minutes until you want to do the event. Here is a template: !event Corp 4 20`)

    //deletes the user's message instantly
   message.delete()
        
    //deletes the bot's message after 2 minutes
    setTimeout(() => {sentMessage.delete()}, 120000)
  }

  else if (command === "event") {
    console.log(args)
    //Takes the last item in the array and assigns it to minutes
    const minutes = args.pop()

    //Takes the new last item in the array and assigns it to the number of people
    const numberOfPeople = args.pop()

    //Takes the rest of the elements that are left in the array and combines them with a space and assigns it to the event
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
  else if (command === "eventstats" ){
    const groupId = process.env.WISE_OLD_MAN_GROUP_ID
    const recentCompetitionId = await fetch(`https://wiseoldman.net/api/groups/${groupId}/competitions`)
      .then(response => response.json())
      .then(data => data[0].id)
    
    
    const competitionData = await fetch(`https://wiseoldman.net/api/competitions/${recentCompetitionId}`)
      .then(response => response.json())
      .then(data => data.participants)

    const firstPlace = competitionData[0].username
    const firstPlaceXp = competitionData[0].progress.gained
    const secondPlace = competitionData[1].username
    const secondPlaceXp = competitionData[1].progress.gained
    const thirdPlace = competitionData[2].username
    const thirdPlaceXp = competitionData[2].progress.gained
    
    message.reply({content: `The top three players are: First place is ${firstPlace} with ${firstPlaceXp} experience, Second place is ${secondPlace} with ${secondPlaceXp} experience, and Third place is ${thirdPlace} with ${thirdPlaceXp}!`})
  }
  else if (command === "userstats") {
    const name = args.join(" ")
    const firstMessage = await message.reply({content: "Calculating... Please be patient"})

    const groupId = process.env.WISE_OLD_MAN_GROUP_ID
    const recentCompetitionId = await fetch(`https://wiseoldman.net/api/groups/${groupId}/competitions`)
      .then(response => response.json())
      .then(data => data[0].id)
    
    
    const competitionData = await fetch(`https://wiseoldman.net/api/competitions/${recentCompetitionId}`)
      .then(response => response.json())
      .then(data => data.participants)

    const usersStats = competitionData.map(function(value) {
      if (name.toLowerCase() === value.username){
        message.reply({content: `${name} has gained ${value.progress.gained} experience this competition!`})
        firstMessage.delete()
      }
      
    //     console.log('Username doesn\'t exist')
    //     const errorMessage = message.reply({content: `That username does not exist. Please try again.`})
    //     firstMessage.delete()
    //     setTimeout(() => {errorMessage.delete()}, 15000)
      
    })
    
    // const usersData = (user) => {
    //   const path = "username"
    //   return path.split(".").reduce(function(obj, field){
    //     if(obj[field] === name){
    //       message.reply({content: `${name} has gained ${user.progress.gained} experience this competition!`})
    //     }
    //     return false;
    //   }, user)
    // }

    // competitionData.forEach(user => {
    //   console.log(usersData(user))
    // });


  }
});

await client.login(process.env.BOT_TOKEN)
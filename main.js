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
    const botMessage = await message.reply({content: "The commands are !eventhelp, !event, !eventstats, !lasteventstats, and !userstats."})
    setTimeout(() => {
      botMessage.delete()
      message.delete()
    }, 30000)
  }
  else if (command === "eventhelp") {
    const sentMessage = await message.reply(`To work the !event command, type !event, the event you want to do (it can be as many words as you want), how many people you want, and how many minutes until you want to do the event. Here is a template: !event Corp 4 20`)

    //deletes the user's message instantly
    message.delete()
        
    //deletes the bot's message after 2 minutes
    setTimeout(() => {sentMessage.delete()}, 120000)
  }

  else if (command === "event") {
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

    const calculatingMessage = await message.reply({content: "Calculating... Please be patient"})

    const groupId = process.env.WISE_OLD_MAN_GROUP_ID
    const recentCompetition = await fetch(`https://wiseoldman.net/api/groups/${groupId}/competitions`)
      .then(response => response.json())
      .then(data => data[0])
    
    const recentCompetitionId = recentCompetition.id

    const competitionData = await fetch(`https://wiseoldman.net/api/competitions/${recentCompetitionId}`)
      .then(response => response.json())
      .then(data => data.participants)

    const firstPlace = competitionData[0].username
    const firstPlaceXp = competitionData[0].progress.gained
    const secondPlace = competitionData[1].username
    const secondPlaceXp = competitionData[1].progress.gained
    const thirdPlace = competitionData[2].username
    const thirdPlaceXp = competitionData[2].progress.gained
    
    const endingDate = new Date(recentCompetition.endsAt)
    const endDateUNIX = Math.floor(endingDate.getTime() / 1000)    
    
    const today = new Date()
    const todayUNIX = Math.floor(today.getTime() / 1000)

    if (todayUNIX > endDateUNIX) {
      message.reply({content: `There are no current competitions running.`})
      calculatingMessage.delete()
    } else {
      message.reply({content: `The top three players are: First place is ${firstPlace} with ${firstPlaceXp} experience, Second place is ${secondPlace} with ${secondPlaceXp} experience, and Third place is ${thirdPlace} with ${thirdPlaceXp}!`})
      calculatingMessage.delete()
    }
  }
  else if (command === "lasteventstats" ){

    const calculatingMessage = await message.reply({content: "Calculating... Please be patient"})

    const groupId = process.env.WISE_OLD_MAN_GROUP_ID
    const recentCompetition = await fetch(`https://wiseoldman.net/api/groups/${groupId}/competitions`)
      .then(response => response.json())
      .then(data => data[0])
    
    const recentCompetitionId = recentCompetition.id

    const competitionData = await fetch(`https://wiseoldman.net/api/competitions/${recentCompetitionId}`)
      .then(response => response.json())
      .then(data => data.participants)

    const firstPlace = competitionData[0].username
    const firstPlaceXp = competitionData[0].progress.gained
    const secondPlace = competitionData[1].username
    const secondPlaceXp = competitionData[1].progress.gained
    const thirdPlace = competitionData[2].username
    const thirdPlaceXp = competitionData[2].progress.gained
    
    const endingDate = new Date(recentCompetition.endsAt)
    const endDateUNIX = Math.floor(endingDate.getTime() / 1000)    
    
    const today = new Date()
    const todayUNIX = Math.floor(today.getTime() / 1000)

    
    message.reply({content: `The top three players are: First place is ${firstPlace} with ${firstPlaceXp} experience, Second place is ${secondPlace} with ${secondPlaceXp} experience, and Third place is ${thirdPlace} with ${thirdPlaceXp}!`}) 
    calculatingMessage.delete()
    
  }
  else if (command === "userstats") {
    const name = args.join(" ").toLowerCase()
    const calculatingMessage = await message.reply({content: "Calculating... Please be patient"})

    const groupId = process.env.WISE_OLD_MAN_GROUP_ID
    const recentCompetition = await fetch(`https://wiseoldman.net/api/groups/${groupId}/competitions`)
      .then(response => response.json())
      .then(data => data[0])

    const recentCompetitionId = recentCompetition.id

    const competitionData = await fetch(`https://wiseoldman.net/api/competitions/${recentCompetitionId}`)
      .then(response => response.json())
      .then(data => data.participants)

    let myFoundUser = competitionData.find((user) => user.username === name)    
    
    const endingDate = new Date(recentCompetition.endsAt)
    const endDateUNIX = Math.floor(endingDate.getTime() / 1000)    
    
    const today = new Date()
    const todayUNIX = Math.floor(today.getTime() / 1000)

    if (todayUNIX > endDateUNIX) {
      message.reply({content: `There are no current competitions running.`})
      calculatingMessage.delete()
    } else if (myFoundUser){
      message.reply({content: `For the ${recentCompetition.title} competition, ${myFoundUser.displayName} has gained ${myFoundUser.progress.gained} experience!`})
      calculatingMessage.delete()
    } else {
      const errorMessage = await message.reply({content: `The username "${name}" does not exist for the ${recentCompetition.title} competition. Please try again.`})
      calculatingMessage.delete()
      setTimeout(() => {
        errorMessage.delete()
        message.delete()
      }, 15000)
    } 
  }
});

await client.login(process.env.BOT_TOKEN)
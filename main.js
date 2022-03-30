import { Client, Intents } from "discord.js"
import fetch from "node-fetch";
import dotenv from 'dotenv'
dotenv.config()

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES], partials: [ 'CHANNEL'] });

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
    const botEventMessage = await message.author.send({ content: "What is the name of your event?"})
    const firstResponse = await message.author.dmChannel.awaitMessages({ max: 1 })
    const userEventResponse = firstResponse.first().content
    
    const botNumberMessage = await message.author.send ({ content: `How many people do you want for ${userEventResponse}`})
    const secondResponse = await message.author.dmChannel.awaitMessages({ max: 1 })
    const userNumberResponse = secondResponse.first().content

    const botTimeMessage = await message.author.send ({ content: `In how many minutes do you want to do ${userEventResponse}`})
    const thirdResponse = await message.author.dmChannel.awaitMessages({ max: 1 })
    const userTimeResponse = thirdResponse.first().content

    const botRequirementMessage = await message.author.send ({ content: `Do you have any requirements for the event ${userEventResponse}`})
    const fourthResponse = await message.author.dmChannel.awaitMessages({ max: 1 })
    const userRequirementResponse = fourthResponse.first().content

    const minutes = userTimeResponse
    const currentTime = Math.round((new Date()).getTime() / 1000)
    const remainingTime = `<t:${currentTime + (minutes * 60)}:R>`
    const deleteTimer = (minutes * 60000) + 60000

    const embedEvent = {
      color: 0x0099ff,
      title: userEventResponse + " Event",
      description: `${message.author} is looking for a group to do ${userEventResponse}. Reply to this message with 👆 if you are interested.`,
      fields: [
        {
          name: 'Time till event', 
          value: remainingTime,
          inline: true
        },
        {
          name: 'How many people wanted', 
          value: userNumberResponse,
          inline: true
        },
        {
          name: 'Requirements for Event', 
          value: userRequirementResponse
        },

      ]
    }
    
    const embedMessage = await message.channel.send({ embeds: [embedEvent]})
    embedMessage.react('👆')
    message.author.send({content: 'Event Created! Check back in the channel you sent the command in.'})
    client.
    message.delete()
    setTimeout(() =>{
      embedMessage.delete()
    }, deleteTimer) 
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
      const compMessage = await message.reply({content: `There are no current competitions running.`})
      calculatingMessage.delete()
      message.delete()
      setTimeout(() => {
        compMessage.delete()
      }, 15000)
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

    const competitionData = await fetch(`https://wiseoldman.net/api/competitions/${recentCompetition.id}`)
      .then(response => response.json())
      .then(data => data.participants)

    let myFoundUser = competitionData.find((user) => user.username === name)    
    
    const endingDate = new Date(recentCompetition.endsAt)
    const endDateUNIX = Math.floor(endingDate.getTime() / 1000)    
    
    const today = new Date()
    const todayUNIX = Math.floor(today.getTime() / 1000)

    if (todayUNIX > endDateUNIX) {
      const compMessage = await message.reply({content: `There are no current competitions running.`})
      calculatingMessage.delete()
      message.delete()
      setTimeout(() => {
        compMessage.delete()
      }, 15000)
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

  else if(command === 'bingostats'){
    
    const metric = args.join(" ").toLowerCase()
    const underscoreMetric = metric.split(' ').join('_')

    const groupId = process.env.WISE_OLD_MAN_GROUP_ID
    const recentCompetition = await fetch(`https://wiseoldman.net/api/groups/${groupId}/competitions`)
      .then(response => response.json())
      .then(data => data[0])

    const endingDate = new Date(recentCompetition.endsAt)
    const endDateUNIX = Math.floor(endingDate.getTime() / 1000)    
    
    const today = new Date()
    const todayUNIX = Math.floor(today.getTime() / 1000)

    if (todayUNIX > endDateUNIX) {
      const compMessage = await message.reply({content: `There are no current competitions running.`})
      calculatingMessage.delete()
      message.delete()
      setTimeout(() => {
        compMessage.delete()
      }, 15000)
    } else {
      const metricLink = await message.reply({ content: `https://wiseoldman.net/competitions/${recentCompetition.id}/teams?metric=${underscoreMetric}`})
      setTimeout(() => {
        metricLink.delete()
      }, 15000)
      message.delete()
    }
  }

  else if (command === 'keyboard') {
    message.channel.send({ content: "I use a UHK Keyboard. The whole reason I have this keyboard is because having to move my thumb under my palm to reach the cmd/option keys (on a mac) is literally fucking up my hand. More and more often, I'm getting longer lasting cramps and it gets to the point where I can almost not move my left thumb for 10 to 20 seconds. It's stuck pressed against my palm. This solves the issue of reaching under my hand. The three button thumb module an addon you can get. I got the addon so I could move the option/cmd keys to the right instead of under my hand."})
  }



  // Temporary commands for the Bingo.
  else if (command === "team1"){
    message.channel.send({content: "For the bingo event 4, Team 1 consists of: Acid Pools, Brimham, Complex, Drex, Getsmokbd, Im Okayy, Uzumaki Hamy, HorizonPH, Lesmondan, Lockluster, Minterhero, RetroJelly, Gol D Roger, Solid, Solo H, Termi, Unlukkie, Xiuol, Mc Red"})
  }

  else if (command === "team2") {
    message.channel.send({ content: "For the bingo event 4, Team 2 consists of: Busf, Cen Werd, Crunchips, Floki, Goff, Heights, Housework, Jecr, LuckyImp, Plod, Subview, Maidmento, Titterzz, Void-Cho, Solo W"})
  }

  else if (command === '2020bingo'){
    message.channel.send({content: 'Event: Tea Bingo 4. It\'s time to prepare yourselves! Bingo starts on the 19th March and will run for just over 2 weeks. Participants will be split into 2 or 3 teams. We already have some clan funds to give out to the winners but any donations would be much appreciated! Dates: 19th March to 3rd April.'})
  }

  else if (command === 'bingosheet'){
    message.reply({ content: `https://docs.google.com/spreadsheets/d/1LX29pE3ID5QGHaSodtubRN_ZsFZNnbPZx41u2Tv7lDY/edit?usp=sharing`})
  }
  
  else if (command === 'wiseoldman'){
    message.reply({ content: `https://wiseoldman.net/competitions/9781`})
  }
});

await client.login(process.env.BOT_TOKEN)
import { Client, Intents } from "discord.js"
import { ReacordDiscordJs, Button } from "reacord"
import { ge } from 'osrs-json-api'
import dotenv from 'dotenv'
dotenv.config()

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const reacord = new ReacordDiscordJs(client)
const channelId = process.env.CHANNEL_ID

function Uptime() {
  const [startTime] = useState(Date.now())
  const [currentTime, setCurrentTime] = useState(Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      currentTime(Date.now())
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return <>this message has been shown for {currentTime - startTime}ms</>
}

client.on("ready", () => {
  reacord.send(channelId, `Testing`)
  reacord.send(channelId, <Uptime />)
})

await client.login(process.env.BOT_TOKEN)
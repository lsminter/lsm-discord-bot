import { Client, Intents } from "discord.js"
import { ReacordDiscordJs, Embed, Button } from "reacord"
import dotenv from 'dotenv'
dotenv.config()

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const reacord = new ReacordDiscordJs(client)
const channelId = process.env.CHANNEL_ID
function Counter() {
  const [count, setCount] = React.useState(0)
  return (
    <>
      <Embed title="Counter">
        This button has been clicked {count} times.
      </Embed>
      <Button onClick={() => setCount(count + 1)}>
        +1
      </Button>
    </>
  )
}

client.on("ready", () => {
  reacord.send(channelId, <Counter />)
})

await client.login(process.env.BOT_TOKEN)
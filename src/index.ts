import { createServer } from 'http'
import app from './app'
import { config } from './config'
import { connectToDatabase } from './databse/database'

async function main() {
  const server = createServer(app.callback())

  await connectToDatabase()

  server.listen(config.PORT, () => {
    console.log(`server running at http://localhost:${config.PORT}`)
  })
}

main()

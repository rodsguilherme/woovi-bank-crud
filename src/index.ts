import app from './app'
import { createServer } from 'http'
import { config } from 'config'
import { connectToDatabase } from './database/database'

const main = async () => {
  const server = createServer(app.callback())

  await connectToDatabase()

  server.listen(config.PORT, () => {
    console.log(`server running at http://localhost:${config.PORT}`)
  })
}

main()

import mongoose from 'mongoose'

export async function connectToDatabase() {
  const mongoURl = process.env.MONGO_URL

  if (!mongoURl) {
    throw new Error('MONGO_URL deve estar definido no .env')
  }

  mongoose.connection.on('close', () =>
    console.log('Database connection closed.')
  )

  mongoose.connection.on('error', (error) =>
    console.log('Database connection error.', error)
  )

  await mongoose.connect(mongoURl, { dbName: 'woovy-db' })

  console.log('database connected')
}

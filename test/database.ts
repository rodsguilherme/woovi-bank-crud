import mongoose, { ConnectOptions } from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'

const mongooseOptions: ConnectOptions = {
  dbName: 'db-test'
}

export const connectDatabase = async (): Promise<typeof mongoose> => {
  dotenv.config({ path: path.resolve(__dirname, '../../.env.test') })

  const MONGO_URL = process.env.MONGO_URL!

  jest.setTimeout(20000)
  return mongoose.connect(MONGO_URL, mongooseOptions)
}

const deleteProperties = <T>(obj: T): void => {
  const objNames = Object.keys(obj as Record<string, unknown>)

  objNames.forEach((itemName) => {
    delete obj[itemName as keyof T]
  })
}

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.connection.db.dropDatabase({ dbName: 'db-test' })
  await mongoose.disconnect()

  mongoose.connections.forEach((connection) => {
    deleteProperties(connection.models)
    deleteProperties(connection.collections)
  })
}

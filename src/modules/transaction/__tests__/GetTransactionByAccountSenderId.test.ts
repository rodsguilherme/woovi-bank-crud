import { graphql, GraphQLError } from 'graphql'
import { schema } from '@/schema/schema'
import { connectDatabase, disconnectDatabase } from '../../../../test/database'
import {
  createTransactionAccount,
  createTransactionFixture
} from '../fixtures/createTransactionFixtures'

describe('TEST GetTransactionByAccountSenderId query', () => {
  beforeAll(connectDatabase)
  afterAll(disconnectDatabase)

  it('should find all transactions by senderId', async () => {
    const account1 = await createTransactionAccount()
    const account2 = await createTransactionAccount()

    await createTransactionFixture(account1.id, account2.id, 100)

    const mutation = `
      query Get($senderId: String!) {
        GetTransactionByAccountSenderId(senderId: $senderId) {
          senderId
          receiverId
          value
        }
      }
      `

    const variableValues = {
      senderId: account1.id
    }

    const result = await graphql({
      schema,
      source: mutation,
      variableValues,
      contextValue: {
        account: account1
      }
    })

    const mutationResult = result?.data?.GetTransactionByAccountSenderId as any

    expect(result.errors).toBeUndefined()
    expect(mutationResult.length).toBe(1)
  })

  it('should throw an error if user is not authenticated', async () => {
    const account = await createTransactionAccount()

    await createTransactionFixture(account.id, account.id, 100)

    const mutation = `
      query Get($senderId: String!) {
        GetTransactionByAccountSenderId(senderId: $senderId) {
          senderId
          receiverId
          value
        }
      }
      `

    const variableValues = {
      senderId: account.id
    }

    const result = await graphql({
      schema,
      source: mutation,
      variableValues
    })

    expect(result.errors).toStrictEqual([new GraphQLError('Não autorizado!')])
  })

  it('should throw an error if user is trying to access another user transactions', async () => {
    const account1 = await createTransactionAccount()
    const account2 = await createTransactionAccount()

    await createTransactionFixture(account1.id, account2.id, 100)

    const mutation = `
      query Get($senderId: String!) {
        GetTransactionByAccountSenderId(senderId: $senderId) {
          senderId
          receiverId
          value
        }
      }
      `

    const variableValues = {
      senderId: account1.id
    }

    const result = await graphql({
      schema,
      source: mutation,
      variableValues,
      contextValue: {
        account: account2
      }
    })

    expect(result.errors).toStrictEqual([new GraphQLError('Não autorizado!')])
  })
})

import { Chance } from 'chance'
import { graphql, GraphQLError } from 'graphql'
import { schema } from '@/schema/schema'
import { connectDatabase, disconnectDatabase } from '../../../../test/database'
import { createTransactionAccount } from '../fixtures/createTransactionFixtures'

describe('CreateTransactionMutation', () => {
  beforeAll(connectDatabase)
  afterAll(disconnectDatabase)

  it('should create a new transaction', async () => {
    const [account1, account2] = await Promise.all([
      createTransactionAccount(800 * 100), // in cents
      createTransactionAccount(500 * 100)
    ])

    const mutation = `
      mutation Post($input: CreateTransactionInput!) {
        CreateTransactionMutation(input: $input) {
          newBalance
        }
      }
      `

    const variableValues = {
      input: {
        senderId: account1.id,
        receiverId: account2.id,
        value: 100
      }
    }

    const result = await graphql({
      schema,
      source: mutation,
      variableValues,
      contextValue: {
        account: account2
      }
    })

    const mutationResult = result?.data?.CreateTransactionMutation as any

    expect(result.errors).toBeUndefined()
    expect(Number(mutationResult.newBalance)).toBe(70000)
  })

  it('should throw an error if user is not authenticated', async () => {
    const [account1, account2] = await Promise.all([
      createTransactionAccount(800 * 100), // in cents
      createTransactionAccount(500 * 100)
    ])

    const mutation = `
      mutation Post($input: CreateTransactionInput!) {
        CreateTransactionMutation(input: $input) {
          newBalance
        }
      }
      `

    const variableValues = {
      input: {
        senderId: account1.id,
        receiverId: account2.id,
        value: 100
      }
    }

    const result = await graphql({
      schema,
      source: mutation,
      variableValues
    })

    expect(result.errors).toStrictEqual([new GraphQLError('Não autorizado!')])
  })

  it('should throw an error if sender and receiver are the same', async () => {
    const account = await createTransactionAccount()

    const mutation = `
        mutation Post($input: CreateTransactionInput!) {
          CreateTransactionMutation(input: $input) {
            newBalance
          }
        }
        `

    const variableValues = {
      input: {
        senderId: account.cpf,
        receiverId: account.cpf,
        value: 1000
      }
    }

    const result = await graphql({
      schema,
      source: mutation,
      variableValues,
      contextValue: {
        account
      }
    })

    expect(result.errors).toStrictEqual([
      new GraphQLError('Não é possível transferir para si mesmo!')
    ])
  })
})

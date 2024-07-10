import { Chance } from 'chance'
import { graphql, GraphQLError } from 'graphql'
import { schema } from '@/schema/schema'
import { connectDatabase, disconnectDatabase } from '../../../test/database'

const chance = new Chance()

describe('TEST RegisterUserMutation mutation', () => {
  beforeAll(connectDatabase)
  afterAll(disconnectDatabase)

  const newAccount = {
    cpf: chance.cpf({ formatted: false }),
    password: 'teste1234'
  }

  it('should create a new account', async () => {
    const mutation = `
      mutation Post($input: CreateInput!) {
        CreateMutation(input: $input) {
          token
          me {
            _id
            cpf
          }
        }
      }
      `

    const variableValues = {
      input: newAccount
    }

    const result = await graphql({
      schema,
      source: mutation,
      variableValues
    })

    expect(result.errors).toBeUndefined()

    const { me, token } = result?.data?.CreateMutation as any

    expect(token).toBeDefined()
    expect(me.cpf).toBe(newAccount.cpf)
  })

  it('should throw an error if the cpf is already created', async () => {
    const mutation = `
      mutation Post($input: CreateInput!) {
        CreateMutation(input: $input) {
          token
          me {
            _id
            cpf
          }
        }
      }
      `

    const variableValues = {
      input: newAccount
    }

    const result = await graphql({
      schema,
      source: mutation,
      variableValues
    })

    expect(result.errors?.[0]).toStrictEqual(
      new GraphQLError('CPF já cadastrado')
    )
  })
})

import { graphql, GraphQLError } from 'graphql'
import { schema } from '@/schema/schema'
import { connectDatabase, disconnectDatabase } from '../../../test/database'
import { createAccount } from '../fixtures/createAccount'

describe('TEST LoginUserMutation mutation', () => {
  beforeAll(connectDatabase)
  afterAll(disconnectDatabase)

  it('should login a user', async () => {
    const account = await createAccount()

    const mutation = `
      mutation Post($input: LoginInput!) {
        LoginMutation(input: $input) {
          token
          me {
            _id
            cpf
          }
        }
      }
      `

    const variableValues = {
      input: {
        cpf: account.cpf,
        password: account.password
      }
    }

    const result = await graphql({
      schema,
      source: mutation,
      variableValues,
      contextValue: { account }
    })

    expect(result.errors).toBeUndefined()

    const { me, token } = result?.data?.LoginMutation as any

    expect(token).toBeDefined()
    expect(me.cpf).toBe(account.cpf)
  })

  it('should throw an error if cpf is incorrect', async () => {
    const account = await createAccount()

    const mutation = `
      mutation Post($input: LoginInput!) {
        LoginMutation(input: $input) {
          token
          me {
            _id
            cpf
          }
        }
      }
      `

    const variableValues = {
      input: {
        cpf: '001.001.001-00',
        password: account.password
      }
    }

    const result = await graphql({
      schema,
      source: mutation,
      variableValues
    })

    expect(result.errors?.[0]).toStrictEqual(
      new GraphQLError('Usuário ou senha incorretos')
    )
  })

  it('should throw an error if password is incorrect', async () => {
    const user = await createAccount()

    const mutation = `
      mutation Post($input: LoginInput!) {
        LoginMutation(input: $input) {
          token
          me {
            _id
            cpf
          }
        }
      }
      `

    const variableValues = {
      input: {
        cpf: user.cpf,
        password: '11111111'
      }
    }

    const result = await graphql({
      schema,
      source: mutation,
      variableValues
    })

    expect(result.errors?.[0]).toStrictEqual(
      new GraphQLError('Usuário ou senha incorretos')
    )
  })
})

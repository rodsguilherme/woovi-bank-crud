import { graphql } from 'graphql'

import { schema } from '@/schema/schema'

import { connectDatabase, disconnectDatabase } from '../../../../test/database'
import { createAccount } from '../fixtures/createAccount'

describe('TEST FindAccountByCpf query', () => {
  beforeAll(connectDatabase)
  afterAll(disconnectDatabase)

  it('should find a account by cpf', async () => {
    const account = await createAccount()

    const mutation = `query Get($cpf: String!) {
        FindAccountByCpf(cpf: $cpf) {
            cpf
            balance
        }
    }`

    const variableValues = { cpf: account.cpf }

    const response = await graphql({
      schema,
      source: mutation,
      variableValues,
      contextValue: { account }
    })

    expect(response.errors).toBeUndefined()

    const responseAccount = response?.data?.FindAccountByCpf as any

    expect(responseAccount.cpf).toBe(account.cpf)
  })
})

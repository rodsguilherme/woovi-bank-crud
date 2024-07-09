import { graphql } from 'graphql'

import { Account } from '../AccountModel'
import { schema } from '@/schema/schema'
import Chance from 'chance'

const chance = new Chance()

export const createAccount = async (args?: Partial<Account>) => {
  const mutation = `
    mutation createAccount($input: CreateInput!) {
        CreateMutation(input: $input) {
            me {
              _id 
              cpf
              password
            }
        }
    }`

  const variableValues = {
    input: {
      cpf: chance.cpf({ formatted: false }),
      password: 'teste123'
    }
  }

  const response = await graphql({
    schema,
    source: mutation,
    variableValues
  })

  const account = response?.data?.CreateMutation as any

  return {
    _id: account?.me?._id,
    cpf: account?.me?.cpf,
    passwordEncrypted: account?.me?.password,
    password: variableValues.input.password
  }
}

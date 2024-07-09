import { graphql } from 'graphql'
import bcrypt from 'bcrypt'
import Chance from 'chance'
import { schema } from '@/schema/schema'
import { AccountModel } from '@/modules/account/AccountModel'

const chance = new Chance()

export async function createTransactionFixture(
  senderId: string,
  receiverId: string,
  value: number
): Promise<string> {
  const mutation = `
    mutation Post($input: CreateTransactionInput!) {
      CreateTransactionMutation(input: $input) {
        balance
      }
    }
  `

  const variableValues = {
    input: {
      senderId,
      receiverId,
      value
    }
  }

  const result = await graphql({
    schema,
    source: mutation,
    variableValues,
    contextValue: {
      account: {
        _id: senderId
      }
    }
  })

  return result.data!.CreateTransactionMutation as any
}

export const createTransactionAccount = async (balance?: number) => {
  const account = new AccountModel({
    cpf: chance.cpf({ formatted: false }),
    balance: balance || 10000,
    password: await bcrypt.hash('1234', 10)
  })

  await account.save()

  return account
}

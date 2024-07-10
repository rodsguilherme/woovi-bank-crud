import bcrypt from 'bcryptjs'
import { GraphQLNonNull, GraphQLString } from 'graphql'
import { mutationWithClientMutationId } from 'graphql-relay'

import { AccountModel } from '../AccountModel'
import { findAccountByCpf, generateToken } from '../AccountService'
import { AccountType } from '../AccountType'

type CreateInput = {
  cpf: string
  password: string
}

export const CreateMutation = mutationWithClientMutationId({
  name: 'Create',
  description: 'Create a new account',
  inputFields: {
    cpf: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) }
  },

  mutateAndGetPayload: async (createInput: CreateInput) => {
    const { cpf, password } = createInput

    const userAlreadyExists = await findAccountByCpf(cpf)

    if (userAlreadyExists) {
      throw new Error('CPF já cadastrado')
    }

    const hash = await bcrypt.hash(password, 10)

    const account = new AccountModel({ cpf, password: hash })

    await account.save()

    const token = generateToken(account.id, account._id)

    return { token, account }
  },
  outputFields: {
    token: {
      type: GraphQLString,
      resolve: ({ token }: any) => token
    },
    me: {
      type: AccountType,
      resolve: ({ account }) => account
    }
  }
})

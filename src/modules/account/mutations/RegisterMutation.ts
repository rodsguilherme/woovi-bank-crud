import bcrypt from 'bcrypt'
import { GraphQLNonNull, GraphQLString } from 'graphql'
import { mutationWithClientMutationId } from 'graphql-relay'

import { AccountModel } from '../AccountModel'
import { findAccountByCpf, generateToken } from '../AccountService'

type RegisterInput = {
  cpf: string
  pixKey: string
  password: string
}

export const RegisterMutation = mutationWithClientMutationId({
  name: 'Register',
  description: 'Register a new account',
  inputFields: {
    cpf: { type: new GraphQLNonNull(GraphQLString) },
    pixKey: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) }
  },

  mutateAndGetPayload: async (registerInput: RegisterInput) => {
    const { cpf, pixKey, password } = registerInput

    const userAlreadyExists = await findAccountByCpf(cpf)

    if (userAlreadyExists) {
      throw new Error('Cpf já registrado')
    }

    const hash = await bcrypt.hash(password, 10)

    const account = new AccountModel({ cpf, pixKey, password: hash })

    await account.save()

    const token = generateToken(account.id, account._id)

    return { token, account }
  },
  outputFields: {
    token: {
      type: GraphQLString,
      resolve: ({ token }: any) => token
    }
  }
})

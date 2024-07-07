import { GraphQLNonNull, GraphQLString } from 'graphql'
import { mutationWithClientMutationId } from 'graphql-relay'
import { AccountModel } from '../AccountModel'
import { generateToken } from '../AccountService'

import bcrypt from 'bcrypt'

type LoginInputType = {
  cpf: string
  password: string
}

export const LoginMutation = mutationWithClientMutationId({
  name: 'Login',
  description: 'Login an account',
  inputFields: {
    cpf: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) }
  },
  mutateAndGetPayload: async (loginInput: LoginInputType) => {
    const { cpf, password } = loginInput

    const account = await AccountModel.findOne({ cpf })

    if (!account) {
      throw Error('Cpf ou senha inválidos')
    }

    const passwordIsValid = await bcrypt.compare(password, account.password)

    if (!passwordIsValid) {
      throw Error('Cpf ou senha inválidos')
    }

    const token = generateToken(account.id, account._id)

    return { token }
  },
  outputFields: {
    token: {
      type: GraphQLString,
      resolve: ({ token }: any) => token
    }
  }
})

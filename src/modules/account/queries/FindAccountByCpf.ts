import { GraphQLFieldConfig, GraphQLNonNull, GraphQLString } from 'graphql'

import { AccountType } from '../AccountType'
import { findAccountByCpf } from '../AccountService'

export const FindAccountByCpf: GraphQLFieldConfig<any, any, any> = {
  description: 'Find an account',
  type: AccountType,
  args: {
    cpf: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve: async (_, args, context) => {
    if (!context?.account || args?.cpf !== context?.account?.cpf?.toString()) {
      throw new Error('Não autorizado!')
    }

    return findAccountByCpf(args.cpf)
  }
}

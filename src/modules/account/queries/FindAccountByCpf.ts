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
    console.log(context)
    if (!context?.user || args?.cpf !== context?.account?.cpf?.toString()) {
      throw new Error('Não autorizado!')
    }

    return findAccountByCpf(args.cpf)
  }
}

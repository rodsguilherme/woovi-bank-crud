import { GraphQLFieldConfig, GraphQLNonNull, GraphQLString } from 'graphql'

import { TransactionModel } from '../TransactionModel'
import { TransactionsListType } from '../TransactionType'

export const GetTranscationByAccount: GraphQLFieldConfig<any, any, any> = {
  description: 'Find all transactions by senderId',
  type: TransactionsListType,
  args: {
    cpf: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve: async (_, args, context) => {
    if (!context?.account || args?.cpf !== context?.account?.cpf) {
      throw new Error('Não autorizado!')
    }

    const transactions = await TransactionModel.aggregate([
      {
        $lookup: {
          from: 'accounts',
          localField: 'senderId',
          foreignField: 'id',
          as: 'account'
        }
      }
    ])

    return transactions
  }
}

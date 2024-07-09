import { GraphQLFieldConfig, GraphQLNonNull, GraphQLString } from 'graphql'

import { TransactionModel } from '../TransactionModel'
import { TransactionsListType } from '../TransactionType'

export const GetTransactionByAccountSenderId: GraphQLFieldConfig<
  any,
  any,
  any
> = {
  description: 'Find all transactions by senderId',
  type: TransactionsListType,
  args: {
    senderId: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve: async (_, args, context) => {
    if (!context?.account || args?.senderId !== context?.account?.id) {
      throw new Error('Não autorizado!')
    }

    const transactions = await TransactionModel.find({
      senderId: args.senderId
    })

    return transactions
  }
}

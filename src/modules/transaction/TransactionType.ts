import {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} from 'graphql'

import { Transaction } from './TransactionModel'

export const TransactionType = new GraphQLObjectType<Transaction>({
  name: 'Transaction',
  fields: () => ({
    _id: {
      type: GraphQLString,
      resolve: (transaction) => transaction._id.toString()
    },
    senderId: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (transaction) => transaction.senderId
    },
    receiverId: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (transaction) => transaction.receiverId
    },
    value: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: (transaction) => transaction.value
    }
  })
})

export const TransactionsListType = new GraphQLList(TransactionType)

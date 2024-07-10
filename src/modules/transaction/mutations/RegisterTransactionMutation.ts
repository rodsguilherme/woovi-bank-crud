import { mutationWithClientMutationId } from 'graphql-relay'
import { GraphQLString, GraphQLNonNull, GraphQLFloat } from 'graphql'
import { createTransaction } from '../TransactionService'

type TransactionInput = {
  senderId: string
  receiverId: string
  value: number
}

export const CreateTransactionMutation = mutationWithClientMutationId({
  name: 'CreateTransaction',
  description: 'Creates a new transaction',
  inputFields: {
    senderId: { type: new GraphQLNonNull(GraphQLString) },
    receiverId: { type: new GraphQLNonNull(GraphQLString) },
    value: { type: new GraphQLNonNull(GraphQLFloat) }
  },

  mutateAndGetPayload: async (
    { senderId, receiverId, value }: TransactionInput,
    context
  ) => {
    if (!context?.account) {
      throw new Error('Não autorizado!')
    }

    if (senderId === receiverId) {
      throw new Error('Não é possível transferir para si mesmo!')
    }

    const newBalance = await createTransaction(senderId, receiverId, value)

    return {
      message: 'Valor transferido',
      receiverId,
      senderId,
      value,
      newBalance
    }
  },

  outputFields: {
    message: {
      type: GraphQLString,
      resolve: ({ message }: any) => message
    },
    receiverId: {
      type: GraphQLString,
      resolve: ({ receiverId }: any) => receiverId
    },
    senderId: {
      type: GraphQLString,
      resolve: ({ senderId }: any) => senderId
    },
    value: {
      type: GraphQLString,
      resolve: ({ value }: any) => value
    },
    newBalance: {
      type: GraphQLString,
      resolve: ({ newBalance }: any) => newBalance
    }
  }
})

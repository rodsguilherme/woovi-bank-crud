import { GraphQLObjectType } from 'graphql'

import * as accountQueries from '../modules/account/queries'
import * as transactionQueries from '../modules/transaction/queries'

export const QueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'The root all queries',
  fields: () => ({
    ...accountQueries,
    ...transactionQueries
  })
})

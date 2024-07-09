import {
  GraphQLEnumType,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString
} from 'graphql'

import { Account } from './AccountModel'

const EntryTypeEnum = new GraphQLEnumType({
  name: 'EntryType',
  values: {
    revenue: { value: 'revenue' },
    expense: { value: 'expense' }
  }
})

const LedgerEntryType = new GraphQLObjectType({
  name: 'LedgerEntry',
  fields: {
    value: { type: GraphQLInt },
    date: { type: GraphQLString },
    type: { type: EntryTypeEnum }
  }
})

const LedgerType = new GraphQLList(LedgerEntryType)

export const AccountType = new GraphQLObjectType<Account>({
  name: 'Account',
  description: 'Represents a account',
  fields: () => ({
    _id: { type: GraphQLString, resolve: (account) => account._id.toString() },
    cpf: { type: GraphQLString, resolve: (account) => account.cpf.toString() },
    password: {
      type: GraphQLString,
      resolve: (account) => account.password.toString()
    },
    balance: { type: GraphQLInt, resolve: (account) => account.balance },
    ledger: { type: LedgerType, resolve: (account) => account.ledger }
  })
})

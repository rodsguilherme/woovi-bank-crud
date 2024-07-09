import mongoose, { Schema, Document } from 'mongoose'

export type Ledger = Array<{
  value: number
  date: string
  type: 'revenue' | 'expense'
}>

export interface Account {
  id: string
  _id: string
  cpf: string
  password: string
  balance: number
  ledger: Ledger
}

export interface AccountDocumentInterface extends Account, Document {
  id: string
  _id: string
  hashPassword(password: string): Promise<string>
  comparePasswords(
    candidatePassword: string,
    hashedPassword: string
  ): Promise<boolean>
}

const AccountSchema = new Schema({
  cpf: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password must have at least 8 characters']
  },
  ledger: {
    type: Array,
    default: []
  },
  balance: {
    type: Number,
    default: 0
  }
})

AccountSchema.index({ cpf: 1 })

export const AccountModel = mongoose.model<AccountDocumentInterface>(
  'Account',
  AccountSchema
)

import mongoose, { Schema, Document } from 'mongoose'

export interface Transaction {
  id: string
  _id: string
  receiverId: string
  senderId: string
  value: number
}

const TransactionSchema = new Schema({
  senderId: {
    type: String,
    required: true
  },
  receiverId: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  }
})

TransactionSchema.index({ senderId: 1, receiverId: 1 })

export const TransactionModel = mongoose.model<Transaction>(
  'Transaction',
  TransactionSchema
)

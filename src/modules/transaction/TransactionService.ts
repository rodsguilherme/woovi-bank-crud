import mongoose from 'mongoose'

import { TransactionModel } from './TransactionModel'
import { AccountModel } from '../account/AccountModel'

type TransactionInputType = {
  senderId: string
  receiverId: string
  value: number
}

export const createTransaction = async (
  senderId: string,
  receiverId: string,
  value: number
) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  const receiver = await AccountModel.findById(receiverId)

  if (!receiver) {
    throw new Error('Conta não encontrada')
  }

  const centsValue = value

  try {
    const transaction = new TransactionModel({
      senderId,
      receiverId,
      value
    })

    await Promise.all([
      AccountModel.updateOne(
        { id: senderId },
        {
          $push: {
            ledger: { value: centsValue, date: new Date(), type: 'expense' }
          }
        },
        { session }
      ),
      AccountModel.updateOne(
        { id: receiverId },
        {
          $push: {
            ledger: { value: centsValue, date: new Date(), type: 'revenue' }
          }
        },
        { session }
      )
    ])

    await transaction.save({ session })

    await session.commitTransaction()

    return transaction
  } catch (error) {
    await session.abortTransaction()
    throw error
  } finally {
    await session.endSession()
  }
}

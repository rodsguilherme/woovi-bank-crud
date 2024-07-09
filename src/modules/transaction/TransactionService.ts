import mongoose from 'mongoose'

import { TransactionModel } from './TransactionModel'
import { AccountModel } from '../account/AccountModel'

const convertValueToCents = (value: number): number => {
  const cents = value * 100
  return Math.round(cents)
}

export const createTransaction = async (
  senderId: string,
  receiverId: string,
  value: number
): Promise<number> => {
  const session = await mongoose.startSession()
  session.startTransaction()

  const receiver = await AccountModel.findById(receiverId)

  if (!receiver) {
    throw new Error('Conta não encontrada')
  }

  const valueInCents = convertValueToCents(value)

  try {
    const transaction = new TransactionModel({
      senderId,
      receiverId,
      value: valueInCents
    })

    const senderAccount = await AccountModel.findByIdAndUpdate(
      { _id: new mongoose.Types.ObjectId(senderId) },
      {
        $push: {
          ledger: { value: valueInCents, date: new Date(), type: 'expense' }
        },
        $inc: {
          balance: -valueInCents
        }
      },
      { session }
    )

    await AccountModel.updateOne(
      { _id: new mongoose.Types.ObjectId(receiverId) },
      {
        $push: {
          ledger: { value: valueInCents, date: new Date(), type: 'revenue' }
        },
        $inc: {
          balance: valueInCents
        }
      },
      { session }
    )

    await transaction.save({ session })

    if (!senderAccount) {
      throw new Error('Saldo não foi atualizado')
    }

    await session.commitTransaction()

    return senderAccount.balance
  } catch (error) {
    await session.abortTransaction()
    throw error
  } finally {
    await session.endSession()
  }
}

import jwt from 'jsonwebtoken'
import { AccountModel } from './AccountModel'
import { config } from '../../config'

export const generateToken = (accountId: string, _id: string) =>
  jwt.sign({ accountId, _id }, '123')

export const findAccountByCpf = (cpf: string) => AccountModel.findOne({ cpf })

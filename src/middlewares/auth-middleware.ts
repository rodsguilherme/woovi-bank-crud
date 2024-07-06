import { AccountModel } from '@/modules/account/AccountModel'
import { verifyToken } from '@/utils/jwt'

export const getAccountFromToken = async (authorization?: string | null) => {
  if (!authorization) {
    throw new Error('Token inválido')
  }

  const decoded = await verifyToken(authorization)

  console.log({ decoded })
  const account = await AccountModel.findById({ id: decoded.id })

  return account
}

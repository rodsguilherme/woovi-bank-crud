import { AccountModel } from '@/modules/account/AccountModel'
import { verifyToken } from '@/utils/jwt'

export const getAccountFromToken = async (authorization?: string | null) => {
  if (!authorization) {
    return null
  }

  const decoded = await verifyToken(authorization)

  const account = await AccountModel.findById({ id: decoded.id })

  if (!account) {
    return null
  }

  return account
}

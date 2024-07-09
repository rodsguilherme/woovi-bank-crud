import { AccountModel } from '@/modules/account/AccountModel'
import { verifyToken } from '@/utils/jwt'

export const getAccountFromToken = async (authorization?: string | null) => {
  if (!authorization) {
    return null
  }

  const [bearer, token] = authorization.split(' ')

  const decoded = await verifyToken(token)

  const account = await AccountModel.findById(decoded.accountId)

  if (!account) {
    return null
  }

  return account
}

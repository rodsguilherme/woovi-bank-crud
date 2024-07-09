import { verify } from 'jsonwebtoken'
import { config } from '@/config'

export const verifyToken = (token?: string | undefined): Promise<any> =>
  new Promise((resolve, reject) => {
    if (!token) {
      return reject('Token inválido')
    }

    return verify(token, config.SECRET_TOKEN, (err, decoded) => {
      if (!err) return resolve(decoded)

      return reject(err)
    })
  })

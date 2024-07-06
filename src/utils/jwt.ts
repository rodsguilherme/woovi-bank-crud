import { JwtPayload, verify } from 'jsonwebtoken'
import { config } from '@/config'

export const verifyToken = (token: string): Promise<any> =>
  new Promise((resolve, reject) =>
    verify(token, config.SECRET_TOKEN, (err, decoded) => {
      if (!err) return resolve(decoded)

      return reject(err)
    })
  )

import 'dotenv/config'

export const config = {
  PORT: process.env.PORT || 5566,
  NODE_ENV: process.env.NODE_ENV,
  SECRET_TOKEN: process.env.SECRET_TOKEN || 'secretkey'
}

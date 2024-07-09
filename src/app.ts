import cors from 'kcors'
import Koa, { Request } from 'koa'
import bodyParser from 'koa-bodyparser'
import { graphqlHTTP, OptionsData } from 'koa-graphql'
import logger from 'koa-logger'
import Router from 'koa-router'

import { schema } from './schema/schema'
import { getAccountFromToken } from './middlewares/auth-middleware'

const app = new Koa()

app.use(cors({ origin: '*' }))
app.use(logger())
app.use(
  bodyParser({
    onerror(err, ctx) {
      ctx.throw(err, 422)
    }
  })
)

const routes = new Router()

const graphQlSettingsPerReq = async (req: Request): Promise<OptionsData> => {
  const account = await getAccountFromToken(req.header.authorization)

  return {
    graphiql: {
      headerEditorEnabled: true,
      shouldPersistHeaders: true
    },
    schema,
    pretty: true,
    context: { account }
  }
}

const graphQlServer = graphqlHTTP(graphQlSettingsPerReq)
routes.all('/graphql', graphQlServer)

app.use(routes.routes())
app.use(routes.allowedMethods())

export default app

import 'reflect-metadata'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import Redis from 'ioredis'
import session from 'express-session'
import connectRedis from 'connect-redis'
import cors from 'cors'
import { createConnection } from 'typeorm'
import path from 'path'

import { __prod__, COOKIE_NAME } from './constants'
import { HelloResolver } from './resolvers/hello'
import { PostResolver } from './resolvers/post'
import { UserResolver } from './resolvers/user'
import { User } from './entities/User'
import { Post } from './entities/Post'

// rerun
const main = async () => {
  const conn = await createConnection({
    type: 'postgres',
    database: 'lireddit2',
    username: 'postgres',
    password: 'neto',
    logging: true,
    synchronize: true,
    migrations: [path.join(__dirname, './migrations/*')],
    entities: [User, Post],
  })

  await conn.runMigrations()

  const app = express()

  const RedisStore = connectRedis(session)
  const redis = new Redis()

  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  )

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 yrs,
        httpOnly: true,
        sameSite: 'lax', // csrf
        secure: false, // cookie only works in https
      },
      saveUninitialized: false,
      secret: 'uahsudahsm,dapiujhaviknqohuwbfqwf',
      resave: false,
    })
  )

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ req, res, redis }),
  })

  apolloServer.applyMiddleware({
    app,
    cors: {
      origin: false,
    },
  })

  app.listen(4000, () => {
    console.log('server started on http://localhost:4000')
  })
}

main().catch((err) => {
  console.error(err)
})

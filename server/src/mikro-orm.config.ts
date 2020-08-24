import { MikroORM } from '@mikro-orm/core'
import path from 'path'

import { __prod__ } from './constants'
import { Post } from './entities/Post'
import { User } from './entities/User'

export default {
  entities: [Post, User],
  migrations: {
    path: path.join(__dirname, './migrations'),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  dbName: 'lireddit',
  user: 'postgres',
  password: 'neto',
  type: 'postgresql',
  debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0]

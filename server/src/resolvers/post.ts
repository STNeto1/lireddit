import {
  Resolver,
  Query,
  Arg,
  Mutation,
  InputType,
  Field,
  Ctx,
  UseMiddleware,
  Int,
} from 'type-graphql'

import { Post } from '../entities/Post'
import { getConnection } from 'typeorm'
import { MyContext } from '../types'
import { isAuth } from '../middleware/isAuth'

@InputType()
class PostInput {
  @Field()
  title: string

  @Field()
  text: string
}

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null
  ): Promise<Post[] | undefined> {
    const realLimit = Math.min(50, limit)

    const qb = getConnection()
      .getRepository(Post)
      .createQueryBuilder('p')
      .orderBy('"createdAt"', 'DESC')
      .take(realLimit)

    if (cursor) {
      qb.where('"createdAt" < :cursor', { cursor: new Date(parseInt(cursor)) })
    }

    return qb.getMany()
  }

  @Query(() => Post, { nullable: true })
  post(@Arg('id') id: number): Promise<Post | undefined> {
    return Post.findOne(id)
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg('input') input: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    // const _post = Post.create({ title }).save()

    const result = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Post)
      .values({ ...input, creatorId: req.session.userId })
      .returning('*')
      .execute()

    return result.raw[0]
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg('id') id: number,
    @Arg('title', () => String, { nullable: true }) title: string
  ): Promise<Post | null> {
    const post = await Post.findOne(id)
    if (!post) {
      return null
    }
    if (typeof title !== 'undefined') {
      post.title = title
      await Post.update({ id }, { title })
    }
    return post
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg('id') id: number): Promise<boolean> {
    await Post.delete(id)
    return true
  }
}

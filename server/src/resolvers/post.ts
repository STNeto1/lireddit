import { Resolver, Query, Arg, Mutation } from 'type-graphql'

import { Post } from '../entities/Post'
import { getConnection } from 'typeorm'

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(): Promise<Post[] | undefined> {
    return Post.find()
  }

  @Query(() => Post, { nullable: true })
  post(@Arg('id') id: number): Promise<Post | undefined> {
    return Post.findOne(id)
  }

  @Mutation(() => Post)
  async createPost(@Arg('title') title: string): Promise<Post> {
    // const _post = Post.create({ title }).save()

    const result = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Post)
      .values({ title })
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

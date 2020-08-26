import { ObjectType, Field, Int } from 'type-graphql'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm'
@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number

  @Field(() => String)
  @Column()
  title!: string

  @Field(() => String)
  @CreateDateColumn({ default: new Date() })
  createdAt = Date

  @Field(() => String)
  @UpdateDateColumn({ default: new Date() })
  updatedAt = Date
}

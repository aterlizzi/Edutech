import { UserData } from "./User";
import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@ObjectType()
@Entity()
export class Ideas extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => UserData)
  @ManyToOne(() => UserData, (user) => user.ideas, { cascade: true })
  author: UserData;

  @Field(() => String)
  @Column()
  content: string;

  @Field(() => String)
  @Column()
  usecase: string;

  @Field(() => String)
  @Column()
  prompt: string;
}

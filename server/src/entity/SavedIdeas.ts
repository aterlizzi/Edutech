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
export class SavedIdeas extends BaseEntity {
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
  @ManyToOne(() => UserData, (user) => user.savedIdeas, {
    onDelete: "SET NULL",
  })
  saver: UserData;

  @Field(() => String)
  @Column()
  content: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  title: string;

  @Field(() => String)
  @Column()
  usecase: string;

  @Field(() => String)
  @Column()
  prompt: string;
}

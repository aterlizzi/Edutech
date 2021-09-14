import { UserData } from "./User";
import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@ObjectType()
@Entity()
export class Essay extends BaseEntity {
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
  @OneToOne(() => UserData, (user) => user.presets)
  user: UserData;

  @Field(() => String)
  @Column({ default: "" })
  presetOne: string;

  @Field(() => String)
  @Column({ default: "" })
  presetTwo: string;

  @Field(() => String)
  @Column({ default: "" })
  presetThree: string;

  @Field(() => String)
  @Column({ default: "" })
  presetFour: string;
}

import { College } from "./College";
import { UserData } from "./User";
import { Field, ID, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@ObjectType()
@Entity()
export class Application extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => UserData, { nullable: true })
  @ManyToOne(() => UserData, (user) => user.applications, {
    nullable: true,
    onDelete: "SET NULL",
  })
  author: UserData | null;

  @Field(() => [UserData])
  @ManyToMany(() => UserData, (user) => user.fApplications, {
    onDelete: "CASCADE",
  })
  fUsers: UserData[];

  @Field(() => [UserData])
  @ManyToMany(() => UserData, (user) => user.recentApps, {
    onDelete: "CASCADE",
  })
  recentViewers: UserData[];

  @Field(() => Int)
  @Column({ default: 0 })
  fUsersCount: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  authorId: string;

  @Field(() => String)
  @Column({ nullable: true })
  gpaScore: string;

  @Field(() => String)
  @Column()
  gpaScoreType: string;

  @Field(() => String)
  @Column()
  graduationDate: string;

  @Field(() => String)
  @Column()
  classRank: string;

  @Field(() => String)
  @Column()
  classRankType: string;

  @Field(() => [String])
  @Column("text", { array: true })
  honorArr: string[];

  @Field(() => [String])
  @Column("text", { array: true })
  satScore: string[];

  @Field(() => [Number])
  @Column("int", { array: true })
  apScores: number[];

  @Field(() => [String])
  @Column("text", { array: true })
  apSubjects: string[];

  @Field(() => [String])
  @Column("text", { array: true })
  activities: string[];

  @Field(() => String)
  @Column()
  writing: string;

  @Field(() => String)
  @Column()
  essayPrompt: string;

  @Field(() => String)
  @Column()
  additionalInfo: string;

  @Column()
  specialKey: string;

  @Column({ default: false })
  confirmed: boolean;

  @Field(() => [College], { nullable: true })
  @ManyToMany(() => College, (college) => college.acceptedApps, {
    onDelete: "CASCADE",
    nullable: true,
  })
  acceptedColleges: College[];

  @Field(() => [College], { nullable: true })
  @ManyToMany(() => College, (college) => college.rejectedApps, {
    onDelete: "CASCADE",
    nullable: true,
  })
  rejectedColleges: College[];

  @Field(() => [College], { nullable: true })
  @ManyToMany(() => College, (college) => college.waitlistedApps, {
    onDelete: "CASCADE",
    nullable: true,
  })
  waitlistedColleges: College[];

  @Field(() => [UserData], { nullable: true })
  @ManyToMany(() => UserData, (user) => user.viewed, {
    nullable: true,
    onDelete: "CASCADE",
    cascade: true,
  })
  @JoinTable()
  viewers: UserData[];

  @Field(() => Int)
  @Column({ default: 0 })
  viewCount: number;
}

import { SavedIdeas } from "./SavedIdeas";
import { Application } from "./Application";
import { Field, ID, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Ideas } from "./Ideas";

@ObjectType()
@Entity()
export class UserData extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field()
  @Column({ unique: true })
  email!: string;

  @Field(() => String, { nullable: true })
  @Column({ default: "", nullable: true })
  tempEmail: string;

  @Field()
  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column("bool", { default: false })
  confirmed: boolean;

  @Field(() => String)
  @Column({ default: "" })
  ip_address: string;

  @Field(() => String)
  @Column({ unique: true })
  referralCode: string;

  @Field(() => String)
  @Column({ default: "" })
  referredCode: string;

  @Field(() => UserData, { nullable: true })
  @OneToMany(() => UserData, (user) => user.referred, { cascade: true })
  referrer: UserData | null;

  @Field(() => [UserData])
  @ManyToOne(() => UserData, (user) => user.referrer)
  referred: UserData[];

  @Field(() => Boolean)
  @Column("bool", { default: false })
  subscriber: boolean;

  @Field(() => String)
  @Column({ default: null })
  orderId: string;

  @Field(() => String)
  @Column({ default: "" })
  subKey: string;

  @Field(() => String)
  @Column({ default: "" })
  custKey: string;

  @Field(() => String)
  @Column({ default: "Free" })
  tier: string;

  @Field(() => Number)
  @Column({ default: Date.now(), type: "bigint" })
  current_period_end: number;

  @Field(() => [SavedIdeas])
  @OneToMany(() => SavedIdeas, (idea) => idea.saver, {
    cascade: true,
  })
  savedIdeas: SavedIdeas[];

  @Field(() => [Ideas])
  @OneToMany(() => Ideas, (idea) => idea.author)
  ideas: Ideas[];

  @Field(() => Int)
  @Column({ default: 0 })
  totalIdeasRequested: number;

  @Column("bool", { default: false })
  hasUploaded: boolean;

  @Field(() => [Application], { nullable: true })
  @ManyToMany(() => Application, (application) => application.viewers, {
    nullable: true,
    onDelete: "CASCADE",
  })
  viewed: Application[];

  @Field(() => [Application], { nullable: true })
  @OneToMany(() => Application, (application) => application.author, {
    nullable: true,
  })
  applications: Application[];

  @Field(() => [Application])
  @ManyToMany(() => Application, (application) => application.fUsers, {
    cascade: true,
  })
  @JoinTable()
  fApplications: Application[];

  @Field(() => [Application])
  @ManyToMany(() => Application, (application) => application.recentViewers, {
    cascade: true,
  })
  @JoinTable()
  recentApps: Application[];
}

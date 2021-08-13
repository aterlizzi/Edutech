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

  @Field(() => [Ideas])
  @OneToMany(() => Ideas, (idea) => idea.author)
  ideas: Ideas[];

  @Field(() => [Application])
  @ManyToMany(() => Application, (application) => application.recentViewers, {
    cascade: true,
  })
  @JoinTable()
  recentApps: Application[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field()
  @Column({ unique: true })
  email!: string;

  @Field()
  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column("bool", { default: false })
  confirmed: boolean;

  @Field(() => Boolean)
  @Column("bool", { default: false })
  subscriber: boolean;

  @Column("bool", { default: false })
  hasUploaded: boolean;

  @Field(() => String)
  @Column({ default: "" })
  subKey: string;

  @Field(() => String)
  @Column({ default: "" })
  custKey: string;

  @Field(() => String)
  @Column({ default: null })
  orderId: string;

  @Field(() => Int)
  @Column({ default: 0 })
  totalIdeasRequested: number;

  @Field(() => Number, { nullable: true })
  @Column({ default: null, nullable: true, type: "bigint" })
  cooldown: number;

  @Field(() => [Application], { nullable: true })
  @ManyToMany(() => Application, (application) => application.viewers, {
    nullable: true,
    onDelete: "CASCADE",
  })
  viewed: Application[];

  @Field(() => [SavedIdeas])
  @OneToMany(() => SavedIdeas, (idea) => idea.saver, {
    cascade: true,
  })
  savedIdeas: SavedIdeas[];

  @Field(() => String, { nullable: true })
  @Column({ default: "", nullable: true })
  tempEmail: string;

  @Field(() => String)
  @Column({ unique: true })
  referralCode: string;

  @Field(() => String)
  @Column({ default: "Free" })
  tier: string;

  @Field(() => String)
  @Column({ default: "" })
  ip_address: string;
}

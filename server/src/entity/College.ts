import { Application } from "./Application";
import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@ObjectType()
@Entity()
export class College extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => String)
  @Column()
  college: string;

  @Field(() => [Application])
  @ManyToMany(
    () => Application,
    (application) => application.acceptedColleges,
    { onDelete: "SET NULL", cascade: true }
  )
  @JoinTable()
  acceptedApps: Application[];

  @Field(() => [Application])
  @ManyToMany(
    () => Application,
    (application) => application.rejectedColleges,
    { onDelete: "SET NULL", cascade: true }
  )
  @JoinTable()
  rejectedApps: Application[];

  @Field(() => [Application])
  @ManyToMany(
    () => Application,
    (application) => application.waitlistedColleges,
    { onDelete: "SET NULL", cascade: true }
  )
  @JoinTable()
  waitlistedApps: Application[];
}

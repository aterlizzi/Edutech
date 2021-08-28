import { Field, InputType } from "type-graphql";
import { IsEmail, Length } from "class-validator";

@InputType()
export class sendContactEmailInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @Length(1, 255)
  firstName: string;

  @Field()
  @Length(1, 255)
  lastName: string;

  @Field()
  content: string;

  @Field()
  subject: string;
}

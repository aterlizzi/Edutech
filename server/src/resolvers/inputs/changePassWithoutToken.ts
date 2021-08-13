import { Field, InputType } from "type-graphql";
import { Length } from "class-validator";

@InputType()
export class changePassWithoutTokenInput {
  @Field()
  @Length(8, 255)
  oldPassword: string;

  @Field()
  @Length(8, 255)
  newPassword: string;
}

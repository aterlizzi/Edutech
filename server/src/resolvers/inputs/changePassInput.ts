import { Field, InputType } from "type-graphql";
import { UserData } from "src/entity/User";
import { Length } from "class-validator";

@InputType()
export class changePassInput implements Partial<UserData> {
  @Field()
  token: string;

  @Field()
  @Length(8, 255)
  password: string;
}

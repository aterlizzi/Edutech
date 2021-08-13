import { Field, InputType } from "type-graphql";
import { UserData } from "src/entity/User";
import { IsEmail, Length } from "class-validator";
import { IsUserAlreadyExist } from "../validators/isUserAlreadyExist";
import { IsUsernameAlreadyExist } from "../validators/isUsernameAlreadyExist";

@InputType()
export class createUserInput implements Partial<UserData> {
  @Field()
  @Length(1, 255)
  @IsUserAlreadyExist({ message: "User with that email already exists." })
  @IsEmail(
    {},
    { message: "Your email is invalid, please enter a valid email." }
  )
  email: string;

  @Field()
  @Length(1, 255)
  @IsUsernameAlreadyExist({
    message: "User with that username already exists.",
  })
  username: string;

  @Field()
  @Length(8, 255, { message: "Password must be 8 characters or more." })
  password: string;
}

import { Arg, Mutation, Resolver } from "type-graphql";
import { sendQuestionMail } from "../utils/sendQuestionEmail";

@Resolver()
export class sendEmailResolver {
  @Mutation(() => Boolean, { nullable: true })
  async sendQuestionEmail(@Arg("email") email: string): Promise<boolean> {
    await sendQuestionMail(email);
    return true;
  }
}

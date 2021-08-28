import { sendContactEmailInput } from "./inputs/sendContactEmailInput";
import { Arg, Mutation, Resolver } from "type-graphql";
import { sendContactMail } from "../utils/sendContactEmail";

@Resolver()
export class sendContactEmailResolver {
  @Mutation(() => Boolean, { nullable: true })
  async sendContactEmail(
    @Arg("options")
    { content, subject, firstName, lastName, email }: sendContactEmailInput
  ): Promise<boolean> {
    await sendContactMail(email, firstName, lastName, subject, content);
    return true;
  }
}

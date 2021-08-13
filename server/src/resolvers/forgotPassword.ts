import { MyContext } from "./../types/MyContext";
import { forgotPasswordPrefix } from "./../constants/redisPrefixes";
import { UserData } from "../entity/User";
import { v4 } from "uuid";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { sendMail } from "../utils/sendEmail";
import { redis } from "../redis";

@Resolver()
export class ForgotPasswordResolver {
  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() ctx: MyContext
  ): Promise<boolean> {
    const user = await UserData.findOne({ where: { email } });
    if (!user) return true;
    const token = v4();
    await redis.set(forgotPasswordPrefix + token, user.id, "ex", 60 * 60 * 24);
    await sendMail(
      email,
      `http://localhost:3000/user/change-password/${token}`
    );
    ctx.req.session.userId = user.id;
    return true;
  }
}

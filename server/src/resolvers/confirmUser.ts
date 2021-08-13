import { MyContext } from "./../types/MyContext";
import { confirmationPrefix } from "./../constants/redisPrefixes";
import { createConfirmationUrl } from "../utils/createConfirmationUrl";
import { UserData } from "./../entity/User";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { redis } from "../redis";
import { sendMail } from "../utils/sendEmail";
import { v4 } from "uuid";

@Resolver()
export class ConfirmUserResolver {
  @Mutation(() => Boolean)
  async confirmUser(
    @Arg("token") token: string,
    @Ctx() ctx: MyContext
  ): Promise<boolean> {
    const userId = await redis.get(confirmationPrefix + token);
    if (!userId) return false;
    await UserData.update({ id: parseInt(userId, 10) }, { confirmed: true });
    await redis.del(confirmationPrefix + token);
    ctx.req.session.userId = userId;
    ctx.res.cookie("vid", v4(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
    });
    return true;
  }
  @Mutation(() => Boolean)
  async sendConfirmation(@Arg("email") email: string): Promise<boolean> {
    const user = await UserData.findOne({ where: { email } });
    if (!user || user.confirmed) return true;
    await sendMail(email, await createConfirmationUrl(user.id));
    return true;
  }
}

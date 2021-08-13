import { resetPasswordPrefix } from "./../constants/redisPrefixes";
import { redis } from "./../redis";
import { MyContext } from "./../types/MyContext";
import { UserData } from "../entity/User";
import { Ctx, Mutation, Resolver } from "type-graphql";
import { v4 } from "uuid";
import { sendChangePassMail } from "../utils/sendChangePasswordEmail";

@Resolver()
export class ChangePasswordEmailResolver {
  @Mutation(() => Boolean, { nullable: true })
  async changePasswordEmail(@Ctx() ctx: MyContext): Promise<boolean> {
    const user = await UserData.findOne(ctx.req.session.userId);
    if (!user) return false;
    const username = user.username;
    const email = user.email;
    const TOKEN = v4();
    await redis.set(resetPasswordPrefix + TOKEN, user.id, "ex", 60 * 60 * 24);
    const url = `http://localhost:3000/user/${TOKEN}`;
    await sendChangePassMail(email, username, url);
    return true;
  }
}

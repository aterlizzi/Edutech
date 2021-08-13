import argon2 from "argon2";
import { MyContext } from "./../types/MyContext";
import { UserData } from "../entity/User";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { redis } from "../redis";
import { v4 } from "uuid";
import { resetEmailPrefix } from "../constants/redisPrefixes";
import { sendChangeEmailMail } from "../utils/sendChangeEmailEmail";

@Resolver()
export class ChangeEmailResolver {
  @Mutation(() => Boolean)
  async changeEmail(
    @Arg("newEmail") newEmail: string,
    @Arg("confirmPass") confirmPass: string,
    @Ctx() ctx: MyContext
  ): Promise<boolean> {
    const user = await UserData.findOne(ctx.req.session.userId);
    if (!user) return false;
    const tempUser = await UserData.findOne({ where: { email: newEmail } });
    if (tempUser) return false;
    if (!(await argon2.verify(user.password, confirmPass))) return false;
    user.tempEmail = newEmail;
    await user.save();
    const username = user.username;
    const TOKEN = v4();
    await redis.set(resetEmailPrefix + TOKEN, user.id, "ex", 60 * 60 * 24);
    const url = `http://localhost:3000/user/reset-email/${TOKEN}`;
    await sendChangeEmailMail(newEmail, username, url);
    return true;
  }
  @Mutation(() => UserData, { nullable: true })
  async verifyEmail(
    @Arg("token") token: string
  ): Promise<UserData | undefined> {
    const userId = await redis.get(resetEmailPrefix + token);
    if (!userId) return undefined;
    const user = await UserData.findOne(userId);
    if (!user) return undefined;
    const tempEmail = user.tempEmail;
    if (!tempEmail) return undefined;
    user.email = tempEmail;
    user.tempEmail = "";
    await redis.del(resetEmailPrefix + token);
    await user.save();
    return user;
  }
}

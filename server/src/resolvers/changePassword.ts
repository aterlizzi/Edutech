import { changePassWithoutTokenInput } from "./inputs/changePassWithoutToken";
import { MyContext } from "./../types/MyContext";
import { UserData } from "../entity/User";
import { forgotPasswordPrefix } from "./../constants/redisPrefixes";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { redis } from "../redis";
import { changePassInput } from "./inputs/changePassInput";
import argon2 from "argon2";

@Resolver()
export class ChangePasswordResolver {
  @Mutation(() => UserData, { nullable: true })
  async changePassword(
    @Arg("data") { token, password }: changePassInput
  ): Promise<UserData | null> {
    const userId = await redis.get(forgotPasswordPrefix + token);
    if (!userId) return null;
    const user = await UserData.findOne(userId);
    if (!user) return null;
    await redis.del(forgotPasswordPrefix + token);
    user.password = await argon2.hash(password);
    await user.save();
    return user;
  }
  @Mutation(() => Boolean, { nullable: true })
  async changeWithoutTokenPassword(
    @Arg("data") { oldPassword, newPassword }: changePassWithoutTokenInput,
    @Ctx() ctx: MyContext
  ): Promise<boolean | null | string | undefined> {
    const user = await UserData.findOne(ctx.req.session.userId);
    if (!user) return null;
    if (await argon2.verify(user.password, newPassword)) return undefined;
    if (!(await argon2.verify(user.password, oldPassword))) return false;
    const hash = await argon2.hash(newPassword);
    user.password = hash;
    await user.save();
    return true;
  }
}

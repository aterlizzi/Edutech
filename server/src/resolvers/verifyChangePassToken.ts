import { UserData } from "./../entity/User";
import { redis } from "./../redis";
import {
  forgotPasswordPrefix,
  resetPasswordPrefix,
} from "./../constants/redisPrefixes";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import argon2 from "argon2";

@Resolver()
export class VerifyChangePassTokenResolver {
  @Query(() => Boolean)
  async verifyChangePassToken(@Arg("token") token: string): Promise<boolean> {
    let TOKEN = await redis.get(resetPasswordPrefix + token);
    if (!TOKEN) {
      TOKEN = await redis.get(forgotPasswordPrefix + token);
      if (!TOKEN) return false;
    }
    return true;
  }
  @Mutation(() => UserData, { nullable: true })
  async resetPassword(
    @Arg("token") token: string,
    @Arg("newPass") newPass: string
  ): Promise<UserData | undefined> {
    let userId = await redis.get(resetPasswordPrefix + token);
    if (!userId) {
      userId = await redis.get(forgotPasswordPrefix + token);
      if (!userId) return undefined;
    }
    const user = await UserData.findOne(userId);
    if (!user) return undefined;
    await redis.del(resetPasswordPrefix + token);
    await redis.del(forgotPasswordPrefix + token);
    const hash = await argon2.hash(newPass);
    user.password = hash;
    await user.save();
    return user;
  }
}

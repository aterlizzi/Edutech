import { isUnauth } from "./authentications/isUnauth";
import { MyContext } from "./../types/MyContext";
import { UserData } from "./../entity/User";
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import argon2 from "argon2";
import { v4 } from "uuid";

@Resolver()
export class LoginResolver {
  @UseMiddleware(isUnauth)
  @Mutation(() => UserData, { nullable: true })
  async login(
    @Arg("email", { nullable: true }) email: string,
    @Arg("username", { nullable: true }) username: string,
    @Arg("password") password: string,
    @Ctx() ctx: MyContext
  ): Promise<UserData | undefined> {
    let user;
    if (email) {
      user = await UserData.findOne({ where: { email } });
    } else if (username) {
      user = await UserData.findOne({ where: { username } });
    }
    if (!user) return undefined;
    const valid = await argon2.verify(user.password, password);
    if (!valid) return undefined;
    if (!user.confirmed) return undefined;
    ctx.req.session.userId = user.id;
    ctx.res.cookie("vid", v4(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
    });
    if (user.subscriber) {
      ctx.res.cookie("sid", v4(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
      });
    }
    return user;
  }
}

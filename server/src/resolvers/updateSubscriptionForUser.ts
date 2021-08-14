import { MyContext } from "./../types/MyContext";
import { Ctx, Mutation, Resolver } from "type-graphql";
import { v4 } from "uuid";

@Resolver()
export class updateUserSubscriberResolver {
  @Mutation(() => Boolean)
  async updateUserSubscriber(@Ctx() ctx: MyContext): Promise<boolean> {
    ctx.res.cookie("sid", v4(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
    });
    return true;
  }
}

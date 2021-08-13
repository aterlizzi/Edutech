import { UserData } from "../entity/User";
import { MyContext } from "./../types/MyContext";
import { Ctx, Query, Resolver } from "type-graphql";

@Resolver()
export class CooldownResolver {
  @Query(() => Number, { nullable: true })
  async cooldownIdeas(@Ctx() ctx: MyContext): Promise<number | null> {
    const user = await UserData.findOne(ctx.req.session.userId);
    if (!user) return null;
    const COOLDOWN = user.cooldown;
    if (!COOLDOWN) return null;
    const time = (Date.now() - COOLDOWN) / 1000 / 60;
    return time;
  }
}

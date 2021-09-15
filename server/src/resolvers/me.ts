import { MyContext } from "./../types/MyContext";
import { UserData } from "./../entity/User";
import { Ctx, Resolver, Query } from "type-graphql";

@Resolver()
export class MeResolver {
  @Query(() => UserData, { nullable: true })
  async me(@Ctx() ctx: MyContext): Promise<UserData | undefined> {
    if (!ctx.req.session.userId) return undefined;
    const user = await UserData.findOne({
      where: { id: ctx.req.session.userId },
      relations: [
        "viewed",
        "fApplications",
        "fApplications.acceptedColleges",
        "fApplications.author",
        "applications",
        "recentApps",
        "recentApps.author",
        "savedIdeas",
        "referrer",
        "referred",
        "presets",
      ],
    });
    if (!user) return undefined;
    if (user.tier === "Free" || Date.now() - user.current_period_end > 0) {
      ctx.res.clearCookie("sid");
    }
    return user;
  }
}

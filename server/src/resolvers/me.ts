import { MyContext } from "./../types/MyContext";
import { UserData } from "./../entity/User";
import { Ctx, Resolver, Query } from "type-graphql";

@Resolver()
export class MeResolver {
  @Query(() => UserData, { nullable: true })
  async me(@Ctx() ctx: MyContext): Promise<UserData | undefined> {
    if (!ctx.req.session.userId) return undefined;
    return await UserData.findOne(ctx.req.session.userId, {
      relations: [
        "viewed",
        "fApplications",
        "fApplications.acceptedColleges",
        "fApplications.author",
        "applications",
        "recentApps",
        "recentApps.author",
        "savedIdeas",
      ],
    });
  }
}

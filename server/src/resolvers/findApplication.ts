import { MyContext } from "./../types/MyContext";
import { Application } from "./../entity/Application";
import { Arg, Ctx, Query, Resolver } from "type-graphql";
import { UserData } from "./../entity/User";
import { getRepository } from "typeorm";

@Resolver()
export class FindApplicationResolver {
  @Query(() => Application, { nullable: true })
  async findApplication(
    @Arg("id") id: number,
    @Ctx() ctx: MyContext
  ): Promise<Application | undefined> {
    const app = await Application.findOne(id, {
      relations: [
        "author",
        "viewers",
        "acceptedColleges",
        "rejectedColleges",
        "waitlistedColleges",
      ],
    });
    const user = await UserData.findOne(ctx.req.session.userId, {
      relations: ["recentApps"],
    });
    if (!app || !user) return undefined;
    const previousRelations = app.viewers;
    const recents = user.recentApps;
    if (recents.length === 5) {
      recents.shift();
    }
    if (recents.length > 0) {
      user.recentApps = [...recents, app];
    } else {
      console.log("run2");
      user.recentApps = [app];
    }
    app.viewers = [...previousRelations, user];
    app.viewCount += 1;
    await user.save();
    await app.save();
    return app;
  }
  @Query(() => [Application], { nullable: true })
  async findApplications(
    @Arg("categories", () => [String]) categories: string[],
    @Arg("colleges", () => [String]) colleges: string[],
    @Arg("take") take: number
  ): Promise<Application[] | undefined> {
    let apps: Application[] = [];
    if (colleges.length > 0) {
      for (let i = 0; i < colleges.length; i++) {
        if (categories.includes("Highest rating")) {
          const correctApps = await getRepository(Application)
            .createQueryBuilder("Application")
            .innerJoinAndSelect("Application.acceptedColleges", "College")
            .where("College.college =:value", {
              value: colleges[i],
            })
            .orderBy("Application.fUsersCount", "DESC")
            .take(Math.round(take / colleges.length))
            .getMany();
          apps.push(...correctApps);
        } else if (categories.includes("Most recent")) {
          const correctApps = await getRepository(Application)
            .createQueryBuilder("Application")
            .innerJoinAndSelect("Application.acceptedColleges", "College")
            .where("College.college =:value", {
              value: colleges[i],
            })
            .orderBy("Application.createdAt", "DESC")
            .take(Math.round(take / colleges.length))
            .getMany();
          apps.push(...correctApps);
        } else {
          const correctApps = await getRepository(Application)
            .createQueryBuilder("Application")
            .innerJoinAndSelect("Application.acceptedColleges", "College")
            .where("College.college =:value", {
              value: colleges[i],
            })
            .take(Math.round(take / colleges.length))
            .getMany();
          apps.push(...correctApps);
        }
      }
    }
    if (colleges.length === 0) {
      if (categories.includes("Most recent")) {
        apps = await Application.find({
          take,
          relations: [
            "author",
            "acceptedColleges",
            "rejectedColleges",
            "waitlistedColleges",
            "viewers",
            "fUsers",
          ],
          order: {
            createdAt: "DESC",
          },
        });
      } else if (categories.includes("Highest rating")) {
        apps = await Application.find({
          take,
          relations: [
            "author",
            "acceptedColleges",
            "rejectedColleges",
            "waitlistedColleges",
            "viewers",
            "fUsers",
          ],
          order: {
            fUsersCount: "DESC",
          },
        });
      } else {
        apps = await Application.find({
          take,
          relations: [
            "author",
            "acceptedColleges",
            "rejectedColleges",
            "waitlistedColleges",
            "viewers",
            "fUsers",
          ],
          order: {
            viewCount: "DESC",
          },
        });
      }
    }
    return apps;
  }
}

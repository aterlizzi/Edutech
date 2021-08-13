import { UserData } from "./../entity/User";
import { Application } from "./../entity/Application";
import { MyContext } from "./../types/MyContext";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { getRepository } from "typeorm";

@Resolver()
export class FavoriteApplicationResolver {
  @Mutation(() => Boolean)
  async favoriteApplication(
    @Arg("id") id: number,
    @Ctx() ctx: MyContext
  ): Promise<boolean> {
    const app = await getRepository(Application)
      .createQueryBuilder("Application")
      .innerJoinAndSelect("Application.fUsers", "UserData")
      .where("UserData.id =:id", { id: ctx.req.session.userId })
      .getMany();
    if (app.length > 0) {
      for (let i = 0; i < app.length; i++) {
        if (app[i].id === id) {
          const correctArr = app[i].fUsers.filter((user) => {
            if (user.id === parseInt(ctx.req.session.userId)) {
              return false;
            }
            return true;
          });
          app[i].fUsers = correctArr;
          app[i].fUsersCount = app[i].fUsersCount - 1;
          await app[i].save();
          return false;
        }
      }
    }
    const newApp = await Application.findOne(id, { relations: ["fUsers"] });
    const user = await UserData.findOne(ctx.req.session.userId);
    if (!newApp || !user) return false;
    const currentUsers = newApp.fUsers;
    newApp.fUsers = [...currentUsers, user];
    newApp.fUsersCount = newApp.fUsersCount + 1;
    await newApp.save();
    return true;
  }
}

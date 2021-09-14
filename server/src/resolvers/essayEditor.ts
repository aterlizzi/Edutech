import { UserData } from "./../entity/User";
import { MyContext } from "./../types/MyContext";
import { Essay } from "./../entity/Essay";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class EssayEditorResolver {
  @Query(() => [Essay])
  async findEssays(): Promise<Essay[]> {
    const essays = await Essay.find({ relations: ["user"] });
    return essays;
  }
  @Mutation(() => Boolean)
  async deleteEssay(@Arg("id") id: number): Promise<boolean> {
    await Essay.delete(id);
    return true;
  }
  @Mutation(() => Boolean)
  async savePreset(
    @Arg("preset") preset: number,
    @Arg("content") content: string,
    @Ctx() ctx: MyContext
  ): Promise<boolean> {
    const user = await UserData.findOne({
      where: { id: ctx.req.session.userId },
      relations: ["presets"],
    });
    if (!user) return false;
    const currentPreset = user.presets;
    switch (preset) {
      case 1:
        currentPreset.presetOne = content;
        break;
      case 2:
        currentPreset.presetTwo = content;
        break;
      case 3:
        currentPreset.presetThree = content;
        break;
      case 4:
        currentPreset.presetFour = content;
        break;
      default:
        break;
    }
    user.presets = currentPreset;
    await user.save();
    return true;
  }
}

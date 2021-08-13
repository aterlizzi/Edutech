import { MyContext } from "./../types/MyContext";
import { SavedIdeas } from "../entity/SavedIdeas";
import { Ideas } from "../entity/Ideas";
import { UserData } from "../entity/User";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class IdeaResolver {
  @Mutation(() => Boolean)
  async saveIdea(
    @Arg("useCase") useCase: string,
    @Arg("prompt") prompt: string,
    @Arg("content") content: string,
    @Ctx() ctx: MyContext
  ): Promise<boolean> {
    let parsedPrompt;
    if (prompt === "3") {
      parsedPrompt = `College application essay ideas involving a student challenging previously held beliefs or ideas and the outcome of challenging those beliefs or ideas.`;
    } else if (prompt === "4") {
      parsedPrompt = `College application ideas involving a positive interaction between two individuals that ends with one individual being happy and thankful in a surprising way. Include how gratitude resulting from the interaction affected or motivated the individual.`;
    } else if (prompt === "2") {
      parsedPrompt = `College application ideas involving a student facing a challenge, setback, or failure and how he/she learned from that experience.`;
    } else if (prompt === "5") {
      parsedPrompt = `College application essay ideas involving an accomplishment, event, or realization that sparked personal growth in a student and includes how this resulted in a new understanding of the student or others.`;
    } else if (prompt === "6") {
      parsedPrompt = `College application essay ideas involving a student's passion and why it captivates him/her.`;
    } else if (prompt === "1") {
      parsedPrompt = `College application essay ideas involving a student's background, identity, or talent.`;
    }
    const user = await UserData.findOne(ctx.req.session.userId);
    if (!user) return false;
    const idea = Ideas.create({
      author: user,
      prompt: parsedPrompt,
      usecase: useCase,
      content,
    });
    if (!idea) return false;
    await idea.save();
    return true;
  }
  @Query(() => [Ideas])
  async findIdeas(): Promise<Ideas[]> {
    const ideas = await Ideas.find({ relations: ["author"] });
    return ideas;
  }
  @Mutation(() => Boolean)
  async deleteIdea(@Arg("id") id: number): Promise<boolean> {
    const idea = Ideas.findOne(id);
    if (!idea) return false;
    await Ideas.delete(id);
    return true;
  }
  @Mutation(() => Boolean)
  async deleteSavedIdea(@Arg("id") id: number): Promise<boolean> {
    const idea = SavedIdeas.findOne(id);
    if (!idea) return false;
    await SavedIdeas.delete(id);
    return true;
  }
  @Mutation(() => Boolean)
  async favoriteIdeas(
    @Ctx() ctx: MyContext,
    @Arg("useCase") useCase: string,
    @Arg("prompt") prompt: string,
    @Arg("content") content: string,
    @Arg("title") title: string
  ): Promise<boolean> {
    const user = await UserData.findOne(ctx.req.session.userId, {
      relations: ["savedIdeas"],
    });
    if (!user) return false;
    let parsedPrompt;
    if (prompt === "3") {
      parsedPrompt = `College application essay ideas involving a student challenging previously held beliefs or ideas and the outcome of challenging those beliefs or ideas.`;
    } else if (prompt === "4") {
      parsedPrompt = `College application ideas involving a positive interaction between two individuals that ends with one individual being happy and thankful in a surprising way. Include how gratitude resulting from the interaction affected or motivated the individual.`;
    } else if (prompt === "2") {
      parsedPrompt = `College application ideas involving a student facing a challenge, setback, or failure and how he/she learned from that experience.`;
    } else if (prompt === "5") {
      parsedPrompt = `College application essay ideas involving an accomplishment, event, or realization that sparked personal growth in a student and includes how this resulted in a new understanding of the student or others.`;
    } else if (prompt === "6") {
      parsedPrompt = `College application essay ideas involving a student's passion and why it captivates him/her.`;
    } else if (prompt === "1") {
      parsedPrompt = `College application essay ideas involving a student's background, identity, or talent.`;
    } else {
      parsedPrompt = prompt;
    }
    let list = user.savedIdeas;
    for (let i = 0; i < user.savedIdeas.length; i++) {
      if (
        user.savedIdeas[i].prompt === parsedPrompt &&
        user.savedIdeas[i].usecase === useCase &&
        user.savedIdeas[i].content === content &&
        user.savedIdeas[i].title === title
      ) {
        list.splice(i, 1);
        user.savedIdeas = list;
        await user.save();
        return false;
      }
    }
    const savedIdea = SavedIdeas.create({
      content,
      usecase: useCase,
      prompt: parsedPrompt,
      saver: user,
      title,
    });
    if (!savedIdea) return false;
    await savedIdea.save();
    return true;
  }
}

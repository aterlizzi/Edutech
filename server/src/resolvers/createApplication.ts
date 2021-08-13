import { pdfReturnInput } from "./inputs/pdfInput";
import { Application } from "./../entity/Application";
import { Arg, Mutation, Resolver } from "type-graphql";

@Resolver()
export class CreateApplicationResolver {
  @Mutation(() => Application, { nullable: true })
  async createApplication(
    @Arg("data")
    {
      gpa,
      grad,
      rank,
      honor,
      sat,
      ap_scores,
      ap_subs,
      act,
      w,
      essayPrompt,
      additionalInfo,
    }: pdfReturnInput
  ): Promise<Application | undefined> {
    const honorArr: string[] = honor.split(" ");
    const satScore: string[] = sat.split(" ");
    const apScores: any = ap_scores
      .split(" ")
      .map((number) => parseInt(number));
    const apSubjects: string[] = ap_subs.split(" ");
    const activities: string[] = act.split(" ");
    const app = Application.create({
      gpaScore: gpa,
      graduationDate: grad,
      classRank: rank,
      honorArr,
      satScore,
      apScores,
      apSubjects,
      activities,
      writing: w,
      essayPrompt,
      additionalInfo,
    });
    if (!app) return undefined;
    app.save();
    return app;
  }
}

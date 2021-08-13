import { MyContext } from "./../types/MyContext";
import { spawn } from "child_process";
import { Application } from "./../entity/Application";
import {
  newLineRegex,
  removeSpacesRegex,
  classRankRegex,
  gpaScoreTypeRegex,
  graduationDateRegex,
  classRankTypeRegex,
  honorRegex,
  satRegex,
  apScoresRegex,
  nameRegex,
  ceebRegex,
  caidRegex,
  seasonRegex,
  fyrdRegex,
  essayPromptRegex,
  gpaScoreRegex,
  apSubjectsRegex,
} from "./../utils/regexSheet";
import { pdfReturnInput } from "./inputs/pdfInput";
import { Arg, Ctx, ID, Query, Resolver } from "type-graphql";
import { Field, ObjectType } from "type-graphql";
import path from "path";
import faker from "faker";
import { once } from "events";
import { UserData } from "../entity/User";
import { College } from "./../entity/College";

@ObjectType()
export class pdfReturnObj {
  @Field(() => String)
  gpa: string;
  @Field(() => String)
  grad!: string;
  @Field(() => String)
  rank!: string;
  @Field(() => String)
  honor!: string;
  @Field(() => String)
  sat!: string;
  @Field(() => String)
  ap_scores!: string;
  @Field(() => String)
  ap_subs!: string;
  @Field(() => String)
  act!: string;
  @Field(() => String)
  w!: string;
  @Field(() => String)
  essayPrompt!: string;
  @Field(() => String)
  additionalInfo!: string;
  @Field(() => String)
  specialKey!: string;
  @Field(() => ID, { nullable: true })
  userId: number | null;
  @Field(() => [String])
  accepted: string[];
  @Field(() => [String])
  rejected: string[];
  @Field(() => [String])
  waitlisted: string[];
}

@Resolver()
export class acceptParsedPDFResolver {
  @Query(() => Application)
  async acceptParsedPDF(
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
      specialKey,
      userId,
      accepted,
      rejected,
      waitlisted,
    }: pdfReturnInput,
    @Ctx() ctx: MyContext
  ): Promise<Application> {
    const gpaScore = gpaScoreInterpreter(gpa);
    const gpaScoreType = gpaTypeInterpreter(gpa);
    const graduationDate = gradInterpreter(grad);
    const classRank = classRankInterpreter(rank);
    const classRankType = classRankTypeInterpreter(rank);
    const honorArr = honorInterpreter(honor);
    const satScore = satInterpreter(sat);
    const apScores = apScoresInterpreter(ap_scores);
    const apSubjects = apSubjectsInterpreter(ap_subs);
    const activities = activitiesInterpreter(act);
    let writing = writingInterpreter(w, specialKey);
    const essayPrompt = essayPromptIntepreter(w);
    let additionalInfo = additionalInfoInterpreter(w, specialKey);
    const SpecialKey = specialKeyInterpreter(specialKey);
    console.log(accepted, rejected, waitlisted);
    const pathJar = path.join(
      __dirname,
      "../utils/stanfordNER/stanford-ner.jar"
    );
    const pathModel = path.join(
      __dirname,
      "../utils/stanfordNER/english.all.3class.distsim.crf.ser.gz"
    );

    const removeNamesFunc = async (
      writing: string,
      additionalInfo: string,
      gpaScore: string,
      gpaScoreType: string,
      graduationDate: string,
      classRank: string,
      classRankType: string,
      honorArr: string[],
      satScore: string[],
      apScores: number[],
      apSubjects: string[],
      activities: string[],
      essayPrompt: string,
      SpecialKey: string,
      userId: number | null,
      ctx: MyContext
    ) => {
      const childPython = spawn("python3.9", [
        path.join(__dirname, "./NER.py"),
        pathJar,
        pathModel,
        writing,
        additionalInfo,
      ]);

      childPython.stdout.on("data", (data) => {
        const stringObj = data.toString();
        const jsonObj = JSON.parse(stringObj);
        const uniqueAIArr: string[] = [];
        const uniqueWArr: string[] = [];
        let regexString: string = ``;
        jsonObj.additionalInfo.forEach((array: string[]) => {
          if (uniqueAIArr.indexOf(array[0]) == -1) uniqueAIArr.push(array[0]);
        });
        uniqueAIArr.forEach((name: string) => {
          regexString = `${name}`;
          const regexNameObj = new RegExp(regexString, "gm");
          additionalInfo = additionalInfo.replace(
            regexNameObj,
            faker.name.firstName()
          );
        });
        jsonObj.writing.forEach((array: string[]) => {
          if (uniqueWArr.indexOf(array[0]) == -1) uniqueWArr.push(array[0]);
        });
        uniqueWArr.forEach((name: string) => {
          regexString = `${name}`;
          const regexNameObj = new RegExp(regexString, "gm");
          writing = writing.replace(regexNameObj, faker.name.firstName());
        });
        writing = writing.replace(/^ /gm, "");
        additionalInfo = additionalInfo.replace(/ *$/gm, "");
      });
      childPython.stderr.on("data", (data) => {
        return console.log(data.toString());
      });
      childPython.on("close", (code) => {
        return console.log(`closed on ${code}`);
      });

      await once(childPython, "close");
      const user = await UserData.findOne(ctx.req.session.userId);
      const app = Application.create({
        gpaScore,
        gpaScoreType,
        graduationDate,
        classRank,
        classRankType,
        honorArr,
        satScore,
        apScores,
        apSubjects,
        activities,
        writing,
        essayPrompt,
        additionalInfo,
        specialKey: SpecialKey,
      });
      if (user) {
        app.author = user;
      }
      return app;
    };
    const app = await removeNamesFunc(
      writing,
      additionalInfo,
      gpaScore,
      gpaScoreType,
      graduationDate,
      classRank,
      classRankType,
      honorArr,
      satScore,
      apScores,
      apSubjects,
      activities,
      essayPrompt,
      SpecialKey,
      userId,
      ctx
    );
    if (app) {
      await app.save();
    }
    if (accepted !== []) {
      const newArr = (accepted = accepted[0].split(","));
      newArr.forEach(async (element) => {
        let college = await College.findOne({
          where: { college: element },
          relations: ["acceptedApps", "rejectedApps", "waitlistedApps"],
        });
        let newCollege;
        if (!college) {
          newCollege = College.create({
            college: element,
            acceptedApps: [app],
            rejectedApps: [],
            waitlistedApps: [],
          });
          await newCollege.save();
        } else {
          const previousAccepts = college.acceptedApps;
          if (!previousAccepts) {
            college.acceptedApps = [app];
          } else {
            college.acceptedApps = [...previousAccepts, app];
          }
          await college.save();
        }
      });
    }
    if (rejected !== []) {
      const newArr = (rejected = rejected[0].split(","));
      newArr.forEach(async (element) => {
        let college = await College.findOne({
          where: { college: element },
          relations: ["acceptedApps", "rejectedApps", "waitlistedApps"],
        });
        let newCollege;
        if (!college) {
          newCollege = College.create({
            college: element,
            acceptedApps: [],
            rejectedApps: [app],
            waitlistedApps: [],
          });
          await newCollege.save();
        } else {
          const previousAccepts = college.rejectedApps;
          if (!previousAccepts) {
            college.rejectedApps = [app];
          } else {
            college.rejectedApps = [...previousAccepts, app];
          }
          await college.save();
        }
      });
    }
    if (waitlisted !== []) {
      const newArr = waitlisted[0].split(",");
      newArr.forEach(async (element) => {
        let college = await College.findOne({
          where: { college: element },
          relations: ["acceptedApps", "rejectedApps", "waitlistedApps"],
        });
        let newCollege;
        if (!college) {
          newCollege = College.create({
            college: element,
            acceptedApps: [],
            rejectedApps: [],
            waitlistedApps: [app],
          });
          await newCollege.save();
        } else {
          const previousWait = college.waitlistedApps;
          if (!previousWait) {
            college.waitlistedApps = [app];
          } else {
            college.waitlistedApps = [...previousWait, app];
          }
          await college.save();
        }
      });
    }
    return app;
  }
}

const gpaScoreInterpreter = (gpa: string) => {
  if (
    !gpa
      .replace(newLineRegex, " ")
      .replace(removeSpacesRegex, "")
      .match(gpaScoreRegex)
  )
    return "";
  return gpa
    .replace(newLineRegex, " ")
    .replace(removeSpacesRegex, "")
    .match(gpaScoreRegex)![0];
};
const gpaTypeInterpreter = (gpa: string) => {
  return gpa
    .replace(newLineRegex, " ")
    .replace(removeSpacesRegex, "")
    .replace(gpaScoreTypeRegex, "");
};

const gradInterpreter = (grad: string) => {
  if (!grad.replace(newLineRegex, " ").match(graduationDateRegex)) return "";
  return grad.replace(newLineRegex, " ").match(graduationDateRegex)![0];
};

const classRankInterpreter = (rank: string) => {
  if (
    rank
      .replace(newLineRegex, " ")
      .replace(removeSpacesRegex, "")
      .match(classRankRegex) == null
  )
    return "";
  return rank
    .replace(newLineRegex, " ")
    .replace(removeSpacesRegex, "")
    .match(classRankRegex)![0];
};

const classRankTypeInterpreter = (rank: string) => {
  return rank
    .replace(newLineRegex, " ")
    .replace(removeSpacesRegex, "")
    .replace(classRankTypeRegex, "");
};

const honorInterpreter = (honor: string) => {
  let freshArr: string[] = [];
  if (!honor.replace(newLineRegex, " ").match(honorRegex)) return [];
  const arrUncut = honor.replace(newLineRegex, " ").match(honorRegex);
  for (let i = 0; i < arrUncut!.length; i++) {
    arrUncut![i].split("  ").filter((string) => {
      if (
        string !== "School" &&
        string !== "National" &&
        string !== "State/Regional" &&
        string !== "International"
      ) {
        freshArr.push(string.replace(/^ /gm, ""));
        return true;
      }
      return false;
    });
  }
  return freshArr;
};

const satInterpreter = (sat: string) => {
  if (!sat.replace(newLineRegex, " ").match(satRegex)) return [];
  return sat.replace(newLineRegex, " ").match(satRegex)![0].split(" ");
};

const apScoresInterpreter = (ap_scores: string) => {
  if (!ap_scores.replace(newLineRegex, " ").match(apScoresRegex)) return [];
  const numArr = ap_scores
    .replace(newLineRegex, " ")
    .match(apScoresRegex)![0]
    .split("  ");
  const numArrFilter = numArr.filter((number: string) => {
    if (number) return true;
    return false;
  });
  return numArrFilter.map((number: string) => {
    return parseInt(number);
  });
};

const apSubjectsInterpreter = (ap_subs: string) => {
  if (
    ap_subs
      .replace(newLineRegex, " ")
      .replace(apSubjectsRegex, "")
      .split("  ") == [""]
  )
    return [];
  return ap_subs
    .replace(newLineRegex, " ")
    .replace(apSubjectsRegex, "")
    .split("  ")
    .filter((subject: string) => {
      if (parseInt(subject) || subject === "") return false;
      return true;
    });
};

const activitiesInterpreter = (act: string) => {
  if (act.replace(newLineRegex, " ").split("  ") == [""]) return [];
  const initArr = act.replace(newLineRegex, " ").split("  ");
  const filteredArr = initArr.filter((sentence: string) => {
    if (sentence.split(" ").length > 7) return true;
    return false;
  });
  return filteredArr;
};

const writingInterpreter = (writing: string, specialKey: string) => {
  const name = specialKey.replace(newLineRegex, " ").match(nameRegex)![0];
  const ceeb = specialKey.replace(newLineRegex, " ").match(ceebRegex)![0];
  const caid = specialKey.replace(newLineRegex, " ").match(caidRegex)![0];
  const season = specialKey.replace(newLineRegex, " ").match(seasonRegex)![0];
  const fyrd = specialKey
    .replace(newLineRegex, " ")
    .match(fyrdRegex)![0]
    .replace(/\s/gm, "");
  const regexString = `\\w\\w ${name} ${ceeb} ${season} \\d* ${fyrd} ${caid}`;
  const coolRegex = new RegExp(regexString, "gm");
  return writing
    .replace(newLineRegex, " ")
    .replace(/  /gm, " ")
    .replace(coolRegex, " ")
    .replace(/^Writing Personal Essay /, "")
    .replace(essayPromptRegex, "")
    .replace(/(?<=Additional Information ).*/gm, "")
    .replace(/Additional Information $/gm, "");
};

const essayPromptIntepreter = (writing: string) => {
  if (!writing.replace(newLineRegex, " ").match(essayPromptRegex)) return "";
  return writing.replace(newLineRegex, " ").match(essayPromptRegex)![0];
};

const additionalInfoInterpreter = (writing: string, specialKey: string) => {
  const name = specialKey.replace(newLineRegex, " ").match(nameRegex)![0];
  const ceeb = specialKey.replace(newLineRegex, " ").match(ceebRegex)![0];
  const caid = specialKey.replace(newLineRegex, " ").match(caidRegex)![0];
  const season = specialKey.replace(newLineRegex, " ").match(seasonRegex)![0];
  const fyrd = specialKey
    .replace(newLineRegex, " ")
    .match(fyrdRegex)![0]
    .replace(/\s/gm, "");
  const regexString = `\\w\\w ${name} ${ceeb} ${season} \\d* ${fyrd} ${caid}`;
  const coolRegex = new RegExp(regexString, "gm");
  return writing
    .replace(newLineRegex, " ")
    .replace(/.*(?=Additional Information)/gm, "")
    .replace(/^Additional Information /gm, "")
    .replace(/  /gm, " ")
    .replace(coolRegex, "")
    .replace(/^ /gm, "");
};

const specialKeyInterpreter = (specialKey: string) => {
  return specialKey.replace(newLineRegex, " ");
};

// import { UseMiddleware } from 'type-graphql';
import { MyContext } from "./../types/MyContext";
import { Upload } from "./../types/Upload";
import { GraphQLUpload } from "graphql-upload";
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { v4 } from "uuid";
import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import { isAuth } from "./authentications/isAuth";

@Resolver()
export class uploadAppPDFResolver {
  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async uploadAppPDF(
    @Arg("pdf", () => GraphQLUpload) file: Upload,
    @Arg("display") display: boolean,
    @Arg("accepted", () => [String]) accepted: string[],
    @Arg("rejected", () => [String]) rejected: string[],
    @Arg("waitlisted", () => [String]) waitlisted: string[],
    @Ctx() ctx: MyContext
  ): Promise<boolean> {
    const { createReadStream } = file;
    const fileName = v4();
    const stream = createReadStream();
    const pathName = path.join(__dirname, `/../../uploadPDF/${fileName}`);
    let userId;
    if (display) {
      userId = ctx.req.session.userId;
    } else {
      userId = null;
    }
    await stream.pipe(fs.createWriteStream(pathName));
    const childPython = spawn("python", [
      path.join(__dirname, "./parsePDF.py"),
      pathName,
      userId,
      accepted,
      rejected,
      waitlisted,
    ]);

    childPython.stdout.on("data", (data) => {
      const jsonString = data.toString();
      const jsonObj = JSON.parse(jsonString);
      return console.log(jsonObj);
    });
    childPython.stderr.on("data", (data) => {
      return console.log(data.toString());
    });
    childPython.on("close", (code) => {
      return console.log(`closed on ${code}`);
    });
    return true;
  }
}

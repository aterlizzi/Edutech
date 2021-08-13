import { ID } from "type-graphql";
import { pdfReturnObj } from "../acceptParsedPDF";
import { Field, InputType } from "type-graphql";
@InputType()
export class pdfReturnInput implements Partial<pdfReturnObj> {
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
  additionalInfo: string;
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

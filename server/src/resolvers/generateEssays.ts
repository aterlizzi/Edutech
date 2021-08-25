import { Mutation, Resolver } from "type-graphql";
const OpenAI = require("openai-api");
const openai = new OpenAI(process.env.OPENAI_API_KEY);

@Resolver()
export class GenerateEssaysResolver {
  @Mutation(() => String)
  async generateEssays(): Promise<string> {
    let gtpResponse;
    gtpResponse = await openai.complete({
      engine: "curie:ft-user-htzj0xymenfkhbyyyyuzm1t4-2021-08-18-00-24-38",
      prompt: `201.`,
      maxTokens: 1000,
      temperature: 1,
      topP: 0.9,
      stop: ["END"],
    });
    console.log(gtpResponse.data.choices[0]);
    return gtpResponse.data.choices[0].text;
  }
}

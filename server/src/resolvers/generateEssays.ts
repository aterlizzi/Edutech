import { Mutation, Resolver } from "type-graphql";
const OpenAI = require("openai-api");
const openai = new OpenAI(process.env.OPENAI_API_KEY);

@Resolver()
export class GenerateEssaysResolver {
  @Mutation(() => String)
  async generateEssays(): Promise<string> {
    let gtpResponse;
    gtpResponse = await openai.engines();
    console.log(gtpResponse.data.data);
    return "";
    // gtpResponse = await openai.complete({
    //   engine: "curie:ft-user-htzj0xymenfkhbyyyyuzm1t4-2021-09-03-15-11-52",
    //   prompt: `332.\n`,
    //   maxTokens: 1000,
    //   temperature: 0.9,
    //   topP: 1,
    //   stop: ["END"],
    // });
    // console.log(gtpResponse.data.choices[0]);
    // return gtpResponse.data.choices[0].text;
  }
}
`      engine: "curie:ft-user-htzj0xymenfkhbyyyyuzm1t4-2021-09-03-15-11-52",
`;

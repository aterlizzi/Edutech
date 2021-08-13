import { GraphQLJSONObject } from "graphql-type-json";
import { Arg, Query, Resolver } from "type-graphql";
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST_KEY);

@Resolver()
export class retrieveStripeSessionResolver {
  @Query(() => GraphQLJSONObject)
  async retrieveStripeSession(
    @Arg("sessionId") sessionId: string
  ): Promise<JSON> {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    });
    return session;
  }
}

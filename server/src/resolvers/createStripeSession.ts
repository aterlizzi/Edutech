import { Mutation, Resolver } from "type-graphql";
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST_KEY);

@Resolver()
export class createStripeSessionResolver {
  @Mutation(() => String)
  async createStripeSession(): Promise<string> {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_SECRET_PRICE_KEY,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url:
        "http://localhost:3000/applications/payments/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:3000/applications/payments",
    });
    return session.url;
  }
}

import { UserData } from "../entity/User";
import { MyContext } from "./../types/MyContext";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { v4 } from "uuid";
import { sendOrderMail } from "../utils/sendOrderEmail";
const orderid = require("order-id")(process.env.ORDER_ID_SECRET);
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST_KEY);

@Resolver()
export class updateUserSubscriberResolver {
  @Mutation(() => Boolean)
  async updateUserSubscriber(
    @Arg("subKey") subKey: string,
    @Arg("custKey") custKey: string,
    @Ctx() ctx: MyContext
  ): Promise<boolean> {
    const user = await UserData.findOne(ctx.req.session.userId);
    const customer = await stripe.customers.retrieve(custKey);
    if (!user) return false;
    if (!customer) return false;
    const id = orderid.generate();
    user.subscriber = true;
    user.subKey = subKey;
    user.orderId = id;
    user.custKey = custKey;
    ctx.res.cookie("sid", v4(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
    });
    await user.save();
    await sendOrderMail(customer.email, id, customer.name);
    return true;
  }
}

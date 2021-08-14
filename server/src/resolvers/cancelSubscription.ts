import { cancelSubPrefix } from "./../constants/redisPrefixes";
import { UserData } from "../entity/User";
import { MyContext } from "./../types/MyContext";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { redis } from "../redis";
import { v4 } from "uuid";
import { sendUnsubscribeContentMail } from "../utils/sendFeedbackEmail";
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST_KEY);

@Resolver()
export class cancelSubscriptionResolver {
  @Mutation(() => String)
  async cancelSubscription(@Ctx() ctx: MyContext): Promise<string> {
    const user = await UserData.findOne({
      where: { id: ctx.req.session.userId },
    });
    if (!user) return "";
    const subscription = await stripe.customers.retrieve(user.custKey);
    console.log(subscription);
    const subKey = user.subKey;
    stripe.subscriptions.del(subKey);
    user.subKey = "";
    user.subscriber = false;
    user.tier = "Free";
    ctx.res.clearCookie("sid");
    const TOKEN = v4();
    await user.save();
    await redis.set(cancelSubPrefix + TOKEN, user.id, "ex", 60 * 60 * 24);
    return TOKEN;
  }
  @Mutation(() => Boolean)
  async verifyUnsub(@Arg("token") token: string): Promise<Boolean> {
    const userId = await redis.get(cancelSubPrefix + token);
    if (!userId) return false;
    await redis.del(cancelSubPrefix + token);
    return true;
  }
  @Mutation(() => Boolean)
  async sendUnsubscribeMail(
    @Arg("content") content: string,
    @Ctx() ctx: MyContext
  ): Promise<boolean> {
    const user = await UserData.findOne(ctx.req.session.userId);
    if (!user) return false;
    const username = user.username;
    await sendUnsubscribeContentMail(username, content);
    return true;
  }
}

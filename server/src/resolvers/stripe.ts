import { loginPrefix, referralPrefix } from "./../constants/redisPrefixes";
import { UserData } from "../entity/User";
import { MyContext } from "./../types/MyContext";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { redis } from "../redis";
import { v4 } from "uuid";
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST_KEY);
const { networkInterfaces } = require("os");
const nets = networkInterfaces();
const results = Object.create(null);

@Resolver()
export class StripeResolver {
  @Mutation(() => String, { nullable: true })
  async createStripeSession(
    @Ctx() ctx: MyContext,
    @Arg("referralCode") referralCode: string,
    @Arg("session") session: number
  ): Promise<string | undefined> {
    let discount;
    let referralUser;
    let accessToken = "";
    const user = await UserData.findOne({
      where: { id: ctx.req.session.userId },
    });
    if (!user) {
      accessToken = v4();
    }
    if (referralCode !== "") {
      referralUser = await UserData.findOne({ where: { referralCode } });
      const me = await UserData.findOne(ctx.req.session.userId);
      const currentAddress = parseAddress();
      if (!referralUser) {
        discount = false;
      } else {
        if (me) {
          if (referralUser.email === me.email) {
            discount = false;
          } else if (referralUser.ip_address === me.ip_address) {
            discount = false;
          }
        } else if (referralUser.ip_address === currentAddress) {
          discount = false;
        } else {
          discount = true;
        }
      }
    }
    if (user && discount) {
      user.referredCode = referralCode;
      await user.save();
    }
    if (session === 1) {
      if (!discount) {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          client_reference_id: `${user?.id}/${accessToken}`,
          line_items: [
            {
              price: process.env.STRIPE_SECRET_PUBLICUNIVERSITY_PRICE_KEY,
              quantity: 1,
            },
          ],
          mode: "subscription",
          success_url:
            "http://localhost:3000/applications/payments/success?session_id={CHECKOUT_SESSION_ID}",
          cancel_url: "http://localhost:3000/applications/pricing",
        });
        if (!user) {
          const token = v4();
          await redis.set(loginPrefix + token, session.url, "ex", 1000 * 60);
          const url = `http://localhost:3000/user/register/${token}/${accessToken}`;
          return url;
        }
        return session.url;
      } else {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          client_reference_id: `${user?.id}/${accessToken}`,
          line_items: [
            {
              price: process.env.STRIPE_SECRET_PUBLICUNIVERSITY_PRICE_KEY,
              quantity: 1,
            },
          ],
          discounts: [
            {
              coupon: process.env.STRIPE_COUPON_ID,
            },
          ],
          mode: "subscription",
          success_url:
            "http://localhost:3000/applications/payments/success?session_id={CHECKOUT_SESSION_ID}",
          cancel_url: "http://localhost:3000/applications/pricing",
        });
        if (!user) {
          const token = v4();
          await redis.set(loginPrefix + token, session.url, "ex", 1000 * 60);
          const url = `http://localhost:3000/user/register/${token}/${accessToken}/${referralCode}`;
          return url;
        }
        return session.url;
      }
    } else if (session === 2) {
      if (!discount) {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          client_reference_id: `${user?.id}/${accessToken}`,
          line_items: [
            {
              price: process.env.STRIPE_SECRET_IVYLEAGUE_PRICE_KEY,
              quantity: 1,
            },
          ],
          mode: "subscription",
          success_url:
            "http://localhost:3000/applications/payments/success?session_id={CHECKOUT_SESSION_ID}",
          cancel_url: "http://localhost:3000/applications/pricing",
        });
        if (!user) {
          const token = v4();
          await redis.set(loginPrefix + token, session.url, "ex", 1000 * 60);
          const url = `http://localhost:3000/user/register/${token}/${accessToken}`;
          return url;
        }
        return session.url;
      } else {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          client_reference_id: `${user?.id}/${accessToken}`,
          line_items: [
            {
              price: process.env.STRIPE_SECRET_IVYLEAGUE_PRICE_KEY,
              quantity: 1,
            },
          ],
          discounts: [
            {
              coupon: process.env.STRIPE_COUPON_ID,
            },
          ],
          mode: "subscription",
          success_url:
            "http://localhost:3000/applications/payments/success?session_id={CHECKOUT_SESSION_ID}",
          cancel_url: "http://localhost:3000/applications/pricing",
        });
        if (!user) {
          const token = v4();
          await redis.set(loginPrefix + token, session.url, "ex", 1000 * 60);
          const url = `http://localhost:3000/user/register/${token}/${accessToken}/${referralCode}`;
          return url;
        }
        return session.url;
      }
    }
    return "";
  }
  @Mutation(() => String)
  async findSession(@Arg("token") token: string): Promise<string> {
    const sessionURL = await redis.get(loginPrefix + token);
    if (!sessionURL) return "";
    await redis.del(loginPrefix + token);
    return sessionURL;
  }
}

const parseAddress = () => {
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === "IPv4" && !net.internal) {
        if (!results[name]) {
          results[name] = [];
        }
        results[name].push(net.address);
      }
    }
  }
  return results["en0"][0];
};

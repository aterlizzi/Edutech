import { UserData } from "../entity/User";
import { MyContext } from "./../types/MyContext";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";

const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST_KEY);
const { networkInterfaces } = require("os");
const nets = networkInterfaces();
const results = Object.create(null);

@Resolver()
export class StripeResolver {
  @Mutation(() => String, { nullable: true })
  async createCustomerPortal(
    @Ctx() ctx: MyContext
  ): Promise<string | undefined> {
    const user = await UserData.findOne({
      where: { id: ctx.req.session.userId },
    });
    if (!user) return undefined;
    const session = await stripe.billingPortal.sessions.create({
      customer: user.custKey,
      return_url: "http://localhost:3000/user/settings",
    });
    return session.url;
  }
  @Mutation(() => String, { nullable: true })
  async createStripeSession(
    @Ctx() ctx: MyContext,
    @Arg("referralCode") referralCode: string,
    @Arg("session") session: number
  ): Promise<string | undefined> {
    let discount;
    let referralUser;
    const user = await UserData.findOne({
      where: { id: ctx.req.session.userId },
      relations: ["referred"],
    });
    if (referralCode !== "") {
      referralUser = await UserData.findOne({ where: { referralCode } });
      const me = await UserData.findOne({
        where: { id: ctx.req.session.userId },
        relations: ["referrer"],
      });
      const currentAddress = parseAddress();
      if (!referralUser) {
        discount = false;
      } else {
        if (me) {
          if (me.referrer) {
            discount = false;
          } else if (referralUser.email === me.email) {
            discount = false;
          } else {
            discount = true;
          }
          // else if (referralUser.ip_address === me.ip_address) {
          //   discount = false;
          // }
        }
        // else if (referralUser.ip_address === currentAddress) {
        //   discount = false;
        // }
        else {
          discount = true;
        }
      }
    }
    if (!user) {
      if (discount) {
        if (session === 1) {
          return `http://localhost:3000/user/register/XTdzoRsHhxWSVscoFBhg-${referralCode}`;
        } else if (session === 2) {
          return `http://localhost:3000/user/register/xqqkrpWkWTiLCaYuUkfJ-${referralCode}`;
        }
      } else {
        if (session === 1) {
          return `http://localhost:3000/user/register/YXLcaxBiXCBpDSbiGIAp-`;
        } else if (session === 2) {
          return `http://localhost:3000/user/register/WWfZlEUBdVNjxnGzKnJl-`;
        }
      }
    } else {
      if (user.redeemedReferralCoupon) {
        discount = false;
      }
      if (user.hasReferredCoupon) {
        if (session === 1) {
          const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            client_reference_id: `${user.id}`,
            metadata: { coupon: "referredCoupon" },
            line_items: [
              {
                price: process.env.STRIPE_SECRET_PUBLICUNIVERSITY_PRICE_KEY,
                quantity: 1,
              },
            ],
            discounts: [
              {
                coupon: process.env.STRIPE_REFERRED_COUPON_ID,
              },
            ],
            mode: "subscription",
            success_url:
              "http://localhost:3000/applications/payments/success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url: "http://localhost:3000/applications/pricing",
          });
          return session.url;
        } else if (session === 2) {
          const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            client_reference_id: `${user.id}`,
            metadata: { coupon: "referredCoupon" },
            line_items: [
              {
                price: process.env.STRIPE_SECRET_IVYLEAGUE_PRICE_KEY,
                quantity: 1,
              },
            ],
            discounts: [
              {
                coupon: process.env.STRIPE_REFERRED_COUPON_ID,
              },
            ],
            mode: "subscription",
            success_url:
              "http://localhost:3000/applications/payments/success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url: "http://localhost:3000/applications/pricing",
          });
          return session.url;
        }
      } else {
        if (session === 1) {
          if (!discount) {
            const session = await stripe.checkout.sessions.create({
              payment_method_types: ["card"],
              client_reference_id: `${user.id}`,
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
            return session.url;
          } else {
            const session = await stripe.checkout.sessions.create({
              payment_method_types: ["card"],
              client_reference_id: `${user.id}`,
              metadata: { coupon: "referralCoupon" },
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
            return session.url;
          }
        } else if (session === 2) {
          if (!discount) {
            const session = await stripe.checkout.sessions.create({
              payment_method_types: ["card"],
              client_reference_id: `${user.id}`,
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
            return session.url;
          } else {
            const session = await stripe.checkout.sessions.create({
              payment_method_types: ["card"],
              client_reference_id: `${user.id}`,
              metadata: { coupon: "referralCoupon" },
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
            return session.url;
          }
        }
      }
      return "";
    }
    return "";
  }
  @Mutation(() => String)
  async findSession(
    @Arg("token") token: string,
    @Arg("id") id: number,
    @Arg("code", { nullable: true }) code: string
  ): Promise<string | undefined> {
    const user = await UserData.findOne({ where: { id } });
    if (!user) return "";
    if (code) {
      user.referredCode = code;
      await user.save();
    }
    if (token === "XTdzoRsHhxWSVscoFBhg") {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        client_reference_id: `${user.id}`,
        metadata: { coupon: "referralCoupon" },
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
      return session.url;
    } else if (token === "xqqkrpWkWTiLCaYuUkfJ") {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        client_reference_id: `${user.id}`,
        metadata: { coupon: "referralCoupon" },
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
      return session.url;
    } else if (token === "YXLcaxBiXCBpDSbiGIAp") {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        client_reference_id: `${user.id}`,
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
      return session.url;
    } else if (token === "WWfZlEUBdVNjxnGzKnJl") {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        client_reference_id: `${user.id}`,
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
      return session.url;
    }
    return "";
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

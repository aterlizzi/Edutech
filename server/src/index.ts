import { Essay } from "./entity/Essay";
import { College } from "./entity/College";
import { Application } from "./entity/Application";
import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import { createConnection } from "typeorm";
import { UserData } from "./entity/User";
import express from "express";
const PORT = process.env.PORT || 5000;
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import session from "express-session";
import connectRedis from "connect-redis";
import { redis } from "./redis";
import cors from "cors";
import { graphqlUploadExpress } from "graphql-upload";
import { Ideas } from "./entity/Ideas";
import { SavedIdeas } from "./entity/SavedIdeas";
const orderId = require("order-id")(process.env.ORDER_ID_SECRET);
const webhookSecret = process.env.STRIPE_ENDPOINT_SECRET;
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST_KEY);
const bodyParser = require("body-parser");
// fixes typescript issue with assigning parameters to req.session object.
declare module "express-session" {
  interface SessionData {
    [key: string]: any;
  }
}

const main = async () => {
  await createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "admin",
    password: "admin",
    database: "collegeapp",
    entities: [UserData, Application, College, Ideas, SavedIdeas, Essay],
    synchronize: true,
    logging: process.env.NODE_ENV !== "production",
  });

  const server = new ApolloServer({
    schema: await buildSchema({
      // resolvers: [LogoutResolver, MeResolver, LoginResolver, ConfirmUserResolver, UsersResolver, ForgotPasswordResolver],
      resolvers: [__dirname + "/resolvers/*.{ts,js}"],
      validate: true,
    }),
    context: ({ req, res }: any) => ({ req, res }),
    uploads: false,
  });

  const app = express();

  const RedisStore = connectRedis(session);

  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000",
    })
  );
  app.use(graphqlUploadExpress({ maxFileSize: 100000, maxFiles: 10 }));
  app.use(
    session({
      store: new RedisStore({
        client: redis as any,
      }),
      name: "qid",
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      },
    } as any)
  );
  app.post(
    "/webhook",
    bodyParser.raw({ type: "application/json" }),
    async (req, res) => {
      const sig = req.headers["stripe-signature"];
      let event;
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } catch (err) {
        res.status(400).send(`Improper webhook signature.`);
      }
      switch (event.type) {
        case "checkout.session.completed":
          console.log(event);
          const checkoutId = event.data.object.id;
          const userId = event.data.object.client_reference_id;
          const order_id = orderId.generate();
          if (!userId) break;
          const user = await UserData.findOne({
            where: { id: userId },
            relations: ["referrer", "referred", "presets"],
          });
          if (!user) break;
          if (event.data.object.metadata) {
            if (event.data.object.metadata.coupon === "referredCoupon") {
              user.hasReferredCoupon = false;
            }
          }
          if (user.referredCode !== "") {
            const friend = await UserData.findOne({
              where: { referralCode: user.referredCode },
            });
            if (friend) {
              user.referrer = friend;
              friend.hasReferredCoupon = true;
              if (friend.subKey !== "") {
                await stripe.subscriptions.update(friend.subKey, {
                  coupon: process.env.STRIPE_REFERRED_COUPON_ID,
                });
              }
              await friend.save();
            }
          }
          const preset = user.presets;
          if (!preset) {
            const newPreset = Essay.create({
              user,
            });
            user.presets = newPreset;
          }
          user.redeemedReferralCoupon = true;
          user.referredCode = "";
          user.custKey = event.data.object.customer;
          user.subscriber = true;
          user.orderId = order_id;
          user.subKey = event.data.object.subscription;
          const line_items = await stripe.checkout.sessions.listLineItems(
            checkoutId
          );
          const price_id = line_items.data[0].price.id;
          switch (price_id) {
            case process.env.STRIPE_SECRET_PUBLICUNIVERSITY_PRICE_KEY:
              user.tier = "Public";
              break;
            case process.env.STRIPE_SECRET_PUBLICUNIVERSITY_DISCOUNT_PRICE_KEY:
              user.tier = "Public";
              break;
            case process.env.STRIPE_SECRET_IVYLEAGUE_PRICE_KEY:
              user.tier = "Ivy";
              break;
            case process.env.STRIPE_SECRET_IVYLEAGUE_DISCOUNT_PRICE_KEY:
              user.tier = "Ivy";
              break;
            default:
              break;
          }
          await user.save();
          break;
        case "invoice.created":
          break;
        case "invoice.paid":
          const invoiceCustkey = event.data.object.customer;
          const invoiceCust = await UserData.findOne({
            where: { custKey: invoiceCustkey },
          });
          if (!invoiceCust) break;
          const periodEnd = event.data.object.period_end;
          invoiceCust.current_period_end = parseInt(periodEnd);
          invoiceCust.totalIdeasRequested = 0;
          await invoiceCust.save();
          break;
        case "customer.subscription.updated":
          const updatedSubcriptionUser = await UserData.findOne({
            where: { custKey: event.data.object.customer },
          });
          if (!updatedSubcriptionUser) break;
          const priceKey = event.data.object.items.data[0].price.id;
          const periodSubEnd = parseInt(event.data.object.current_period_end);
          switch (priceKey) {
            case process.env.STRIPE_SECRET_PUBLICUNIVERSITY_PRICE_KEY:
              updatedSubcriptionUser.tier = "Public";
              updatedSubcriptionUser.current_period_end = periodSubEnd;
              break;
            case process.env.STRIPE_SECRET_PUBLICUNIVERSITY_DISCOUNT_PRICE_KEY:
              updatedSubcriptionUser.tier = "Public";
              updatedSubcriptionUser.current_period_end = periodSubEnd;
              break;
            case process.env.STRIPE_SECRET_IVYLEAGUE_PRICE_KEY:
              updatedSubcriptionUser.tier = "Ivy";
              updatedSubcriptionUser.current_period_end = periodSubEnd;
              break;
            case process.env.STRIPE_SECRET_IVYLEAGUE_DISCOUNT_PRICE_KEY:
              updatedSubcriptionUser.tier = "Ivy";
              updatedSubcriptionUser.current_period_end = periodSubEnd;
              break;
          }
          await updatedSubcriptionUser.save();
          break;
        case "customer.subscription.deleted":
          const customer = event.data.object.customer;
          const subEndUser = await UserData.findOne({
            where: { custKey: customer },
          });
          if (!subEndUser) break;
          subEndUser.subscriber = false;
          subEndUser.tier = "Free";
          subEndUser.subKey = "";
          subEndUser.current_period_end = Date.now();
          await subEndUser.save();
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
      res.json({ received: true });
    }
  );

  server.applyMiddleware({ app, cors: false });
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
};
main().catch((err) => console.log(err));

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
const webhookSecret = process.env.STRIPE_ENDPOINT_SECRET;
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST_KEY);
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
    entities: [UserData, Application, College, Ideas, SavedIdeas],
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
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
      },
    } as any)
  );
  app.post(
    "/webhook",
    express.json({ type: "application/json" }),
    (req, res) => {
      const sig = req.headers["stripe-signature"];
      let event;

      try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } catch (err) {
        res.status(400).send(`Improper webhook signature.`);
      }

      switch (event.type) {
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

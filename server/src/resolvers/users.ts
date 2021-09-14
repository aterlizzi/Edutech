import { MyContext } from "./../types/MyContext";
import { isUnauth } from "./authentications/isUnauth";
const voucher_codes = require("voucher-code-generator");
import { createUserInput } from "./inputs/createUserInput";
import { UserData } from "./../entity/User";
import {
  Arg,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import argon2 from "argon2";
import { sendMail } from "../utils/sendEmail";
import { createConfirmationUrl } from "../utils/createConfirmationUrl";
const { networkInterfaces } = require("os");
const nets = networkInterfaces();
const results = Object.create(null);

@Resolver()
export class UsersResolver {
  @Query(() => [UserData])
  async findUsers(): Promise<UserData[] | undefined> {
    return await UserData.find({
      relations: ["viewed", "referrer", "referred", "presets"],
    });
  }
  @Query(() => UserData, { nullable: true })
  async findUser(
    @Arg("id", () => Int) id: number
  ): Promise<UserData | undefined> {
    const user = await UserData.findOne(id, {
      relations: ["applications", "fApplications", "viewed"],
    });
    return user;
  }
  @UseMiddleware(isUnauth)
  @Mutation(() => UserData)
  async createUser(
    @Arg("options") { email, password, username }: createUserInput
  ): Promise<UserData> {
    const hash = await argon2.hash(password);
    const code = await generateCode();
    const ip_address = parseAddress();
    const user = await UserData.create({
      email: email,
      password: hash,
      username: username,
      referralCode: code,
      ip_address,
    }).save();
    await sendMail(email, await createConfirmationUrl(user.id));
    return user;
  }
  @Mutation(() => Boolean)
  async deleteUser(@Arg("email") email: string): Promise<boolean> {
    const user = await UserData.findOne({
      where: { email },
    });
    if (!user) return false;
    await UserData.delete(user.id);
    return true;
  }
  @Mutation(() => UserData, { nullable: true })
  async editUser(
    @Arg("id") id: number,
    @Arg("type") type: string,
    @Arg("value", { nullable: true }) value: string
  ): Promise<UserData | undefined> {
    const user = await UserData.findOne({ where: { id } });
    if (!user) return undefined;
    if (type === "ip_address") {
      user.ip_address = value;
    }
    if (type === "current_period_end") {
      user.current_period_end = 0;
    }
    return await user.save();
  }
  @Mutation(() => Boolean)
  async verifyCode(
    @Arg("code") code: string,
    @Ctx() ctx: MyContext
  ): Promise<boolean> {
    const user = await UserData.findOne({ where: { referralCode: code } });
    const me = await UserData.findOne({
      where: { id: ctx.req.session.userId },
    });
    const currentAddress = parseAddress();
    if (!user) return false;
    if (me) {
      if (me.redeemedReferralCoupon) return false;
      if (user.email === me.email) return false;
      // if (user.ip_address === me.ip_address) {
      //   const username = user.username;
      //   const email = user.email;
      //   sendAntiDupingMail(email, username);
      //   return false;
      // }
    }
    // else {
    //   if ((user.ip_address = currentAddress)) {
    //     const username = user.username;
    //     const email = user.email;
    //     sendAntiDupingMail(email, username);
    //     return false;
    //   }
    // }
    return true;
  }
}

const generateCode = async () => {
  const [code] = voucher_codes.generate({
    length: 8,
    count: 1,
  });
  const user = await UserData.findOne({ where: { referralCode: code } });
  if (user) {
    generateCode();
  } else {
    return code;
  }
};

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

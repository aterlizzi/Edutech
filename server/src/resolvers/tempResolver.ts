import { UserData } from "../entity/User";
import { Arg, Mutation, Resolver } from "type-graphql";
const voucher_codes = require("voucher-code-generator");

@Resolver()
export class tempResolver {
  @Mutation(() => UserData, { nullable: true })
  async addReferralCode(@Arg("id") id: number): Promise<UserData | null> {
    const user = await UserData.findOne(id);
    if (!user) return null;
    const [code] = voucher_codes.generate({
      length: 8,
      count: 1,
    });
    user.referralCode = code;
    await user.save();
    return user;
  }
}

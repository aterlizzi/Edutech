import { College } from "./../entity/College";
import { Query, Resolver } from "type-graphql";

@Resolver()
export class FindCollegesResolver {
  @Query(() => [College], { nullable: true })
  async findColleges(): Promise<College[] | undefined> {
    const colleges = await College.find({
      relations: ["acceptedApps", "rejectedApps", "waitlistedApps"],
    });
    if (!colleges) return undefined;
    return colleges;
  }
}

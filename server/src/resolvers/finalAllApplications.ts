import { Application } from "./../entity/Application";
import { Query, Resolver } from "type-graphql";

@Resolver()
export class FindAllApplicationsResolver {
  @Query(() => [Application], { nullable: true })
  async findAllApplications(): Promise<Application[] | undefined> {
    const apps = await Application.find({
      relations: [
        "acceptedColleges",
        "rejectedColleges",
        "waitlistedColleges",
        "viewers",
        "author",
        "fUsers",
      ],
    });
    if (!apps) return undefined;
    return apps;
  }
}

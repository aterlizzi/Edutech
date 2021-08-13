import { Application } from "./../entity/Application";
import { Arg, Mutation, Resolver } from "type-graphql";

@Resolver()
export class DeleteApplicationResolver {
  @Mutation(() => Boolean)
  async deleteApp(@Arg("id") id: number): Promise<boolean> {
    await Application.delete(id);
    return true;
  }
}

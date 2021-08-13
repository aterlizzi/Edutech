import { UserData } from "../../entity/User";
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ async: true })
export class IsUsernameExistsConstraint
  implements ValidatorConstraintInterface
{
  validate(username: string) {
    return UserData.findOne({ where: { username } }).then((user) => {
      if (user) return false;
      return true;
    });
  }
}

export function IsUsernameAlreadyExist(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUsernameExistsConstraint,
    });
  };
}

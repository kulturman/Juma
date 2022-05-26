import { Inject, Injectable } from "@nestjs/common";
import { registerDecorator, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { AuthService } from "src/auth/auth.service";

@ValidatorConstraint({name: 'isSame', async: true})
@Injectable()
export class IsSameConstraint implements ValidatorConstraintInterface {
    constructor(@Inject('AuthService') private authService: AuthService){}
    async validate(text: string, validationArguments?: ValidationArguments): Promise<boolean> {
        console.log(this.authService);
        const [relatedPropertyName] = validationArguments.constraints;
        const relatedValue = (validationArguments.object as any)[relatedPropertyName];
        return text === relatedValue;
    }
    defaultMessage?(validationArguments?: ValidationArguments): string {
        const { property } = validationArguments;
        const [relatedPropertyName] = validationArguments.constraints;
        return `${property} and ${relatedPropertyName} do not match`;
    }
}

export function IsSame(relatedProperty: string) {
    return (object: Object, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            constraints: [relatedProperty],
            propertyName: propertyName,
            validator: IsSameConstraint
        });
    }
}
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator-multi-lang";

@ValidatorConstraint({name: 'isSame'})
export class IsSameConstraint implements ValidatorConstraintInterface {
    validate(text: string, validationArguments?: ValidationArguments): boolean | Promise<boolean> {
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
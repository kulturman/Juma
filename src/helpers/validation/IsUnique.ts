import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { getManager } from 'typeorm';

@ValidatorConstraint({ name: 'isUnique' })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  async validate(
    text: string,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    let { table, column } = validationArguments.constraints[0];
    if (!column) {
      column = validationArguments.property;
    }
    const sql = `SELECT COUNT(*) AS rowsCount FROM ${table} WHERE ${column} = '${text}'`;
    const result = await getManager().query(sql);
    return result[0].rowsCount == '0';
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return 'Value is already used';
  }
}

export function IsUnique(params: UniqueConstraintFormat) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      constraints: [params],
      propertyName: propertyName,
      validator: IsUniqueConstraint,
    });
  };
}

export class UniqueConstraintFormat {
  table: string;
  column?: string;
}

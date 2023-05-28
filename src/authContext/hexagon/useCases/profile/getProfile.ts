import { AuthRepository } from '../../gateways/repositories/authRepository';
import * as _ from 'lodash';

export class GetProfile {
  constructor(private readonly authRepository: AuthRepository) {}
  async handle(userId: number): Promise<Profile> {
    const user = await this.authRepository.find(userId);

    return _.pick(user, ['id', 'fullname', 'email', 'createdAt']);
  }
}

export interface Profile {
  id: number;
  fullname: string;
  email: string;
  createdAt: Date;
}

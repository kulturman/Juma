import { EntityRepository, Repository } from "typeorm";
import { User } from "../entities/user.entity";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    constructor() {
        super();
    }

    async findD() {
        return await super.find();
    }
}
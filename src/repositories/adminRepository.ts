import { Admin } from "../models";
import { EntityRepository, Repository } from "typeorm";
import { AdminRepository } from "../interfaces";

@EntityRepository(Admin)
export default class AdminRepositoryImpl extends Repository<Admin>
  implements AdminRepository {
  public async findOneById(id: string): Promise<Admin> {
    return this.findOne({ id });
  }
}

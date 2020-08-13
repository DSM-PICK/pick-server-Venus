import { Admin } from "../models";
import { Repository, EntityRepository } from "typeorm";

@EntityRepository(Admin)
export default class AdminRepository extends Repository<Admin> {
  public async findOneById(id: string) {
    return this.findOne({ id });
  }
}

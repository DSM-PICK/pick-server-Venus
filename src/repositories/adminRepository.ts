import { Admin } from "../models";
import { Repository, EntityRepository } from "typeorm";

@EntityRepository(Admin)
export default class AdminRepository extends Repository<Admin> {
  public async findOneById(id: string): Promise<Admin> {
    return this.findOne({ id });
  }
}

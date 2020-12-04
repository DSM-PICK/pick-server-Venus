import { Admin } from "../models";
import { EntityRepository, Repository } from "typeorm";
import { IAdminRepository } from "../interfaces";

@EntityRepository(Admin)
export default class AdminRepository extends Repository<Admin>
  implements IAdminRepository {
  public async findOneById(id: string): Promise<Admin> {
    return this.findOne({ id });
  }
}

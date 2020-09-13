import { Admin } from "../../models";

export default interface IAdminRepository {
  findOneById(id: string): Promise<Admin>;
}

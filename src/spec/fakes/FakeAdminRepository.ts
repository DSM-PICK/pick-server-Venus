import { IAdminRepository } from "../../interfaces";
import { Admin } from "../../models";

export default class FakeAdminRepository implements IAdminRepository {
  private static _default: FakeAdminRepository;
  private id: string = "admin";

  public static get default(): FakeAdminRepository {
    if (!FakeAdminRepository._default) {
      FakeAdminRepository._default = new FakeAdminRepository();
    }
    return FakeAdminRepository._default;
  }

  public findOneById(id: string): Promise<Admin> {
    if (this.id !== id) {
      return null;
    }
    return new Promise<Admin>((resolve, reject) => {
      resolve({
        id: "admin",
        pw: "$2b$10$/R7u1pWQSi69COB2F1eJlOK5Vb0Ksf7RiD73D6gI7eBvsyCrBTqRy",
      });
    });
  }
}

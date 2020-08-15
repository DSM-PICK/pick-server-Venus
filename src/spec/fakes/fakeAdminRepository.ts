import { IAdminRepository } from "../../interfaces";
import { Admin } from "../../models";

const fakeAdminRepository: IAdminRepository = {
  findOneById(id: string): Promise<Admin> {
    if (id !== "admin") {
      return null;
    }
    return new Promise<Admin>((resolve, reject) =>
      resolve({
        id: "admin",
        pw: "$2b$10$/R7u1pWQSi69COB2F1eJlOK5Vb0Ksf7RiD73D6gI7eBvsyCrBTqRy",
      })
    );
  },
};

export default fakeAdminRepository;

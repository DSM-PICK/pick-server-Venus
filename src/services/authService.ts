import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { IAdmin, ILogger, IAdminRepository } from "../interfaces";
import { invalidLoginInformationError } from "../errors";

export default class AuthService {
  constructor(
    private adminRepository: IAdminRepository,
    private logger: ILogger,
    private jwtSecret: string
  ) {}

  public async signIn(
    adminDTO: IAdmin
  ): Promise<{ access_token: string; refresh_token: string }> {
    const adminRecord = await this.adminRepository.findOneById(adminDTO.id);
    if (
      adminRecord === null ||
      this.isInvalidPassword(adminRecord.pw, adminDTO.pw)
    ) {
      throw invalidLoginInformationError;
    }
    const access_token = this.generateToken(adminRecord.id, "access");
    const refresh_token = this.generateToken(adminRecord.id, "refresh");
    return { access_token, refresh_token };
  }

  private generateToken(id, type): string {
    const generatedToken = jwt.sign({ id, type }, this.jwtSecret, {
      expiresIn: type === "access" ? "30m" : type === "refresh" ? "14d" : 0,
    });
    this.logger.debug("token generated");
    return generatedToken;
  }

  private isInvalidPassword(
    dbPassword: string,
    inputPassword: string
  ): boolean {
    this.logger.debug("validating password");
    return !bcrypt.compareSync(inputPassword, dbPassword);
  }
}

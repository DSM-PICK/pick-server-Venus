import { Inject, Service } from "typedi";
import { Logger } from "winston";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { AdminInterface } from "../interfaces/adminInterface";
import { AdminRepository } from "../repositories";
import config from "../config";
import { invalidLoginInformationError } from "../errors";
import { InjectRepository } from "typeorm-typedi-extensions";

@Service()
export default class AuthService {
  constructor(
    @InjectRepository() private adminRepository: AdminRepository,
    @Inject("logger") private logger: Logger
  ) {}

  public async signIn(
    adminDTO: AdminInterface
  ): Promise<{ access_token: string; refresh_token: string }> {
    const adminRecord = await this.adminRepository.findOneById(adminDTO.id);
    if (!adminRecord || !this.isValidPassword(adminRecord.pw, adminDTO.pw)) {
      throw invalidLoginInformationError;
    }
    const access_token = this.generateToken(adminRecord.id, "access");
    const refresh_token = this.generateToken(adminRecord.id, "refresh");
    return { access_token, refresh_token };
  }

  private generateToken(id, type): string {
    const generatedToken = jwt.sign({ id, type }, config.jwtSecret, {
      expiresIn: type === "access" ? "30m" : type === "refresh" ? "14d" : 0,
    });
    this.logger.debug("token generated");
    return generatedToken;
  }

  private isValidPassword(dbPassword: string, inputPassword: string): boolean {
    this.logger.debug("validating password");
    return bcrypt.compareSync(inputPassword, dbPassword);
  }
}

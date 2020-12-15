import { NextFunction, Request, Response } from "express";
import { Admin, AdminRepository } from "../interfaces";
import { getConnection, getCustomRepository } from "typeorm";
import { AdminRepositoryImpl } from "../repositories";
import AuthService from "../services/authService";
import config from "../config";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { expiredTokenError, invalidTokenError } from "../errors";

export default class AuthController {
  private adminRepository: AdminRepository = getCustomRepository(
    AdminRepositoryImpl
  );
  private authService = new AuthService(this.adminRepository, config.jwtSecret);

  public signIn = async (req: Request, res: Response, next: NextFunction) => {
    const admin: Admin = req.body;
    const tokens = await this.authService.signIn(admin);
    return res.status(200).json(tokens);
  };

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    const refresh_token = req.get("x-refresh-token");
    try {
      const accessToken = this.authService.tokenRefresh({
        refresh_token,
      });
      res.status(200).json(accessToken);
    } catch (e) {
      if (e === TokenExpiredError) {
        return next(expiredTokenError);
      } else if (e === JsonWebTokenError) {
        return next(invalidTokenError);
      }
      next(e);
    }
  };
}

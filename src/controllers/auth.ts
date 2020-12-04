import { NextFunction, Request, Response } from "express";
import { Admin } from "../interfaces/admin";
import { getCustomRepository } from "typeorm";
import { AdminRepository } from "../repositories";
import AuthService from "../services/authService";
import config from "../config";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { expiredTokenError, invalidTokenError } from "../errors";

export default class AuthController {
  static adminRepository = getCustomRepository(AdminRepository);
  static authService = new AuthService(
    AuthController.adminRepository,
    config.jwtSecret
  );

  static signIn = async (req: Request, res: Response, next: NextFunction) => {
    const admin: Admin = req.body;
    const tokens = await AuthController.authService.signIn(admin);
    return res.status(200).json(tokens);
  };

  static signUp = async (req: Request, res: Response, next: NextFunction) => {
    const refresh_token = req.get("x-refresh-token");
    try {
      const accessToken = AuthController.authService.tokenRefresh({
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

import { Router, Request, Response, NextFunction } from "express";
import { getCustomRepository } from "typeorm";

import { IAdmin } from "../../interfaces";
import { AuthService } from "../../services";
import { AdminRepository } from "../../repositories";
import {
  loginSchema,
  refreshSchema,
} from "../middlewares/paramValidation/schema";
import config from "../../config";
import logger from "../../loaders/logger";
import validate from "../middlewares/paramValidation";
import {
  expiredTokenError,
  invalidParameterError,
  invalidTokenError,
} from "../../errors";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

const route = Router();

export default (app: Router) => {
  app.use("/auth", route);

  const adminRepository = getCustomRepository(AdminRepository);
  const authService = new AuthService(
    adminRepository,
    logger,
    config.jwtSecret
  );

  route.post(
    "/",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await validate({ schema: loginSchema, value: req.body });
        next();
      } catch {
        next(invalidParameterError);
      }
    },
    async (req: Request, res: Response, next: NextFunction) => {
      const admin: IAdmin = req.body;
      try {
        const tokens = await authService.signIn(admin);
        return res.status(200).json(tokens);
      } catch (e) {
        return next(e);
      }
    }
  );

  route.patch(
    "/",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await validate({ schema: refreshSchema, value: req.headers });
        next();
      } catch {
        next(invalidParameterError);
      }
    },
    (req: Request, res: Response, next: NextFunction) => {
      const refresh_token = req.get("x-refresh-token");
      try {
        const accessToken = authService.tokenRefresh({
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
    }
  );
};

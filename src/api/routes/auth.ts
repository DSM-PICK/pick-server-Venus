import { NextFunction, Request, Response, Router } from "express";
import { getCustomRepository } from "typeorm";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

import { IAdmin } from "../../interfaces";
import { AuthService } from "../../services";
import { AdminRepository } from "../../repositories";
import {
  loginSchema,
  refreshSchema,
} from "../middlewares/paramValidation/schema";
import config from "../../config";
import validate, { Property } from "../middlewares/paramValidation";
import { expiredTokenError, invalidTokenError } from "../../errors";
import isAuth from "../middlewares/tokenVerification";

const route = Router();

export default (app: Router) => {
  app.use("/auth", route);

  const adminRepository = getCustomRepository(AdminRepository);
  const authService = new AuthService(adminRepository, config.jwtSecret);

  route.post(
    "/",
    validate({ schema: loginSchema, property: Property.BODY }),
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
    validate({ schema: refreshSchema, property: Property.HEADERS }),
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

  route.get("/check", isAuth, (req: Request, res: Response) => {
    res.status(200).json();
  });
};

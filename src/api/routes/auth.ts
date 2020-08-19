import { Router, Request, Response, NextFunction } from "express";
import { getCustomRepository } from "typeorm";

import { IAdmin } from "../../interfaces";
import { AuthService } from "../../services";
import { AdminRepository } from "../../repositories";
import { loginSchema } from "../middlewares/paramValidation/schema";
import config from "../../config";
import logger from "../../loaders/logger";
import validate from "../middlewares/paramValidation";

const route = Router();

export default (app: Router) => {
  app.use("/auth", route);

  route.post(
    "/",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await validate({ schema: loginSchema, value: req.body });
        next();
      } catch (e) {
        next(e);
      }
    },
    async (req: Request, res: Response, next: NextFunction) => {
      const admin: IAdmin = req.body;
      const adminRepository = getCustomRepository(AdminRepository);
      const authService = new AuthService(
        adminRepository,
        logger,
        config.jwtSecret
      );
      try {
        const tokens = await authService.signIn(admin);
        return res.status(200).json(tokens);
      } catch (e) {
        return next(e);
      }
    }
  );
};

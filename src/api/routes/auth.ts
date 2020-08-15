import { Router, Request, Response, NextFunction } from "express";
import { getCustomRepository } from "typeorm";
import * as Joi from "joi";

import { IAdmin } from "../../interfaces";
import { AuthService } from "../../services";
import { invalidParameterError } from "../../errors";
import { AdminRepository } from "../../repositories";
import config from "../../config";
import logger from "../../loaders/logger";

const route = Router();

export default (app: Router) => {
  app.use("/auth", route);

  route.post(
    "/login",
    async (req: Request, res: Response, next: NextFunction) => {
      const loginSchema = Joi.object()
        .keys({
          id: Joi.string().required(),
          pw: Joi.string().required(),
        })
        .unknown();

      try {
        await loginSchema.validateAsync(req.body);
        next();
      } catch (e) {
        next(invalidParameterError);
      }
    },
    async (req: Request, res: Response, next: NextFunction) => {
      const adminDTO: IAdmin = req.body;
      const adminRepository = getCustomRepository(AdminRepository);
      const authService = new AuthService(
        adminRepository,
        logger,
        config.jwtSecret
      );
      try {
        const tokens = await authService.signIn(adminDTO);
        return res.status(200).json(tokens);
      } catch (e) {
        return next(e);
      }
    }
  );
};

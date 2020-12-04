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
import tryCatchHandler from "../middlewares/tryCatchHandler";
import AuthController from "../../controllers/auth";

const route = Router();

export default (app: Router) => {
  app.use("/auth", route);

  route.post(
    "/",
    validate({ schema: loginSchema, property: Property.BODY }),
    tryCatchHandler(AuthController.signIn)
  );

  route.patch(
    "/",
    validate({ schema: refreshSchema, property: Property.HEADERS }),
    AuthController.signUp
  );

  route.get("/check", isAuth, (req: Request, res: Response) => {
    res.status(200).json();
  });
};

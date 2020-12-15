import { Request, Response, Router } from "express";

import {
  loginSchema,
  refreshSchema,
} from "../middlewares/paramValidation/schema";
import validate, { Property } from "../middlewares/paramValidation";
import isAuth from "../middlewares/tokenVerification";
import tryCatchHandler from "../middlewares/tryCatchHandler";
import AuthController from "../../controllers/auth";

const route = Router();

export default (app: Router) => {
  const authController = new AuthController();

  app.use("/auth", route);

  route.post(
    "/",
    validate({ schema: loginSchema, property: Property.BODY }),
    tryCatchHandler(authController.signIn)
  );

  route.patch(
    "/",
    validate({ schema: refreshSchema, property: Property.HEADERS }),
    authController.signUp
  );

  route.get("/check", isAuth, (req: Request, res: Response) => {
    res.status(200).json();
  });
};

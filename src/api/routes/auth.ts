import { Router, Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import * as Joi from "joi";
import { AdminInterface } from "../../interfaces/adminInterface";
import { AuthService } from "../../services";
import { invalidParameterError } from "../../errors";
const route = Router();

export default (app: Router) => {
  app.use("/auth", route);

  route.post(
    "/login",
    async (req: Request, res: Response, next: NextFunction) => {
      const loginSchema = Joi.object().keys({
        id: Joi.string().required(),
        pw: Joi.string().required(),
      });
      try {
        await loginSchema.validateAsync(req.body);
        next();
      } catch (e) {
        next(invalidParameterError);
      }
    },
    async (req: Request, res: Response, next: NextFunction) => {
      const adminDTO: AdminInterface = req.body;
      const authService: AuthService = Container.get("AuthService");
      try {
        const tokens = await authService.signIn(adminDTO);
        return res.status(200).json(tokens);
      } catch (e) {
        return next(e);
      }
    }
  );
};

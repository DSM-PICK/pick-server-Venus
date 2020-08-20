import { Request, Response, NextFunction, Router } from "express";

import { authSchema } from "../middlewares/paramValidation/schema";
import validate from "../middlewares/paramValidation";
import ClubService from "../../services/clubService";
import ClubRepository from "../../repositories/clubRepository";
import logger from "../../loaders/logger";
import isAuth from "../middlewares/tokenVerification";

const route = Router();

export default (app: Router) => {
  app.use("/club", route);

  route.get(
    "/",
    isAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      const clubRepository = new ClubRepository();
      const clubService = new ClubService(clubRepository, logger);
      try {
        const clubs = await clubService.getClubs();
        res.json(200).json(clubs);
      } catch (e) {
        next(e);
      }
    }
  );
};

import { NextFunction, Request, Response, Router } from "express";

import isAuth from "../middlewares/tokenVerification";
import ClubRepository from "../../repositories/clubRepository";
import ClubService from "../../services/clubService";
import logger from "../../loaders/logger";
import ClubLocationRepository from "../../repositories/clubLocationRepository";

const route = Router();

export default (app: Router) => {
  app.use("/clubs", route);

  route.get(
    "/",
    isAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      const clubRepository = new ClubRepository();
      const clubLocationRepository = new ClubLocationRepository();
      const clubService = new ClubService(
        clubRepository,
        clubLocationRepository,
        logger
      );
      try {
        const clubs = await clubService.getClubs();
        res.json(200).json(clubs);
      } catch (e) {
        next(e);
      }
    }
  );
};

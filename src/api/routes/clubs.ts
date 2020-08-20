import { NextFunction, Request, Response, Router } from "express";

import isAuth from "../middlewares/tokenVerification";
import ClubRepository from "../../repositories/clubRepository";
import ClubService from "../../services/clubService";
import logger from "../../loaders/logger";
import ClubLocationRepository from "../../repositories/clubLocationRepository";
import { getCustomRepository } from "typeorm";

const route = Router();

export default (app: Router) => {
  app.use("/clubs", route);

  const clubRepository = getCustomRepository(ClubRepository);
  const clubLocationRepository = getCustomRepository(ClubLocationRepository);
  const clubService = new ClubService(
    clubRepository,
    clubLocationRepository,
    logger
  );

  route.get(
    "/",
    isAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const clubs = await clubService.getClubs();
        res.status(200).json(clubs);
      } catch (e) {
        console.log(e);
        next(e);
      }
    }
  );
};

import { Request, Response, NextFunction, Router } from "express";

import validate from "../middlewares/paramValidation";
import isAuth from "../middlewares/tokenVerification";
import { clubSchema } from "../middlewares/paramValidation/schema";
import { invalidParameterError } from "../../errors";
import { IClub } from "../../interfaces";
import { ClubRepository, ClubLocationRepository } from "../../repositories";
import ClubService from "../../services/clubService";
import logger from "../../loaders/logger";
import { getCustomRepository } from "typeorm";

const route = Router();

export default (app: Router) => {
  app.use("/club", route);

  const clubRepository = getCustomRepository(ClubRepository);
  const clubLocationRepository = getCustomRepository(ClubLocationRepository);
  const clubService = new ClubService(
    clubRepository,
    clubLocationRepository,
    logger
  );

  route.post(
    "/",
    isAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await validate({ schema: clubSchema, value: req.body });
        next();
      } catch {
        next(invalidParameterError);
      }
    },
    async (req: Request, res: Response, next: NextFunction) => {
      const club: IClub = req.body;
      try {
        const createdClub = await clubService.addClub(club);
        res.status(200).json(createdClub);
      } catch (e) {
        next(e);
      }
    }
  );
};

import { NextFunction, Request, Response, Router } from "express";
import { getCustomRepository } from "typeorm";

import isAuth from "../middlewares/tokenVerification";
import ClubRepository from "../../repositories/clubRepository";
import ClubService from "../../services/clubService";
import { ClubLocationRepository, StudentRepository } from "../../repositories";

const route = Router();

export default (app: Router) => {
  app.use("/clubs", route);

  const clubRepository = getCustomRepository(ClubRepository);
  const clubLocationRepository = getCustomRepository(ClubLocationRepository);
  const studentRepository = getCustomRepository(StudentRepository);
  const clubService = new ClubService(
    clubRepository,
    clubLocationRepository,
    studentRepository
  );

  route.get(
    "/",
    isAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const clubs = await clubService.getClubs();
        res.status(200).json(clubs);
      } catch (e) {
        next(e);
      }
    }
  );
};

import { Request, Response, NextFunction, Router } from "express";

import validate from "../middlewares/paramValidation";
import isAuth from "../middlewares/tokenVerification";
import {
  clubSchema,
  deleteClubSchema,
  getClubNameSchema,
} from "../middlewares/paramValidation/schema";
import { invalidParameterError } from "../../errors";
import { IClub } from "../../interfaces";
import { ClubRepository, ClubLocationRepository } from "../../repositories";
import ClubService from "../../services/clubService";
import logger from "../../loaders/logger";
import { getCustomRepository } from "typeorm";
import StudentRepository from "../../repositories/studentRepository";

const route = Router();

export default (app: Router) => {
  app.use("/club", route);

  const clubRepository = getCustomRepository(ClubRepository);
  const clubLocationRepository = getCustomRepository(ClubLocationRepository);
  const studentRepository = getCustomRepository(StudentRepository);
  const clubService = new ClubService(
    clubRepository,
    clubLocationRepository,
    studentRepository,
    logger
  );

  route.get(
    "/:name",
    isAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await validate({ schema: getClubNameSchema, value: req.params });
        next();
      } catch {
        next(invalidParameterError);
      }
    },
    async (req: Request, res: Response, next: NextFunction) => {
      const { name } = req.params;
      try {
        const clubAndStudents = await clubService.getClubByNameWithStudents(
          name
        );
        res.status(200).json(clubAndStudents);
      } catch (e) {
        next(e);
      }
    }
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

  route.delete(
    "/:name",
    isAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await validate({ schema: deleteClubSchema, value: req.params });
        next();
      } catch {
        next(invalidParameterError);
      }
    },
    async (req: Request, res: Response, next: NextFunction) => {
      const name = req.params.name;
      try {
        await clubService.deleteClub(name);
        res.status(200).json();
      } catch (e) {
        next(e);
      }
    }
  );
};

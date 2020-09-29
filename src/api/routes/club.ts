import { NextFunction, Request, Response, Router } from "express";
import { getCustomRepository } from "typeorm";

import validate, { Property } from "../middlewares/paramValidation";
import isAuth from "../middlewares/tokenVerification";
import {
  clubSchema,
  deleteClubSchema,
  getClubNameSchema,
  patchClubSchema,
  updateClubBodySchema,
  updateClubParamSchema,
} from "../middlewares/paramValidation/schema";
import { IClub, IPatchClubRequest, IUpdateClub } from "../../interfaces";
import { ClubLocationRepository, ClubRepository } from "../../repositories";
import ClubService from "../../services/clubService";
import logger from "../../loaders/logger";
import StudentRepository from "../../repositories/studentRepository";
import StudentService from "../../services/studentService";

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
  const studentService = new StudentService(studentRepository, clubRepository);

  route.patch(
    "/students",
    isAuth,
    validate({ schema: patchClubSchema, property: Property.BODY }),
    async (req: Request, res: Response, next: NextFunction) => {
      const moveInfo: IPatchClubRequest = req.body;
      const { students_num, to_club_name } = moveInfo;
      try {
        await studentService.updateStudentClub(to_club_name, students_num);
        res.status(200).json();
      } catch (e) {
        next(e);
      }
    }
  );

  route.post(
    "/",
    isAuth,
    validate({ schema: clubSchema, property: Property.BODY }),
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

  route.get(
    "/:name",
    isAuth,
    validate({ schema: getClubNameSchema, property: Property.PARAMS }),
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

  route.delete(
    "/:name",
    isAuth,
    validate({ schema: deleteClubSchema, property: Property.PARAMS }),
    async (req: Request, res: Response, next: NextFunction) => {
      const { name } = req.params;
      try {
        await clubService.deleteClub(name);
        res.status(200).json();
      } catch (e) {
        next(e);
      }
    }
  );

  route.patch(
    "/:name",
    isAuth,
    validate({ schema: updateClubParamSchema, property: Property.PARAMS }),
    validate({ schema: updateClubBodySchema, property: Property.BODY }),
    async (req: Request, res: Response, next: NextFunction) => {
      const { name } = req.params;
      const clubInfoWillChange: IUpdateClub = req.body;
      try {
        await clubService.updateClubInformation(name, clubInfoWillChange);
        res.status(200).json();
      } catch (e) {
        next(e);
      }
    }
  );
};

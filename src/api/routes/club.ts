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
import {
  ClubLocationRepository,
  ClubRepository,
  NoticeRepository,
} from "../../repositories";
import ClubService from "../../services/clubService";
import StudentRepository from "../../repositories/studentRepository";
import StudentService from "../../services/studentService";
import getNoticeEventEvmitter, {
  clubAdd,
  clubDelete,
  clubInfoChange,
  studentClubChange,
} from "../../loaders/noticeEventEvmitter";

const route = Router();

export default (app: Router) => {
  app.use("/club", route);

  const clubRepository = getCustomRepository(ClubRepository);
  const clubLocationRepository = getCustomRepository(ClubLocationRepository);
  const studentRepository = getCustomRepository(StudentRepository);
  const noticeRepository = getCustomRepository(NoticeRepository);
  const clubService = new ClubService(
    clubRepository,
    clubLocationRepository,
    studentRepository
  );
  const studentService = new StudentService(studentRepository, clubRepository);
  const noticeEventEmitter = getNoticeEventEvmitter(noticeRepository);

  route.patch(
    "/students",
    isAuth,
    validate({ schema: patchClubSchema, property: Property.BODY }),
    async (req: Request, res: Response, next: NextFunction) => {
      const moveInfo: IPatchClubRequest = req.body;
      const { students_num, to_club_name } = moveInfo;
      try {
        const students = await studentService.getStudentsByNums(students_num);
        await studentService.updateStudentClub(to_club_name, students_num);
        const clubAndName = {};
        for (let student of students) {
          const { club_name, name } = student;
          if (!clubAndName[club_name]) {
            clubAndName[club_name] = [];
          }
          clubAndName[club_name].push(name);
        }
        const { id } = res.locals.payload;
        for (let clubName in clubAndName) {
          noticeEventEmitter.emit(
            studentClubChange,
            clubName,
            to_club_name,
            clubAndName[clubName],
            id
          );
        }
        res.status(200).json();
      } catch (e) {
        console.log(e);
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
        const { name, location } = club;
        const { id } = res.locals.payload;
        noticeEventEmitter.emit(clubAdd, name, location, id);
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
        const { location } = await clubService.getClubByName(name);
        await clubService.deleteClub(name);
        const { id } = res.locals.payload;
        noticeEventEmitter.emit(clubDelete, name, location, id);
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
        const beforeClub = await clubService.getClubByName(name);
        await clubService.updateClubInformation(name, clubInfoWillChange);
        const { id } = res.locals.payload;
        noticeEventEmitter.emit(
          clubInfoChange,
          beforeClub,
          clubInfoWillChange,
          id
        );
        res.status(200).json();
      } catch (e) {
        next(e);
      }
    }
  );
};

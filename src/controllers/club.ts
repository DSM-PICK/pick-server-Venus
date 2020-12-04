import { NextFunction, Request, Response } from "express";
import { getCustomRepository } from "typeorm";

import { PatchClubRequest } from "../interfaces/other";
import getNoticeEventEmitter, {
  clubAdd,
  clubDelete,
  clubInfoChange,
  studentClubChange,
} from "../loaders/noticeEventEmitter";
import StudentService from "../services/studentService";
import {
  ClubLocationRepository,
  ClubRepository,
  NoticeRepository,
  StudentRepository,
} from "../repositories";
import { Club, UpdateClubRequest } from "../interfaces/club";
import ClubService from "../services/clubService";

export default class ClubController {
  static studentRepository = getCustomRepository(StudentRepository);
  static clubRepository = getCustomRepository(ClubRepository);
  static noticeRepository = getCustomRepository(NoticeRepository);
  static clubLocationRepository = getCustomRepository(ClubLocationRepository);
  static studentService = new StudentService(
    ClubController.studentRepository,
    ClubController.clubRepository
  );
  static clubService = new ClubService(
    ClubController.clubRepository,
    ClubController.clubLocationRepository,
    ClubController.studentRepository
  );
  static noticeEventEmitter = getNoticeEventEmitter(
    ClubController.noticeRepository
  );

  static moveStudentsClub = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const moveInfo: PatchClubRequest = req.body;
    const { students_num, to_club_name } = moveInfo;
    const students = await ClubController.studentService.getStudentsByNums(
      students_num
    );
    await ClubController.studentService.updateStudentClub(
      to_club_name,
      students_num
    );
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
      ClubController.noticeEventEmitter.emit(
        studentClubChange,
        clubName,
        to_club_name,
        clubAndName[clubName],
        id
      );
    }
    res.status(200).json();
  };

  static createClub = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const club: Club = req.body.club;
    const studentsNum: string[] = req.body.students_num;
    const createdClub = await ClubController.clubService.addClub(
      club,
      studentsNum
    );
    const { name, location } = club;
    const { id } = res.locals.payload;
    ClubController.noticeEventEmitter.emit(clubAdd, name, location, id);
    res.status(200).json(createdClub);
  };

  static deleteClub = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { name } = req.params;
    const { location } = await ClubController.clubService.getClubByName(name);
    await ClubController.clubService.deleteClub(name);
    const { id } = res.locals.payload;
    ClubController.noticeEventEmitter.emit(clubDelete, name, location, id);
    res.status(200).json();
  };

  static updateClubInformation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { name } = req.params;
    const clubInfoWillChange: UpdateClubRequest = req.body;
    const beforeClub = await ClubController.clubService.getClubByName(name);
    await ClubController.clubService.updateClubInformation(
      name,
      clubInfoWillChange
    );
    const { id } = res.locals.payload;
    ClubController.noticeEventEmitter.emit(
      clubInfoChange,
      beforeClub,
      clubInfoWillChange,
      id
    );
    res.status(200).json();
  };

  static getClubInformation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { name } = req.params;
    const clubAndStudents = await ClubController.clubService.getClubByNameWithStudents(
      name
    );
    res.status(200).json(clubAndStudents);
  };

  static getAllClubs = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const clubs = await ClubController.clubService.getClubs();
    res.status(200).json(clubs);
  };
}

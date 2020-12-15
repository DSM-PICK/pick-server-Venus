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
  ClubLocationRepositoryImpl,
  ClubRepositoryImpl,
  NoticeRepositoryImpl,
  StudentRepositoryImpl,
} from "../repositories";
import { Club, UpdateClubRequest } from "../interfaces/club";
import ClubService from "../services/clubService";

export default class ClubController {
  private studentRepository = getCustomRepository(StudentRepositoryImpl);
  private clubRepository = getCustomRepository(ClubRepositoryImpl);
  private noticeRepository = getCustomRepository(NoticeRepositoryImpl);
  private clubLocationRepository = getCustomRepository(
    ClubLocationRepositoryImpl
  );
  private studentService = new StudentService(
    this.studentRepository,
    this.clubRepository
  );
  private clubService = new ClubService(
    this.clubRepository,
    this.clubLocationRepository,
    this.studentRepository
  );
  private noticeEventEmitter = getNoticeEventEmitter(this.noticeRepository);

  public moveStudentsClub = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const moveInfo: PatchClubRequest = req.body;
    const { students_num, to_club_name } = moveInfo;
    const students = await this.studentService.getStudentsByNums(students_num);
    await this.studentService.updateStudentClub(to_club_name, students_num);
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
      this.noticeEventEmitter.emit(
        studentClubChange,
        clubName,
        to_club_name,
        clubAndName[clubName],
        id
      );
    }
    res.status(200).json();
  };

  public createClub = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const club: Club = req.body.club;
    const studentsNum: string[] = req.body.students_num;
    const createdClub = await this.clubService.addClub(club, studentsNum);
    const { name, location } = club;
    const { id } = res.locals.payload;
    this.noticeEventEmitter.emit(clubAdd, name, location, id);
    res.status(200).json(createdClub);
  };

  public deleteClub = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { name } = req.params;
    const { location } = await this.clubService.getClubByName(name);
    await this.clubService.deleteClub(name);
    const { id } = res.locals.payload;
    this.noticeEventEmitter.emit(clubDelete, name, location, id);
    res.status(200).json();
  };

  public updateClubInformation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { name } = req.params;
    const clubInfoWillChange: UpdateClubRequest = req.body;
    const beforeClub = await this.clubService.getClubByName(name);
    await this.clubService.updateClubInformation(name, clubInfoWillChange);
    const { id } = res.locals.payload;
    this.noticeEventEmitter.emit(
      clubInfoChange,
      beforeClub,
      clubInfoWillChange,
      id
    );
    res.status(200).json();
  };

  public getClubInformation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { name } = req.params;
    const clubAndStudents = await this.clubService.getClubByNameWithStudents(
      name
    );
    res.status(200).json(clubAndStudents);
  };

  public getAllClubs = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const clubs = await this.clubService.getClubs();
    res.status(200).json(clubs);
  };
}

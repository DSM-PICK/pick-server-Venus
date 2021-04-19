import { NextFunction, Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import TeacherRepositoryImpl from "../repositories/teacherRepository";
import TeacherService from "../services/teacherService";

export default class TeacherController {
  private teacherRepository = getCustomRepository(TeacherRepositoryImpl);
  private teacherService = new TeacherService(this.teacherRepository);

  public searchTeachers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { name } = req.params;
    const searchResult = await this.teacherService.findTeachersByName(name);
    res.status(200).json(searchResult);
  };
}

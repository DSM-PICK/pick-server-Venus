import { getCustomRepository } from "typeorm";
import { ClubRepositoryImpl, StudentRepositoryImpl } from "../repositories";
import StudentService from "../services/studentService";
import { NextFunction, Request, Response } from "express";

export default class StudentController {
  private studentRepository = getCustomRepository(StudentRepositoryImpl);
  private clubRepository = getCustomRepository(ClubRepositoryImpl);
  private studentService = new StudentService(
    this.studentRepository,
    this.clubRepository
  );

  public searchStudents = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { num_and_name } = req.query;
    const searchResult = await this.studentService.getStudentsByNumAndName(
      num_and_name as string
    );
    res.status(200).json(searchResult);
  };
}

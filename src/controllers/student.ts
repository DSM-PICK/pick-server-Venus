import { getCustomRepository } from "typeorm";
import { ClubRepositoryImpl, StudentRepositoryImpl } from "../repositories";
import StudentService from "../services/studentService";
import { NextFunction, Request, Response } from "express";

export default class StudentController {
  static studentRepository = getCustomRepository(StudentRepositoryImpl);
  static clubRepository = getCustomRepository(ClubRepositoryImpl);
  static studentService = new StudentService(
    StudentController.studentRepository,
    StudentController.clubRepository
  );

  static searchStudents = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { num_and_name } = req.query;
    const searchResult = await StudentController.studentService.getStudentsByNumAndName(
      num_and_name as string
    );
    res.status(200).json(searchResult);
  };
}

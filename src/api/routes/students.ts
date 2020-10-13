import { NextFunction, Request, Response, Router } from "express";
import { getCustomRepository } from "typeorm";

import isAuth from "../middlewares/tokenVerification";
import validate, { Property } from "../middlewares/paramValidation";
import { getStudentSearchSchema } from "../middlewares/paramValidation/schema";
import StudentService from "../../services/studentService";
import { ClubRepository, StudentRepository } from "../../repositories";

const route = Router();

export default (app: Router) => {
  app.use("/students", route);

  const studentRepository = getCustomRepository(StudentRepository);
  const clubRepository = getCustomRepository(ClubRepository);
  const studentService = new StudentService(studentRepository, clubRepository);

  route.get(
    "/search",
    isAuth,
    validate({ schema: getStudentSearchSchema, property: Property.QUERY }),
    async (req: Request, res: Response, next: NextFunction) => {
      const { num_and_name } = req.query;
      try {
        const searchResult = await studentService.getStudentsByNumAndName(
          num_and_name as string
        );
        res.status(200).json(searchResult);
      } catch (e) {
        next(e);
      }
    }
  );
};

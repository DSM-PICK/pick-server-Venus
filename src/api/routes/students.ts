import { Router } from "express";

import isAuth from "../middlewares/tokenVerification";
import validate, { Property } from "../middlewares/paramValidation";
import { getStudentSearchSchema } from "../middlewares/paramValidation/schema";
import tryCatchHandler from "../middlewares/tryCatchHandler";
import StudentController from "../../controllers/student";

const route = Router();

export default (app: Router) => {
  const studentController = new StudentController();

  app.use("/students", route);

  route.get(
    "/search",
    isAuth,
    validate({ schema: getStudentSearchSchema, property: Property.QUERY }),
    tryCatchHandler(studentController.searchStudents)
  );
};

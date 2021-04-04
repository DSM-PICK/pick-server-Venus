import { Router } from "express";

import isAuth from "../middlewares/tokenVerification";
import TeacherController from "../../controllers/teacher";
import validate, { Property } from "../middlewares/paramValidation";
import teacherSearchSchema from "../middlewares/paramValidation/schema/teacherSearchSchema";
import tryCatchHandler from "../middlewares/tryCatchHandler";

const route = Router();

export default (app: Router) => {
	const teacherController = new TeacherController();

	app.use('/teachers', route);

	route.get('/search/:name', isAuth, validate({ schema: teacherSearchSchema, property: Property.PARAMS }), tryCatchHandler(teacherController.searchTeachers));
}
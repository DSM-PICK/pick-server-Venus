import { Router } from "express";

import isAuth from "../middlewares/tokenVerification";
import tryCatchHandler from "../middlewares/tryCatchHandler";
import ClubController from "../../controllers/club";
import validate, { Property } from "../middlewares/paramValidation";
import searchClubMemberSchema from "../middlewares/paramValidation/schema/searchClubMemberSchema";

const route = Router();

export default (app: Router) => {
  const clubController = new ClubController();

  app.use("/clubs", route);

  route.get("/", isAuth, tryCatchHandler(clubController.getAllClubs));
  route.get(
    "/student-name/:name",
    isAuth,
    validate({ schema: searchClubMemberSchema, property: Property.PARAMS }),
    tryCatchHandler(clubController.getClubsContainStudent)
  );
};

import { Router } from "express";

import validate, { Property } from "../middlewares/paramValidation";
import isAuth from "../middlewares/tokenVerification";
import {
  addClubSchema,
  deleteClubSchema,
  getClubNameSchema,
  patchClubSchema,
  updateClubBodySchema,
  updateClubParamSchema,
} from "../middlewares/paramValidation/schema";
import tryCatchHandler from "../middlewares/tryCatchHandler";
import ClubController from "../../controllers/club";

const route = Router();

export default (app: Router) => {
  const clubController = new ClubController();

  app.use("/club", route);

  route.patch(
    "/students",
    isAuth,
    validate({ schema: patchClubSchema, property: Property.BODY }),
    tryCatchHandler(clubController.moveStudentsClub)
  );

  route.post(
    "/",
    isAuth,
    validate({ schema: addClubSchema, property: Property.BODY }),
    tryCatchHandler(clubController.createClub)
  );

  route.get(
    "/:name",
    isAuth,
    validate({ schema: getClubNameSchema, property: Property.PARAMS }),
    tryCatchHandler(clubController.getClubInformation)
  );

  route.delete(
    "/:name",
    isAuth,
    validate({ schema: deleteClubSchema, property: Property.PARAMS }),
    tryCatchHandler(clubController.deleteClub)
  );

  route.patch(
    "/:name",
    isAuth,
    validate({ schema: updateClubParamSchema, property: Property.PARAMS }),
    validate({ schema: updateClubBodySchema, property: Property.BODY }),
    tryCatchHandler(clubController.updateClubInformation)
  );
};
